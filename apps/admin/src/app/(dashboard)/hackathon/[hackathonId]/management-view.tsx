"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
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

interface ManagementViewProps {
  hackathon: Hackathon;
  criteria: Criterion[];
  summary: EvaluationSummary[];
  teams: Team[];
  awards: Award[];
  participants: Participant[];
}

const PARTICIPANT_STATUS_LABELS: Record<Participant["status"], string> = {
  REGISTERED: "참가",
  CANCELED: "취소",
};

const TEAM_STATUS_LABELS: Record<Team["status"], string> = {
  FORMING: "구성중",
  CONFIRMED: "확정",
  DISBANDED: "해산",
};

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}.${d.getMonth() + 1}.${d.getDate()}`;
}

type CriterionForm = {
  name: string;
  description: string;
  max_score: string;
  weight: string;
  display_order: string;
};

type AwardForm = {
  hackathon_team_id: string;
  award_name: string;
  award_rank: string;
};

const EMPTY_CRITERION: CriterionForm = {
  name: "",
  description: "",
  max_score: "10",
  weight: "1",
  display_order: "1",
};

const EMPTY_AWARD: AwardForm = {
  hackathon_team_id: "",
  award_name: "",
  award_rank: "",
};

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
        </TabsList>

        {/* 참가자 */}
        <TabsContent value="participants" className="space-y-4 pt-4">
          {participants.length === 0 ? (
            <div className="text-muted-foreground rounded-md border py-10 text-center text-sm">
              참가자가 없습니다.
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">이름</th>
                    <th className="px-4 py-3 text-left font-medium">학번</th>
                    <th className="px-4 py-3 text-center font-medium">상태</th>
                    <th className="px-4 py-3 text-right font-medium">등록일</th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {participants.map((participant) => (
                    <tr key={participant.participant_id}>
                      <td className="px-4 py-3 font-medium">
                        {participant.user_name}
                      </td>
                      <td className="text-muted-foreground px-4 py-3">
                        {participant.user_id}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <Badge
                          variant="outline"
                          className={
                            participant.status === "REGISTERED"
                              ? "border-green-500 bg-green-50 text-green-700"
                              : "border-gray-400 bg-gray-50 text-gray-600"
                          }
                        >
                          {PARTICIPANT_STATUS_LABELS[participant.status]}
                        </Badge>
                      </td>
                      <td className="text-muted-foreground px-4 py-3 text-right">
                        {formatDate(participant.registered_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="text-muted-foreground text-sm">
            총 {participants.length}명
          </div>
        </TabsContent>

        {/* 팀 */}
        <TabsContent value="teams" className="space-y-4 pt-4">
          {teams.length === 0 ? (
            <div className="text-muted-foreground rounded-md border py-10 text-center text-sm">
              등록된 팀이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {teams.map((team) => (
                <div
                  key={team.hackathon_team_id}
                  className="space-y-3 rounded-md border p-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{team.name}</p>
                        <Badge variant="outline">
                          {TEAM_STATUS_LABELS[team.status]}
                        </Badge>
                      </div>
                      {team.topic && (
                        <p className="text-muted-foreground mt-1 text-sm">
                          {team.topic}
                        </p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive shrink-0"
                      onClick={() => setTeamDeleteTarget(team)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="text-muted-foreground text-sm">
                    팀장 {team.leader_name} · {team.member_count}명
                  </div>

                  <ul className="flex flex-wrap gap-1.5">
                    {team.members.map((member) => (
                      <li
                        key={member.user_id}
                        className="bg-muted rounded-full px-2.5 py-1 text-xs"
                      >
                        {member.user_name}
                        {member.role === "LEADER" && (
                          <span className="text-muted-foreground"> (팀장)</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          <div className="text-muted-foreground text-sm">
            총 {teams.length}팀
          </div>
        </TabsContent>

        {/* 평가 기준 */}
        <TabsContent value="criteria" className="space-y-4 pt-4">
          <div className="flex justify-end">
            <Button onClick={openCreateCriterion}>
              <Plus className="mr-2 h-4 w-4" />
              평가 기준 추가
            </Button>
          </div>

          {criteria.length === 0 ? (
            <div className="text-muted-foreground rounded-md border py-10 text-center text-sm">
              등록된 평가 기준이 없습니다.
            </div>
          ) : (
            <div className="divide-border divide-y rounded-md border">
              {criteria.map((criterion) => (
                <div
                  key={criterion.criterion_id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-sm">
                        #{criterion.display_order}
                      </span>
                      <p className="font-medium">{criterion.name}</p>
                      <Badge variant="outline">
                        만점 {criterion.max_score} · 가중치 {criterion.weight}
                      </Badge>
                    </div>
                    {criterion.description && (
                      <p className="text-muted-foreground mt-1 text-sm">
                        {criterion.description}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditCriterion(criterion)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setCriterionDeleteTarget(criterion)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* 심사 · 집계 */}
        <TabsContent value="evaluation" className="space-y-4 pt-4">
          {teams.length === 0 ? (
            <div className="text-muted-foreground rounded-md border py-10 text-center text-sm">
              등록된 팀이 없습니다.
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">팀</th>
                    <th className="px-4 py-3 text-center font-medium">
                      평가자
                    </th>
                    <th className="px-4 py-3 text-center font-medium">
                      평균점수
                    </th>
                    <th className="px-4 py-3 text-center font-medium">합계</th>
                    <th className="px-4 py-3 text-right font-medium">심사</th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {teams.map((team) => {
                    const s = summaryByTeam.get(team.hackathon_team_id);
                    return (
                      <tr key={team.hackathon_team_id}>
                        <td className="px-4 py-3">
                          <p className="font-medium">{team.name}</p>
                          <p className="text-muted-foreground text-xs">
                            {team.leader_name} · {team.member_count}명
                          </p>
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s?.evaluator_count ?? 0}명
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s ? s.average_total_score.toFixed(2) : "-"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {s ? s.sum_total_score.toFixed(1) : "-"}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openScoring(team)}
                          >
                            점수 입력
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        {/* 수상 */}
        <TabsContent value="awards" className="space-y-4 pt-4">
          <div className="flex justify-end">
            <Button onClick={openCreateAward}>
              <Plus className="mr-2 h-4 w-4" />
              수상 등록
            </Button>
          </div>

          {awards.length === 0 ? (
            <div className="text-muted-foreground rounded-md border py-10 text-center text-sm">
              등록된 수상 내역이 없습니다.
            </div>
          ) : (
            <div className="divide-border divide-y rounded-md border">
              {awards.map((award) => (
                <div
                  key={award.award_id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{award.award_name}</p>
                      {typeof award.award_rank === "number" && (
                        <Badge variant="outline">{award.award_rank}위</Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {award.team_name || teamName(award.hackathon_team_id)}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEditAward(award)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => setAwardDeleteTarget(award)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* 평가 기준 다이얼로그 */}
      <Dialog open={criterionOpen} onOpenChange={setCriterionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingCriterion ? "평가 기준 수정" : "평가 기준 추가"}
            </DialogTitle>
            <DialogDescription>
              심사에 사용할 평가 기준 항목을 설정합니다.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submitCriterion();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="criterion-name">이름</Label>
              <Input
                id="criterion-name"
                value={criterionForm.name}
                disabled={submitting}
                onChange={(e) =>
                  setCriterionForm((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="criterion-desc">설명</Label>
              <Textarea
                id="criterion-desc"
                value={criterionForm.description}
                disabled={submitting}
                onChange={(e) =>
                  setCriterionForm((p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="criterion-max">만점</Label>
                <Input
                  id="criterion-max"
                  type="number"
                  min={1}
                  value={criterionForm.max_score}
                  disabled={submitting}
                  onChange={(e) =>
                    setCriterionForm((p) => ({
                      ...p,
                      max_score: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="criterion-weight">가중치</Label>
                <Input
                  id="criterion-weight"
                  type="number"
                  step="0.1"
                  value={criterionForm.weight}
                  disabled={submitting}
                  onChange={(e) =>
                    setCriterionForm((p) => ({ ...p, weight: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="criterion-order">표시 순서</Label>
                <Input
                  id="criterion-order"
                  type="number"
                  min={1}
                  value={criterionForm.display_order}
                  disabled={submitting}
                  onChange={(e) =>
                    setCriterionForm((p) => ({
                      ...p,
                      display_order: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => setCriterionOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingCriterion ? "저장" : "추가"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 평가 기준 삭제 */}
      <Dialog
        open={criterionDeleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setCriterionDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>평가 기준 삭제</DialogTitle>
            <DialogDescription>
              &apos;{criterionDeleteTarget?.name}&apos; 기준을 삭제합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => setCriterionDeleteTarget(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={submitting}
              onClick={() => void confirmDeleteCriterion()}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 심사 점수 입력 다이얼로그 */}
      <Dialog
        open={scoringTeam !== null}
        onOpenChange={(open) => {
          if (!open) setScoringTeam(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>심사 점수 입력</DialogTitle>
            <DialogDescription>
              {scoringTeam?.name} 팀의 평가 점수를 입력합니다.
            </DialogDescription>
          </DialogHeader>

          {criteria.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center text-sm">
              먼저 평가 기준을 등록해주세요.
            </p>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void submitScoring();
              }}
            >
              {criteria.map((criterion) => (
                <div key={criterion.criterion_id} className="space-y-2">
                  <Label htmlFor={`score-${criterion.criterion_id}`}>
                    {criterion.name}{" "}
                    <span className="text-muted-foreground">
                      (1~{criterion.max_score})
                    </span>
                  </Label>
                  <Input
                    id={`score-${criterion.criterion_id}`}
                    type="number"
                    min={1}
                    max={criterion.max_score}
                    value={scores[criterion.criterion_id] ?? ""}
                    disabled={submitting}
                    onChange={(e) =>
                      setScores((p) => ({
                        ...p,
                        [criterion.criterion_id]: e.target.value,
                      }))
                    }
                  />
                </div>
              ))}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  disabled={submitting}
                  onClick={() => setScoringTeam(null)}
                >
                  취소
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  제출
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* 수상 다이얼로그 */}
      <Dialog open={awardOpen} onOpenChange={setAwardOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingAward ? "수상 수정" : "수상 등록"}
            </DialogTitle>
            <DialogDescription>수상 팀과 상명을 등록합니다.</DialogDescription>
          </DialogHeader>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              void submitAward();
            }}
          >
            <div className="space-y-2">
              <Label>수상 팀</Label>
              <Select
                value={awardForm.hackathon_team_id}
                disabled={submitting}
                onValueChange={(value) =>
                  setAwardForm((p) => ({ ...p, hackathon_team_id: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="팀 선택" />
                </SelectTrigger>
                <SelectContent>
                  {teams.map((team) => (
                    <SelectItem
                      key={team.hackathon_team_id}
                      value={String(team.hackathon_team_id)}
                    >
                      {team.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="award-name">상명</Label>
              <Input
                id="award-name"
                value={awardForm.award_name}
                disabled={submitting}
                placeholder="예: 대상"
                onChange={(e) =>
                  setAwardForm((p) => ({ ...p, award_name: e.target.value }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="award-rank">순위 (선택)</Label>
              <Input
                id="award-rank"
                type="number"
                min={1}
                value={awardForm.award_rank}
                disabled={submitting}
                onChange={(e) =>
                  setAwardForm((p) => ({ ...p, award_rank: e.target.value }))
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => setAwardOpen(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {editingAward ? "저장" : "등록"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 수상 삭제 */}
      <Dialog
        open={awardDeleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setAwardDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>수상 삭제</DialogTitle>
            <DialogDescription>
              &apos;{awardDeleteTarget?.award_name}&apos; 수상 내역을
              삭제합니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => setAwardDeleteTarget(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={submitting}
              onClick={() => void confirmDeleteAward()}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 팀 삭제 */}
      <Dialog
        open={teamDeleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setTeamDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>팀 삭제</DialogTitle>
            <DialogDescription>
              &apos;{teamDeleteTarget?.name}&apos; 팀을 삭제합니다. 삭제 후에는
              복구할 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={submitting}
              onClick={() => setTeamDeleteTarget(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={submitting}
              onClick={() => void confirmDeleteTeam()}
            >
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
