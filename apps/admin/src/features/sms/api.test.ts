import { beforeEach, describe, expect, it, jest } from "@jest/globals";
jest.mock("@core/utils/api-client", () => ({
  apiClient: { get: jest.fn(), post: jest.fn() },
}));
import { apiClient } from "@core/utils/api-client";
import {
  getAlimTalkHistory,
  getAllReceivers,
  getReceiverPage,
  sendAlimTalk,
} from "./api";
//테스트용 주석

type GetMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
  mockReturnValueOnce: (value: { json: <T>() => Promise<T> }) => void;
};

type PostMock = {
  mockReset: () => void;
  mockReturnValue: (value: { json: <T>() => Promise<T> }) => void;
};

const mockedGet = apiClient.get as unknown as GetMock;
const mockedPost = apiClient.post as unknown as PostMock;

function response(data: unknown) {
  return { json: <T>() => Promise.resolve({ data } as T) };
}

describe("sms api", () => {
  beforeEach(() => {
    mockedGet.mockReset();
    mockedPost.mockReset();
  });

  it("filters receivers without phone numbers and preserves the target query contract", async () => {
    mockedGet.mockReturnValue(
      response({
        content: [
          {
            user_id: 1,
            user_name: "홍길동",
            phone_num: "010-1111-2222",
            department: "컴퓨터소프트웨어학부",
            current_study_name: "React",
          },
          {
            user_id: 2,
            user_name: "전화번호 없음",
            phone_num: null,
            department: "정보시스템학과",
            current_study_name: null,
          },
        ],
        next_cursor: 3,
        has_next: true,
        total_elements: 12,
      }),
    );

    const page = await getReceiverPage({
      cursor: 2,
      search: "홍길동",
      target: "CURRENT_SEMESTER_REJECTED_APPLICANTS",
    });

    expect(apiClient.get).toHaveBeenCalledWith(
      "api/v1/notifications/receivers",
      {
        searchParams: {
          size: 100,
          target_type: "CURRENT_SEMESTER_REJECTED_APPLICANTS",
          cursor: 2,
          search: "홍길동",
        },
      },
    );
    expect(page).toEqual({
      receivers: [
        {
          userId: 1,
          name: "홍길동",
          phoneNumber: "010-1111-2222",
          department: "컴퓨터소프트웨어학부",
          currentStudyName: "React",
        },
      ],
      nextCursor: 3,
      hasNext: true,
      totalElements: 12,
    });
  });

  it("deduplicates every receiver page by phone number", async () => {
    mockedGet.mockReturnValueOnce(
      response({
        content: [
          {
            user_id: 1,
            user_name: "첫 번째",
            phone_num: "010-1111-2222",
            department: "컴퓨터소프트웨어학부",
            current_study_name: null,
          },
        ],
        next_cursor: 5,
        has_next: true,
        total_elements: 2,
      }),
    );
    mockedGet.mockReturnValueOnce(
      response({
        content: [
          {
            user_id: 2,
            user_name: "갱신된 이름",
            phone_num: "010-1111-2222",
            department: "정보시스템학과",
            current_study_name: "자율 스터디",
          },
          {
            user_id: 3,
            user_name: "두 번째",
            phone_num: "010-3333-4444",
            department: "컴퓨터소프트웨어학부",
            current_study_name: null,
          },
        ],
        next_cursor: null,
        has_next: false,
        total_elements: 2,
      }),
    );

    await expect(
      getAllReceivers({ target: "CURRENT_SEMESTER_MEMBERS" }),
    ).resolves.toEqual([
      {
        userId: 2,
        name: "갱신된 이름",
        phoneNumber: "010-1111-2222",
        department: "정보시스템학과",
        currentStudyName: "자율 스터디",
      },
      {
        userId: 3,
        name: "두 번째",
        phoneNumber: "010-3333-4444",
        department: "컴퓨터소프트웨어학부",
        currentStudyName: null,
      },
    ]);
  });

  it("fails instead of silently omitting receivers when a next cursor is missing", async () => {
    mockedGet.mockReturnValue(
      response({
        content: [],
        next_cursor: null,
        has_next: true,
        total_elements: 101,
      }),
    );

    await expect(
      getAllReceivers({ target: "CURRENT_SEMESTER_MEMBERS" }),
    ).rejects.toThrow("수신자 목록의 다음 페이지 정보를 확인할 수 없습니다.");
    expect(apiClient.get).toHaveBeenCalledTimes(1);
  });

  it("fails before requesting an already-seen cursor", async () => {
    mockedGet.mockReturnValueOnce(
      response({
        content: [],
        next_cursor: 5,
        has_next: true,
        total_elements: 2,
      }),
    );
    mockedGet.mockReturnValueOnce(
      response({
        content: [],
        next_cursor: 5,
        has_next: true,
        total_elements: 2,
      }),
    );

    await expect(
      getAllReceivers({ target: "CURRENT_SEMESTER_MEMBERS" }),
    ).rejects.toThrow("수신자 목록 페이지를 계속 불러올 수 없습니다.");
    expect(apiClient.get).toHaveBeenNthCalledWith(
      1,
      "api/v1/notifications/receivers",
      {
        searchParams: {
          size: 100,
          target_type: "CURRENT_SEMESTER_MEMBERS",
        },
      },
    );
    expect(apiClient.get).toHaveBeenNthCalledWith(
      2,
      "api/v1/notifications/receivers",
      {
        searchParams: {
          size: 100,
          target_type: "CURRENT_SEMESTER_MEMBERS",
          cursor: 5,
        },
      },
    );
  });

  it("maps a six-month AlimTalk history page and forwards its cursor", async () => {
    mockedGet.mockReturnValue(
      response({
        content: [
          {
            message_id: "message-1",
            template_id: "template-1",
            receiver: "01011112222",
            status: "SENT",
            status_code: "2000",
            created_at: "2026-09-08T10:00:00",
            processed_at: "2026-09-08T10:00:01",
            reported_at: null,
            updated_at: "2026-09-08T10:00:01",
          },
        ],
        next_cursor: "next-key",
        has_next: true,
      }),
    );

    await expect(
      getAlimTalkHistory({ cursor: "previous-key" }),
    ).resolves.toEqual({
      content: [
        {
          messageId: "message-1",
          templateId: "template-1",
          receiver: "01011112222",
          status: "SENT",
          statusCode: "2000",
          createdAt: "2026-09-08T10:00:00",
          processedAt: "2026-09-08T10:00:01",
          reportedAt: null,
          updatedAt: "2026-09-08T10:00:01",
        },
      ],
      nextCursor: "next-key",
      hasNext: true,
    });
    expect(apiClient.get).toHaveBeenCalledWith("api/v1/notifications/history", {
      searchParams: { size: 50, cursor: "previous-key" },
    });
  });

  it("preserves the send payload and maps the snake_case delivery result", async () => {
    mockedPost.mockReturnValue(
      response({
        template_id: "template-1",
        total_count: 2,
        success_count: 1,
        failure_count: 1,
        results: [
          {
            receiver: "01011112222",
            success: true,
            error_code: null,
            error_message: null,
          },
        ],
      }),
    );
    const request = {
      receivers: ["01011112222"],
      templateCode: "template-1",
      variables: { name: "홍길동" },
    };

    const result = await sendAlimTalk(request);

    expect(apiClient.post).toHaveBeenCalledWith("api/v1/notifications", {
      json: request,
    });
    expect(result.data).toEqual({
      templateId: "template-1",
      totalCount: 2,
      successCount: 1,
      failureCount: 1,
      results: [
        {
          receiver: "01011112222",
          success: true,
          errorCode: null,
          errorMessage: null,
        },
      ],
    });
  });
});
