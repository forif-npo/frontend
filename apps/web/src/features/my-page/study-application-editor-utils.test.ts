import { describe, expect, it } from "@jest/globals";
import type { StudyOpenValues } from "@core/schemas";
import type { StudyApplicationDetail } from "@/features/study-application/api";
import {
  buildReferenceUpdate,
  canUpdateStudyApplication,
  toShortDate,
  toFormValues,
} from "./study-application-editor-utils";

describe("canUpdateStudyApplication", () => {
  const readyState = {
    canModify: true,
    hasReferenceUpdates: false,
    isCancelling: false,
    isDirty: true,
    isSubmitting: false,
  };

  it("allows a dirty form or a changed reference list", () => {
    expect(canUpdateStudyApplication(readyState)).toBe(true);
    expect(
      canUpdateStudyApplication({
        ...readyState,
        isDirty: false,
        hasReferenceUpdates: true,
      }),
    ).toBe(true);
  });

  it.each([
    ["no edit permission", { canModify: false }],
    ["no form or reference change", { isDirty: false }],
    ["submission in progress", { isSubmitting: true }],
    ["cancellation in progress", { isCancelling: true }],
  ])("blocks updates with %s", (_, change) => {
    expect(canUpdateStudyApplication({ ...readyState, ...change })).toBe(false);
  });
});

describe("toShortDate", () => {
  it.each([
    ["2026-09-02T10:30:00", "260902"],
    ["2026. 09. 02", "260902"],
    ["260902", "260902"],
    [null, ""],
  ])("converts %s to the form date format", (value, expected) => {
    expect(toShortDate(value)).toBe(expected);
  });
});

describe("buildReferenceUpdate", () => {
  const originalReferences: StudyApplicationDetail["study"]["references"] = [
    {
      id: "existing-url",
      reference_type: "URL",
      content: "https://forif.org/reference",
      file_name: null,
    },
    {
      id: "existing-file",
      reference_type: "FILE",
      content: "/uploads/reference.pdf",
      file_name: "reference.pdf",
    },
  ];

  it("keeps unchanged existing references out of the update payload", () => {
    const references: StudyOpenValues["references"] = [
      {
        id: "existing-url",
        type: "LINK",
        value: "https://forif.org/reference",
      },
      {
        id: "existing-file",
        type: "DOWNLOAD",
        value: "/uploads/reference.pdf",
        fileName: "reference.pdf",
      },
    ];

    expect(buildReferenceUpdate(references, originalReferences)).toEqual({
      retainedReferenceIds: ["existing-url", "existing-file"],
      references: [],
      hasChanges: false,
    });
  });

  it("sends changed and newly-added references while retaining unchanged ones", () => {
    const references: StudyOpenValues["references"] = [
      {
        id: "existing-url",
        type: "LINK",
        value: "https://forif.org/reference",
      },
      {
        id: "existing-file",
        type: "DOWNLOAD",
        value: "/uploads/revised-reference.pdf",
      },
      {
        type: "LINK",
        value: "https://forif.org/new-reference",
      },
    ];

    expect(buildReferenceUpdate(references, originalReferences)).toEqual({
      retainedReferenceIds: ["existing-url"],
      references: references.slice(1),
      hasChanges: true,
    });
  });
});

describe("toFormValues", () => {
  it("preserves the existing editor initialization contract", () => {
    const application: StudyApplicationDetail = {
      study: {
        id: 12,
        study_name: "React 심화",
        one_liner: "컴포넌트를 깊게 이해합니다.",
        primary_mentor_name: "홍길동",
        secondary_mentor_name: "김포리프",
        tags: ["frontend", "react"],
        explanation: null,
        goal: "React의 렌더링 원리를 이해합니다.",
        start_time: "19:00",
        end_time: "21:00",
        week_day: 3,
        location: "제1공학관",
        location_detail: "101호",
        difficulty: "NORMAL",
        is_online: false,
        capacity: 30,
        requires_interview: true,
        interview_date: "2026-09-02T00:00:00",
        mentors: [
          { mentor_id: 1, mentor_num: 1 },
          { mentor_id: 2, mentor_num: 2 },
        ],
        plans: [
          {
            id: 1,
            week_num: 2,
            date: "2026-09-16",
            section: "렌더링",
            content: "reconciliation; memo",
          },
          {
            id: 2,
            week_num: 1,
            date: "2026-09-09",
            section: "기초",
            content: null,
          },
        ],
        references: [
          {
            id: "reference-file",
            reference_type: "FILE",
            content: "/uploads/react.pdf",
            file_name: "react.pdf",
          },
          {
            id: "reference-url",
            reference_type: "URL",
            content: "https://react.dev",
            file_name: null,
          },
        ],
      },
      study_status: "PENDING",
      reject_reason: null,
      can_modify: true,
      can_cancel: true,
    };

    expect(toFormValues(application)).toMatchObject({
      mentorIds: [2],
      studyName: "React 심화",
      oneLiner: "컴포넌트를 깊게 이해합니다.",
      tags: ["프론트엔드", "React"],
      thumbnail: null,
      introduction: "React의 렌더링 원리를 이해합니다.",
      isOnline: false,
      location: "제1공학관",
      room: "101호",
      weekDay: "3",
      startTime: "19:00",
      endTime: "21:00",
      difficulty: "NORMAL",
      hasInterview: true,
      interviewDate: "260902",
      references: [
        {
          id: "reference-file",
          type: "DOWNLOAD",
          value: "/uploads/react.pdf",
          fileName: "react.pdf",
        },
        {
          id: "reference-url",
          type: "LINK",
          value: "https://react.dev",
          fileName: null,
        },
      ],
    });
    expect(toFormValues(application).curriculum).toEqual([
      { week: 1, date: "", topic: "", contents: [""] },
      { week: 2, date: "", topic: "", contents: [""] },
      { week: 3, date: "", topic: "", contents: [""] },
      { week: 4, date: "", topic: "", contents: [""] },
      { week: 5, date: "", topic: "", contents: [""] },
      { week: 6, date: "", topic: "", contents: [""] },
      { week: 7, date: "", topic: "", contents: [""] },
      { week: 8, date: "", topic: "", contents: [""] },
    ]);
  });
});
