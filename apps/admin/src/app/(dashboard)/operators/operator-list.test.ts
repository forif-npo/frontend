import { describe, expect, it } from "@jest/globals";

import { processOperators } from "./operator-list";
import type { Operator } from "./types";

const operators: Operator[] = [
  {
    id: 1,
    userId: 20260003,
    department: "개발팀",
    name: "가람",
    phoneNum: "010-0000-0000",
    title: "팀원",
    actYear: 2026,
    actSemester: 1,
    introTag: "",
    selfIntro: "",
    profImgUrl: "",
    graduateYear: null,
  },
  {
    id: 2,
    userId: 20260001,
    department: "개발팀",
    name: "다람",
    phoneNum: "010-0000-0000",
    title: "팀장",
    actYear: 2026,
    actSemester: 1,
    introTag: "",
    selfIntro: "",
    profImgUrl: "",
    graduateYear: null,
  },
  {
    id: 3,
    userId: 20260002,
    department: "기획팀",
    name: "나람",
    phoneNum: "010-0000-0000",
    title: "팀원",
    actYear: 2026,
    actSemester: 1,
    introTag: "",
    selfIntro: "",
    profImgUrl: "",
    graduateYear: null,
  },
];

describe("processOperators", () => {
  it("학기별 운영진을 모든 정렬 기준 순서대로 정렬한 뒤 페이지를 나눈다", () => {
    const result = processOperators(operators, {
      semester: "26-1",
      page: 0,
      size: 2,
      sorting: [
        { id: "department", desc: false },
        { id: "name", desc: true },
      ],
    });

    expect(result.content.map((operator) => operator.name)).toEqual([
      "다람",
      "가람",
    ]);
    expect(result.totalElements).toBe(3);

    expect(
      processOperators(operators, {
        semester: "26-1",
        page: 1,
        size: 2,
        sorting: [
          { id: "department", desc: false },
          { id: "name", desc: true },
        ],
      }).content.map((operator) => operator.name),
    ).toEqual(["나람"]);
  });
});
