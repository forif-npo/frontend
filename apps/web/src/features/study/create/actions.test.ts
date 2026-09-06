/** @jest-environment jsdom */

import { describe, expect, it, jest, beforeEach } from "@jest/globals";

jest.mock("@core/utils/api-client", () => ({
  apiClient: {
    post: jest.fn(),
    patch: jest.fn(),
  },
}));

import type { StudyOpenValues } from "@core/schemas";
import { apiClient } from "@core/utils/api-client";
import { submitStudyCreate } from "./actions";

const values: StudyOpenValues = {
  mentorIds: [20260002],
  studyName: "React 심화",
  oneLiner: "렌더링 원리를 이해합니다.",
  tags: ["프론트엔드", "React"],
  thumbnail: null,
  introduction: "React의 렌더링 과정을 학습합니다.",
  isOnline: false,
  location: "제1공학관",
  room: "101호",
  weekDay: "3",
  startTime: "19:00",
  endTime: "21:00",
  curriculum: [
    {
      week: 1,
      date: "2026-09-02",
      topic: "기초",
      contents: ["컴포넌트", "렌더링"],
    },
  ],
  difficulty: "NORMAL",
  hasInterview: true,
  interviewDate: "2026-08-28",
  references: [{ type: "LINK", value: "https://react.dev", fileName: null }],
};

type ApiMethodMock = {
  mock: { calls: Array<[string, { body: FormData }]> };
  mockReset: () => void;
  mockReturnValue: (value: ReturnType<typeof mockResponse>) => void;
};

const post = apiClient.post as unknown as ApiMethodMock;
const patch = apiClient.patch as unknown as ApiMethodMock;

function mockResponse() {
  return {
    json: <T>() => Promise.resolve({ data: { study_id: 12 } } as T),
  };
}

async function getRequestPayload(formData: FormData) {
  const request = formData.get("studyRequest");
  expect(request).toBeInstanceOf(Blob);
  const text = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(request as Blob);
  });

  return JSON.parse(text) as Record<string, unknown>;
}

describe("submitStudyCreate", () => {
  beforeEach(() => {
    post.mockReset();
    patch.mockReset();
  });

  it("creates the existing snake_case request payload", async () => {
    post.mockReturnValue(mockResponse());

    await submitStudyCreate(values);

    expect(post).toHaveBeenCalledWith("api/v1/study-apply", {
      body: expect.any(FormData),
    });
    const formData = post.mock.calls[0][1].body as FormData;
    expect(await getRequestPayload(formData)).toMatchObject({
      title: "React 심화",
      study_tag_names: ["frontend", "react"],
      is_online: false,
      study_location: "제1공학관",
      study_location_detail: "101호",
      study_plan_list: [
        {
          week_num: 1,
          date: "2026-09-02T00:00:00",
          content: "컴포넌트; 렌더링",
        },
      ],
      interview_date: "2026-08-28T00:00:00",
      secondary_mentor_id: 20260002,
      references: [{ type: "URL", url: "https://react.dev", file_name: null }],
    });
  });

  it("updates only dirty fields and reference changes", async () => {
    patch.mockReturnValue(mockResponse());
    const changedReferences: StudyOpenValues["references"] = [
      { type: "LINK", value: "https://react.dev/learn", fileName: null },
    ];

    await submitStudyCreate(
      values,
      42,
      { studyName: true, room: true },
      {
        hasChanges: true,
        retainedReferenceIds: ["unchanged-reference"],
        references: changedReferences,
      },
    );

    expect(patch).toHaveBeenCalledWith("api/v1/study-apply/42", {
      body: expect.any(FormData),
    });
    const formData = patch.mock.calls[0][1].body as FormData;
    expect(await getRequestPayload(formData)).toEqual({
      study_name: "React 심화",
      location_detail: "101호",
      references: [
        { type: "URL", url: "https://react.dev/learn", file_name: null },
      ],
      retained_reference_ids: ["unchanged-reference"],
    });
  });

  it("maps all non-reference dirty fields to the existing update contract", async () => {
    patch.mockReturnValue(mockResponse());

    await submitStudyCreate({ ...values, mentorIds: [], isOnline: true }, 42, {
      mentorIds: true,
      oneLiner: true,
      tags: true,
      introduction: true,
      isOnline: true,
      location: true,
      room: true,
      weekDay: true,
      startTime: true,
      endTime: true,
      curriculum: true,
      difficulty: true,
      hasInterview: true,
    });

    const formData = patch.mock.calls[0][1].body;
    expect(await getRequestPayload(formData)).toEqual({
      secondary_mentor_id: null,
      one_liner: "렌더링 원리를 이해합니다.",
      study_tag_names: ["frontend", "react"],
      explanation: "React의 렌더링 과정을 학습합니다.",
      is_online: true,
      location: "제1공학관",
      location_detail: "101호",
      week_day: 3,
      start_time: "19:00",
      end_time: "21:00",
      study_plan_list: [
        {
          week_num: 1,
          date: "2026-09-02T00:00:00",
          topic: "기초",
          content: "컴포넌트; 렌더링",
        },
      ],
      difficulty: 3,
      requires_interview: true,
      interview_date: "2026-08-28T00:00:00",
    });
    expect(formData.getAll("references")).toEqual([]);
  });

  it("does not resend reference files when an update has no reference changes", async () => {
    patch.mockReturnValue(mockResponse());
    const file = new File(["reference"], "reference.pdf", {
      type: "application/pdf",
    });

    await submitStudyCreate(
      {
        ...values,
        references: [{ type: "DOWNLOAD", value: file, fileName: file.name }],
      },
      42,
      { oneLiner: true },
    );

    const formData = patch.mock.calls[0][1].body;
    expect(formData.getAll("references")).toEqual([]);
    expect(await getRequestPayload(formData)).toEqual({
      one_liner: "렌더링 원리를 이해합니다.",
    });
  });

  it("attaches new reference files with the backend field name", async () => {
    post.mockReturnValue(mockResponse());
    const file = new File(["reference"], "reference.pdf", {
      type: "application/pdf",
    });

    await submitStudyCreate({
      ...values,
      references: [{ type: "DOWNLOAD", value: file, fileName: file.name }],
    });

    const formData = post.mock.calls[0][1].body as FormData;
    expect(formData.getAll("references")).toHaveLength(1);
    expect((formData.get("references") as File).name).toBe("reference.pdf");
    expect(await getRequestPayload(formData)).toMatchObject({
      references: [{ type: "FILE", url: "", file_name: "reference.pdf" }],
    });
  });
});
