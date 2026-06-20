"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResultsEditor } from "@/features/hackathon-results/components/results-editor";
import { handleApiError } from "@core/utils/api-client";
import type {
  Award,
  AwardRequest,
  Criterion,
  CriterionRequest,
  EvaluationScore,
  EvaluationSummary,
  Hackathon,
  Participant,
  Team,
} from "@core/types/hackathon";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  createAward,
  createCriterion,
  deleteAward,
  deleteCriterion,
  deleteTeam,
  submitTeamEvaluation,
  updateAward,
  updateCriterion,
} from "../api";
import {
  AwardDialog,
  ConfirmDeleteDialog,
  CriterionDialog,
  ScoringDialog,
} from "./management/dialogs";
import {
  AwardsTab,
  CriteriaTab,
  EvaluationTab,
  ParticipantsTab,
  TeamsTab,
} from "./management/tabs";
import {
  EMPTY_AWARD,
  EMPTY_CRITERION,
  type AwardForm,
  type CriterionForm,
} from "./management/types";

interface ManagementViewProps {
  hackathon: Hackathon;
  criteria: Criterion[];
  summary: EvaluationSummary[];
  teams: Team[];
  awards: Award[];
  participants: Participant[];
}

export function ManagementView({
  hackathon,
  criteria,
  summary,
  teams,
  awards,
  participants,
}: ManagementViewProps) {
  const router = useRouter();
  const hackathonId = hackathon.hackathon_id;

  const summaryByTeam = new Map(summary.map((s) => [s.team_id, s]));

  // ── 평가 기준 ──
  const [criterionOpen, setCriterionOpen] = useState(false);
  const [editingCriterion, setEditingCriterion] = useState<Criterion | null>(
    null,
  );
  const [criterionForm, setCriterionForm] = useState<CriterionForm>({
    ...EMPTY_CRITERION,
  });
  const [criterionDeleteTarget, setCriterionDeleteTarget] =
    useState<Criterion | null>(null);

  // ── 심사 ──
  const [scoringTeam, setScoringTeam] = useState<Team | null>(null);
  const [scores, setScores] = useState<Record<number, string>>({});

  // ── 수상 ──
  const [awardOpen, setAwardOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<Award | null>(null);
  const [awardForm, setAwardForm] = useState<AwardForm>({ ...EMPTY_AWARD });
  const [awardDeleteTarget, setAwardDeleteTarget] = useState<Award | null>(
    null,
  );

  // ── 팀 ──
  const [teamDeleteTarget, setTeamDeleteTarget] = useState<Team | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const teamName = (teamId: number) =>
    teams.find((t) => t.hackathon_team_id === teamId)?.name ?? `팀 ${teamId}`;

  /* ── 평가 기준 핸들러 ── */
  const openCreateCriterion = () => {
    setEditingCriterion(null);
    setCriterionForm({
      ...EMPTY_CRITERION,
      display_order: String(criteria.length + 1),
    });
    setCriterionOpen(true);
  };

  const openEditCriterion = (criterion: Criterion) => {
    setEditingCriterion(criterion);
    setCriterionForm({
      name: criterion.name ?? "",
      description: criterion.description ?? "",
      max_score: String(criterion.max_score ?? ""),
      weight: String(criterion.weight ?? ""),
      display_order: String(criterion.display_order ?? ""),
    });
    setCriterionOpen(true);
  };

  const submitCriterion = async () => {
    const displayOrder = Number(criterionForm.display_order);
    if (!criterionForm.name.trim()) {
      alert("평가 기준 이름을 입력해주세요.");
      return;
    }
    if (Number.isNaN(displayOrder)) {
      alert("표시 순서를 숫자로 입력해주세요.");
      return;
    }

    const body: CriterionRequest = {
      name: criterionForm.name.trim(),
      description: criterionForm.description.trim() || undefined,
      max_score: criterionForm.max_score
        ? Number(criterionForm.max_score)
        : undefined,
      weight: criterionForm.weight ? Number(criterionForm.weight) : undefined,
      display_order: displayOrder,
    };

    try {
      setSubmitting(true);
      if (editingCriterion) {
        await updateCriterion(hackathonId, editingCriterion.criterion_id, body);
      } else {
        await createCriterion(hackathonId, body);
      }
      setCriterionOpen(false);
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteCriterion = async () => {
    if (!criterionDeleteTarget) return;
    try {
      setSubmitting(true);
      await deleteCriterion(hackathonId, criterionDeleteTarget.criterion_id);
      setCriterionDeleteTarget(null);
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  /* ── 심사 핸들러 ── */
  const openScoring = (team: Team) => {
    setScoringTeam(team);
    setScores(
      Object.fromEntries(criteria.map((c) => [c.criterion_id, ""])) as Record<
        number,
        string
      >,
    );
  };

  const submitScoring = async () => {
    if (!scoringTeam) return;
    if (criteria.length === 0) {
      alert("먼저 평가 기준을 등록해주세요.");
      return;
    }

    const evaluationScores: EvaluationScore[] = [];
    for (const criterion of criteria) {
      const raw = scores[criterion.criterion_id];
      const value = Number(raw);
      if (raw === "" || Number.isNaN(value)) {
        alert(`'${criterion.name}' 점수를 입력해주세요.`);
        return;
      }
      if (value < 1 || value > criterion.max_score) {
        alert(
          `'${criterion.name}' 점수는 1~${criterion.max_score} 사이여야 합니다.`,
        );
        return;
      }
      evaluationScores.push({
        criterion_id: criterion.criterion_id,
        score: value,
      });
    }

    try {
      setSubmitting(true);
      await submitTeamEvaluation(
        hackathonId,
        scoringTeam.hackathon_team_id,
        evaluationScores,
      );
      setScoringTeam(null);
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  /* ── 수상 핸들러 ── */
  const openCreateAward = () => {
    setEditingAward(null);
    setAwardForm({ ...EMPTY_AWARD });
    setAwardOpen(true);
  };

  const openEditAward = (award: Award) => {
    setEditingAward(award);
    setAwardForm({
      hackathon_team_id: String(award.hackathon_team_id),
      award_name: award.award_name ?? "",
      award_rank:
        typeof award.award_rank === "number" ? String(award.award_rank) : "",
    });
    setAwardOpen(true);
  };

  const submitAward = async () => {
    const teamId = Number(awardForm.hackathon_team_id);
    const awardName = awardForm.award_name.trim();
    if (!teamId) {
      alert("수상 팀을 선택해주세요.");
      return;
    }
    if (!awardName) {
      alert("수상명을 입력해주세요.");
      return;
    }

    const body: AwardRequest = {
      hackathon_team_id: teamId,
      award_name: awardName,
      award_rank: awardForm.award_rank
        ? Number(awardForm.award_rank)
        : undefined,
    };

    try {
      setSubmitting(true);
      if (editingAward) {
        await updateAward(hackathonId, editingAward.award_id, body);
      } else {
        await createAward(hackathonId, body);
      }
      setAwardOpen(false);
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDeleteAward = async () => {
    if (!awardDeleteTarget) return;
    try {
      setSubmitting(true);
      await deleteAward(hackathonId, awardDeleteTarget.award_id);
      setAwardDeleteTarget(null);
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  /* ── 팀 핸들러 ── */
  const confirmDeleteTeam = async () => {
    if (!teamDeleteTarget) return;
    try {
      setSubmitting(true);
      await deleteTeam(hackathonId, teamDeleteTarget.hackathon_team_id);
      setTeamDeleteTarget(null);
      router.refresh();
    } catch (error) {
      alert(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <Button
          variant="ghost"
          className="h-auto p-0 text-sm"
          onClick={() => router.push("/hackathon")}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          해커톤 목록
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">
          {hackathon.title || `${hackathon.event_round}회 해커톤`}
        </h1>
        <p className="text-muted-foreground">
          {hackathon.held_year}-{hackathon.held_semester} /{" "}
          {hackathon.event_round}회 · 평가 기준, 심사, 수상을 관리합니다.
        </p>
      </div>

      <Tabs defaultValue="participants" className="w-full">
        <TabsList>
          <TabsTrigger value="participants">참가자</TabsTrigger>
          <TabsTrigger value="teams">팀</TabsTrigger>
          <TabsTrigger value="criteria">평가 기준</TabsTrigger>
          <TabsTrigger value="evaluation">심사 · 집계</TabsTrigger>
          <TabsTrigger value="awards">수상</TabsTrigger>
          <TabsTrigger value="results">결과 발표</TabsTrigger>
        </TabsList>

        <TabsContent value="participants" className="space-y-4 pt-4">
          <ParticipantsTab participants={participants} />
        </TabsContent>

        <TabsContent value="teams" className="space-y-4 pt-4">
          <TeamsTab teams={teams} onDeleteTeam={setTeamDeleteTarget} />
        </TabsContent>

        <TabsContent value="criteria" className="space-y-4 pt-4">
          <CriteriaTab
            criteria={criteria}
            onCreate={openCreateCriterion}
            onEdit={openEditCriterion}
            onDelete={setCriterionDeleteTarget}
          />
        </TabsContent>

        <TabsContent value="evaluation" className="space-y-4 pt-4">
          <EvaluationTab
            teams={teams}
            summaryByTeam={summaryByTeam}
            onScore={openScoring}
          />
        </TabsContent>

        <TabsContent value="awards" className="space-y-4 pt-4">
          <AwardsTab
            awards={awards}
            teamName={teamName}
            onCreate={openCreateAward}
            onEdit={openEditAward}
            onDelete={setAwardDeleteTarget}
          />
        </TabsContent>

        <TabsContent value="results" className="space-y-4 pt-4">
          <ResultsEditor
            hackathonId={hackathonId}
            eventTitle={hackathon.title || `${hackathon.event_round}회 해커톤`}
            teams={teams}
          />
        </TabsContent>
      </Tabs>

      <CriterionDialog
        open={criterionOpen}
        onOpenChange={setCriterionOpen}
        isEdit={editingCriterion !== null}
        form={criterionForm}
        setForm={setCriterionForm}
        submitting={submitting}
        onSubmit={() => void submitCriterion()}
      />

      <ConfirmDeleteDialog
        open={criterionDeleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCriterionDeleteTarget(null);
        }}
        title="평가 기준 삭제"
        description={
          <>&apos;{criterionDeleteTarget?.name}&apos; 기준을 삭제합니다.</>
        }
        submitting={submitting}
        onConfirm={() => void confirmDeleteCriterion()}
      />

      <ScoringDialog
        team={scoringTeam}
        criteria={criteria}
        scores={scores}
        setScores={setScores}
        submitting={submitting}
        onClose={() => setScoringTeam(null)}
        onSubmit={() => void submitScoring()}
      />

      <AwardDialog
        open={awardOpen}
        onOpenChange={setAwardOpen}
        isEdit={editingAward !== null}
        form={awardForm}
        setForm={setAwardForm}
        teams={teams}
        submitting={submitting}
        onSubmit={() => void submitAward()}
      />

      <ConfirmDeleteDialog
        open={awardDeleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setAwardDeleteTarget(null);
        }}
        title="수상 삭제"
        description={
          <>
            &apos;{awardDeleteTarget?.award_name}&apos; 수상 내역을 삭제합니다.
          </>
        }
        submitting={submitting}
        onConfirm={() => void confirmDeleteAward()}
      />

      <ConfirmDeleteDialog
        open={teamDeleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setTeamDeleteTarget(null);
        }}
        title="팀 삭제"
        description={
          <>
            &apos;{teamDeleteTarget?.name}&apos; 팀을 삭제합니다. 삭제 후에는
            복구할 수 없습니다.
          </>
        }
        submitting={submitting}
        onConfirm={() => void confirmDeleteTeam()}
      />
    </div>
  );
}
