import { describe, expect, it } from "@jest/globals";
import {
  createDuesUpdates,
  getDuesOutstandingCounts,
  mergeSelectedMembers,
} from "./dues-utils";
import type { DuesMember } from "./types";

const firstMember: DuesMember = {
  userId: 20260001,
  userName: "홍길동",
  department: "컴퓨터소프트웨어학부",
  duesPaid: false,
  googleFormSubmitted: false,
};

const secondMember: DuesMember = {
  userId: 20260002,
  userName: "김포리",
  department: "정보시스템학과",
  duesPaid: true,
  googleFormSubmitted: true,
};

describe("dues utils", () => {
  it("preserves selections from other pages while applying the current page selection", () => {
    const result = mergeSelectedMembers(
      new Map([[secondMember.userId, secondMember]]),
      [firstMember],
      { [firstMember.userId]: true },
    );

    expect(Array.from(result.values())).toEqual([secondMember, firstMember]);
  });

  it("removes only deselected members from the current page", () => {
    const result = mergeSelectedMembers(
      new Map([
        [firstMember.userId, firstMember],
        [secondMember.userId, secondMember],
      ]),
      [firstMember],
      {},
    );

    expect(Array.from(result.values())).toEqual([secondMember]);
  });

  it("creates the existing batch-update payload and summary counts", () => {
    expect(createDuesUpdates([firstMember], "duesPaid", true)).toEqual([
      { userId: 20260001, duesPaid: true },
    ]);
    expect(
      getDuesOutstandingCounts({
        totalCount: 10,
        duesPaidCount: 7,
        googleFormSubmittedCount: 8,
        completedCount: 6,
      }),
    ).toEqual({ formNotSubmitted: 2, duesNotPaid: 3 });
  });
});
