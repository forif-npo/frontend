import type { Criterion, Team } from "@core/types/hackathon";
import { Body, Label } from "@ui/components/server";
import { Modal, TextArea, TextInput } from "@ui/components/client";
import type { Dispatch, SetStateAction } from "react";
import type { SubmissionFormState, TeamFormState } from "./types";

export function TeamFormModal({
  mode,
  form,
  setForm,
  onClose,
  onConfirm,
}: {
  mode: "create" | "edit" | null;
  form: TeamFormState;
  setForm: Dispatch<SetStateAction<TeamFormState>>;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      isOpen={mode !== null}
      onClose={onClose}
      onConfirm={onConfirm}
      title={mode === "edit" ? "팀 정보 수정" : "새 팀 만들기"}
      confirmLabel={mode === "edit" ? "저장" : "생성"}
      width="m"
    >
      <div className="flex flex-col gap-4 pb-6">
        <TextInput
          id="hackathon-team-name"
          title="팀 이름"
          length="full"
          value={form.name}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, name: e.target.value }))
          }
        />
        <TextInput
          id="hackathon-team-topic"
          title="주제"
          length="full"
          value={form.topic}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, topic: e.target.value }))
          }
        />
        <TextInput
          id="hackathon-team-max"
          title="최대 인원"
          type="number"
          min={1}
          length="full"
          value={form.maxMembers}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, maxMembers: e.target.value }))
          }
        />
        <TextArea
          id="hackathon-team-description"
          title="소개"
          size="medium"
          value={form.description}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, description: e.target.value }))
          }
        />
      </div>
    </Modal>
  );
}

export function JoinRequestModal({
  target,
  message,
  setMessage,
  onClose,
  onConfirm,
}: {
  target: Team | null;
  message: string;
  setMessage: Dispatch<SetStateAction<string>>;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      isOpen={target !== null}
      onClose={onClose}
      onConfirm={onConfirm}
      title="가입 신청"
      confirmLabel="신청"
      width="m"
    >
      <div className="flex flex-col gap-4 pb-6">
        <Body size="s" className="text-text-subtle">
          {target?.name} 팀에 보낼 메시지를 입력합니다.
        </Body>
        <TextArea
          id="hackathon-join-message"
          title="메시지"
          size="medium"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </Modal>
  );
}

export function SubmissionModal({
  isOpen,
  isEdit,
  form,
  setForm,
  setPresentation,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  isEdit: boolean;
  form: SubmissionFormState;
  setForm: Dispatch<SetStateAction<SubmissionFormState>>;
  setPresentation: Dispatch<SetStateAction<File | null>>;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      title={isEdit ? "결과물 수정" : "결과물 제출"}
      confirmLabel={isEdit ? "수정" : "제출"}
      width="l"
    >
      <div className="grid grid-cols-1 gap-4 pb-6 md:grid-cols-2">
        <TextInput
          id="submission-project"
          title="프로젝트명"
          length="full"
          value={form.projectName}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, projectName: e.target.value }))
          }
        />
        <TextInput
          id="submission-github"
          title="GitHub URL"
          length="full"
          value={form.githubUrl}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, githubUrl: e.target.value }))
          }
        />
        <div className="md:col-span-2">
          <TextInput
            id="submission-summary"
            title="한 줄 소개"
            length="full"
            value={form.summary}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, summary: e.target.value }))
            }
          />
        </div>
        <TextInput
          id="submission-deploy"
          title="배포 URL"
          length="full"
          value={form.deployUrl}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, deployUrl: e.target.value }))
          }
        />
        <TextInput
          id="submission-image"
          title="이미지 URL"
          length="full"
          value={form.imageUrl}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, imageUrl: e.target.value }))
          }
        />
        <div className="md:col-span-2">
          <TextInput
            id="submission-tech"
            title="기술 스택"
            description="쉼표로 구분"
            length="full"
            value={form.techStacks}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, techStacks: e.target.value }))
            }
          />
        </div>
        <div className="md:col-span-2">
          <TextArea
            id="submission-description"
            title="설명"
            size="large"
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <label className="flex flex-col gap-1 md:col-span-2">
          <Label size="s" className="text-text-basic">
            발표 자료
          </Label>
          <input
            type="file"
            onChange={(e) => setPresentation(e.target.files?.[0] ?? null)}
            className="rounded-2 border-input-border bg-input-surface text-text-basic text-body-s border px-4 py-3"
          />
        </label>
      </div>
    </Modal>
  );
}

export function EvaluationModal({
  target,
  criteria,
  scores,
  setScores,
  isEdit,
  onClose,
  onConfirm,
}: {
  target: Team | null;
  criteria: Criterion[];
  scores: Record<number, string>;
  setScores: Dispatch<SetStateAction<Record<number, string>>>;
  isEdit: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  return (
    <Modal
      isOpen={target !== null}
      onClose={onClose}
      onConfirm={onConfirm}
      title="팀 평가"
      confirmLabel={isEdit ? "수정" : "제출"}
      width="m"
    >
      <div className="flex flex-col gap-4 pb-6">
        <Body size="s" className="text-text-subtle">
          {target?.name} 팀의 결과물을 평가합니다.
        </Body>
        {criteria.map((criterion) => (
          <TextInput
            key={criterion.criterion_id}
            id={`criterion-${criterion.criterion_id}`}
            title={`${criterion.name} (1~${criterion.max_score})`}
            type="number"
            min={1}
            max={criterion.max_score}
            length="full"
            value={scores[criterion.criterion_id] ?? ""}
            onChange={(e) =>
              setScores((prev) => ({
                ...prev,
                [criterion.criterion_id]: e.target.value,
              }))
            }
          />
        ))}
      </div>
    </Modal>
  );
}
