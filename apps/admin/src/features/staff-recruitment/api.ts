import type { ApiResponse, CursorPageResponse } from "@core/types/api";
import type {
  AdminStaffRecruitmentRound,
  StaffApplicationDetail,
  StaffApplicationSummary,
  StaffInterviewPlan,
  StaffInterviewPlanSaveRequest,
  StaffInterviewBoard,
  StaffInterviewQuestion,
  StaffInterviewSchedule,
  StaffInterviewSheet,
  StaffInterviewSlot,
  StaffInterviewStatus,
  StaffRegistrationResult,
  StaffRecruitmentReviewer,
  StaffRecruitmentCreateRequest,
  StaffRecruitmentUpdateRequest,
  StaffReviewerCandidate,
  StaffReviewerGrantRequest,
} from "@core/types/staff-recruitment";
import { apiClient } from "@core/utils/api-client";

export async function getStaffRecruitments(): Promise<
  AdminStaffRecruitmentRound[]
> {
  const response = await apiClient
    .get("api/v1/admin/staff-recruitments", {
      searchParams: { page: 0, size: 100 },
    })
    .json<ApiResponse<CursorPageResponse<AdminStaffRecruitmentRound>>>();
  return response.data?.content ?? [];
}

export async function getReviewableStaffRecruitments(): Promise<
  AdminStaffRecruitmentRound[]
> {
  const response = await apiClient
    .get("api/v1/admin/staff-recruitments/reviewable", {
      cache: "no-store",
    })
    .json<ApiResponse<AdminStaffRecruitmentRound[]>>();
  return response.data ?? [];
}

export async function createStaffRecruitment(
  body: StaffRecruitmentCreateRequest,
): Promise<AdminStaffRecruitmentRound> {
  const response = await apiClient
    .post("api/v1/admin/staff-recruitments", { json: body })
    .json<ApiResponse<AdminStaffRecruitmentRound>>();
  return response.data!;
}

export async function updateStaffRecruitment(
  recruitmentId: number,
  body: StaffRecruitmentUpdateRequest,
): Promise<AdminStaffRecruitmentRound> {
  const response = await apiClient
    .patch(`api/v1/admin/staff-recruitments/${recruitmentId}`, { json: body })
    .json<ApiResponse<AdminStaffRecruitmentRound>>();
  return response.data!;
}

/**
 * 회차의 면접 일정. 설정하지 않은 회차는 서버가 404(FOR167)로 답하므로 null로 바꾼다.
 */
export async function getStaffInterviewPlan(
  recruitmentId: number,
): Promise<StaffInterviewPlan | null> {
  try {
    const response = await apiClient
      .get(`api/v1/admin/staff-recruitments/${recruitmentId}/interview-plan`, {
        cache: "no-store",
      })
      .json<ApiResponse<StaffInterviewPlan>>();
    return response.data ?? null;
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }
    throw error;
  }
}

/** 열람자도 확인할 수 있는 공개 면접 계획. 설정이 없으면 null이다. */
export async function getPublicStaffInterviewPlan(
  recruitmentId: number,
): Promise<StaffInterviewPlan | null> {
  const response = await apiClient
    .get(`api/v1/staff-recruitments/${recruitmentId}/interview-plan`, {
      cache: "no-cache",
    })
    .json<ApiResponse<StaffInterviewPlan>>();
  return response.data ?? null;
}

/**
 * ky의 HTTPError는 응답을 `response`에 담는다.
 * ky를 직접 import하면 ESM 전용 모듈이라 jest에서 읽지 못해 응답 상태만 확인한다.
 */
function isNotFound(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    (error as { response?: { status?: number } }).response?.status === 404
  );
}

export async function saveStaffInterviewPlan(
  recruitmentId: number,
  body: StaffInterviewPlanSaveRequest,
): Promise<StaffInterviewPlan> {
  const response = await apiClient
    .put(`api/v1/admin/staff-recruitments/${recruitmentId}/interview-plan`, {
      json: body,
    })
    .json<ApiResponse<StaffInterviewPlan>>();
  return response.data!;
}

/** 면접을 받지 않는 회차로 되돌린다. 이미 제출된 선택은 서버에 남는다. */
export async function deleteStaffInterviewPlan(
  recruitmentId: number,
): Promise<void> {
  await apiClient.delete(
    `api/v1/admin/staff-recruitments/${recruitmentId}/interview-plan`,
  );
}

function interviewSchedulePath(recruitmentId: number) {
  return `api/v1/admin/staff-recruitments/${recruitmentId}/interview-schedule`;
}

/** 면접 일정 조율 화면 전체. 면접 일정·회장단 가능 시간·지원자별 가능 시간과 배정 시각. */
export async function getStaffInterviewSchedule(
  recruitmentId: number,
): Promise<StaffInterviewSchedule> {
  const response = await apiClient
    .get(interviewSchedulePath(recruitmentId), { cache: "no-store" })
    .json<ApiResponse<StaffInterviewSchedule>>();
  return response.data!;
}

/** 회장단 가능 시간을 보낸 목록으로 맞춘다. */
export async function saveStaffInterviewHostSlots(
  recruitmentId: number,
  slots: StaffInterviewSlot[],
): Promise<StaffInterviewSchedule> {
  const response = await apiClient
    .put(`${interviewSchedulePath(recruitmentId)}/host-slots`, {
      json: { slots },
    })
    .json<ApiResponse<StaffInterviewSchedule>>();
  return response.data!;
}

/** 지원자를 한 칸에 넣는다. 이미 넣었으면 그 칸으로 옮긴다. */
export async function assignStaffInterview(
  recruitmentId: number,
  applicationId: number,
  slot: StaffInterviewSlot,
): Promise<StaffInterviewSchedule> {
  const response = await apiClient
    .put(
      `${interviewSchedulePath(recruitmentId)}/assignments/${applicationId}`,
      {
        json: slot,
      },
    )
    .json<ApiResponse<StaffInterviewSchedule>>();
  return response.data!;
}

export async function unassignStaffInterview(
  recruitmentId: number,
  applicationId: number,
): Promise<StaffInterviewSchedule> {
  const response = await apiClient
    .delete(
      `${interviewSchedulePath(recruitmentId)}/assignments/${applicationId}`,
    )
    .json<ApiResponse<StaffInterviewSchedule>>();
  return response.data!;
}

export async function confirmStaffInterviewSchedule(
  recruitmentId: number,
): Promise<StaffInterviewSchedule> {
  const response = await apiClient
    .post(`${interviewSchedulePath(recruitmentId)}/confirm`)
    .json<ApiResponse<StaffInterviewSchedule>>();
  return response.data!;
}

function interviewQuestionPath(recruitmentId: number) {
  return `api/v1/admin/staff-recruitments/${recruitmentId}/interview-questions`;
}

/** 면접 질문 목록. 공통 질문이 먼저, 부서 질문은 부서 순서대로 온다. */
export async function getStaffInterviewQuestions(
  recruitmentId: number,
): Promise<StaffInterviewQuestion[]> {
  const response = await apiClient
    .get(interviewQuestionPath(recruitmentId), { cache: "no-store" })
    .json<ApiResponse<StaffInterviewQuestion[]>>();
  return response.data ?? [];
}

/** departmentId를 null로 보내면 공통 질문이다. */
export async function createStaffInterviewQuestion(
  recruitmentId: number,
  departmentId: number | null,
  content: string,
): Promise<StaffInterviewQuestion> {
  const response = await apiClient
    .post(interviewQuestionPath(recruitmentId), {
      json: { department_id: departmentId, content },
    })
    .json<ApiResponse<StaffInterviewQuestion>>();
  return response.data!;
}

export async function updateStaffInterviewQuestion(
  recruitmentId: number,
  questionId: number,
  content: string,
): Promise<StaffInterviewQuestion> {
  const response = await apiClient
    .patch(`${interviewQuestionPath(recruitmentId)}/${questionId}`, {
      json: { content },
    })
    .json<ApiResponse<StaffInterviewQuestion>>();
  return response.data!;
}

/** 답변이 적힌 질문은 서버가 409(FOR171)로 거절한다. */
export async function deleteStaffInterviewQuestion(
  recruitmentId: number,
  questionId: number,
): Promise<void> {
  await apiClient.delete(
    `${interviewQuestionPath(recruitmentId)}/${questionId}`,
  );
}

function interviewPath(recruitmentId: number) {
  return `api/v1/admin/staff-recruitments/${recruitmentId}/interviews`;
}

export async function getStaffInterviewBoard(
  recruitmentId: number,
): Promise<StaffInterviewBoard> {
  const response = await apiClient
    .get(interviewPath(recruitmentId), { cache: "no-store" })
    .json<ApiResponse<StaffInterviewBoard>>();
  return response.data!;
}

export async function finalizeStaffInterviewResults(
  recruitmentId: number,
): Promise<StaffInterviewBoard> {
  const response = await apiClient
    .post(`${interviewPath(recruitmentId)}/finalize-results`)
    .json<ApiResponse<StaffInterviewBoard>>();
  return response.data!;
}

export async function getStaffInterviewSheet(
  recruitmentId: number,
  applicationId: number,
): Promise<StaffInterviewSheet> {
  const response = await apiClient
    .get(`${interviewPath(recruitmentId)}/${applicationId}`, {
      cache: "no-store",
    })
    .json<ApiResponse<StaffInterviewSheet>>();
  return response.data!;
}

/**
 * 합격이면 지원자의 1지망·2지망 중 배정할 모집 부서를 함께 보낸다.
 * 지망이 하나뿐이면 비워도 서버가 그 부서로 정한다.
 */
export async function changeStaffInterviewStatus(
  recruitmentId: number,
  applicationId: number,
  status: StaffInterviewStatus,
  departmentId: number | null = null,
): Promise<StaffInterviewSheet> {
  const response = await apiClient
    .put(`${interviewPath(recruitmentId)}/${applicationId}/status`, {
      json: { status, department_id: departmentId },
    })
    .json<ApiResponse<StaffInterviewSheet>>();
  return response.data!;
}

/** 빈 답변을 보내면 적어 둔 답변을 지운다. */
export async function saveStaffInterviewAnswer(
  recruitmentId: number,
  applicationId: number,
  questionId: number,
  answer: string,
): Promise<StaffInterviewSheet> {
  const response = await apiClient
    .put(
      `${interviewPath(recruitmentId)}/${applicationId}/answers/${questionId}`,
      {
        json: { answer },
      },
    )
    .json<ApiResponse<StaffInterviewSheet>>();
  return response.data!;
}

export async function addStaffInterviewExtraQuestion(
  recruitmentId: number,
  applicationId: number,
  content: string,
): Promise<StaffInterviewSheet> {
  const response = await apiClient
    .post(`${interviewPath(recruitmentId)}/${applicationId}/extra-questions`, {
      json: { content },
    })
    .json<ApiResponse<StaffInterviewSheet>>();
  return response.data!;
}

/** 보낸 필드만 바뀐다. */
export async function updateStaffInterviewExtraQuestion(
  recruitmentId: number,
  applicationId: number,
  extraQuestionId: number,
  patch: { content?: string; answer?: string },
): Promise<StaffInterviewSheet> {
  const response = await apiClient
    .patch(
      `${interviewPath(recruitmentId)}/${applicationId}/extra-questions/${extraQuestionId}`,
      { json: patch },
    )
    .json<ApiResponse<StaffInterviewSheet>>();
  return response.data!;
}

export async function deleteStaffInterviewExtraQuestion(
  recruitmentId: number,
  applicationId: number,
  extraQuestionId: number,
): Promise<StaffInterviewSheet> {
  const response = await apiClient
    .delete(
      `${interviewPath(recruitmentId)}/${applicationId}/extra-questions/${extraQuestionId}`,
    )
    .json<ApiResponse<StaffInterviewSheet>>();
  return response.data!;
}

/**
 * 합격자를 모집 회차의 활동 학기 운영진 명단에 배정 부서로 올린다.
 * 이미 명단에 있는 사람은 서버가 건너뛰므로 여러 번 불러도 된다.
 */
export async function registerPassedApplicantsAsStaff(
  recruitmentId: number,
): Promise<StaffRegistrationResult> {
  const response = await apiClient
    .post(`${interviewPath(recruitmentId)}/staff-registration`)
    .json<ApiResponse<StaffRegistrationResult>>();
  return response.data!;
}

export async function changeStaffRecruitmentStatus(
  recruitmentId: number,
  action: "publish" | "close" | "cancel",
  version: number,
  reason?: string,
): Promise<AdminStaffRecruitmentRound> {
  const response = await apiClient
    .post(`api/v1/admin/staff-recruitments/${recruitmentId}/${action}`, {
      json: { version, reason: reason || undefined },
    })
    .json<ApiResponse<AdminStaffRecruitmentRound>>();
  return response.data!;
}

export interface StaffApplicationPage {
  content: StaffApplicationSummary[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}

export async function getStaffApplications({
  recruitmentId,
  departmentId,
  search,
  page = 0,
  size = 20,
}: {
  recruitmentId: number;
  departmentId?: number;
  search?: string;
  page?: number;
  size?: number;
}): Promise<StaffApplicationPage> {
  const searchParams = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  // Spring @RequestParam의 실제 파라미터 이름이다.
  if (departmentId) searchParams.set("departmentId", String(departmentId));
  if (search?.trim()) searchParams.set("search", search.trim());

  const response = await apiClient
    .get(`api/v1/admin/staff-recruitments/${recruitmentId}/applications`, {
      searchParams,
      cache: "no-store",
    })
    .json<ApiResponse<CursorPageResponse<StaffApplicationSummary>>>();
  if (!response.data) throw new Error(response.message);
  return {
    content: response.data.content,
    totalElements: response.data.total_elements,
    currentPage: response.data.current_page ?? page,
    totalPages: response.data.total_pages ?? 0,
    pageSize: size,
  };
}

export async function getStaffApplicationDetail(
  recruitmentId: number,
  applicationId: number,
): Promise<StaffApplicationDetail> {
  const response = await apiClient
    .get(
      `api/v1/admin/staff-recruitments/${recruitmentId}/applications/${applicationId}`,
      { cache: "no-store" },
    )
    .json<ApiResponse<StaffApplicationDetail>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function getStaffReviewerCandidates(
  recruitmentId: number,
): Promise<StaffReviewerCandidate[]> {
  const response = await apiClient
    .get(
      `api/v1/admin/staff-recruitments/${recruitmentId}/reviewer-candidates`,
      { cache: "no-store" },
    )
    .json<ApiResponse<StaffReviewerCandidate[]>>();
  return response.data ?? [];
}

export async function getStaffReviewers(
  recruitmentId: number,
): Promise<StaffRecruitmentReviewer[]> {
  const response = await apiClient
    .get(`api/v1/admin/staff-recruitments/${recruitmentId}/reviewers`, {
      cache: "no-store",
    })
    .json<ApiResponse<StaffRecruitmentReviewer[]>>();
  return response.data ?? [];
}

export async function grantStaffReviewer(
  recruitmentId: number,
  body: StaffReviewerGrantRequest,
): Promise<StaffRecruitmentReviewer> {
  const response = await apiClient
    .post(`api/v1/admin/staff-recruitments/${recruitmentId}/reviewers`, {
      json: body,
    })
    .json<ApiResponse<StaffRecruitmentReviewer>>();
  if (!response.data) throw new Error(response.message);
  return response.data;
}

export async function revokeStaffReviewer(
  recruitmentId: number,
  userId: number,
): Promise<void> {
  await apiClient.delete(
    `api/v1/admin/staff-recruitments/${recruitmentId}/reviewers/${userId}`,
  );
}
