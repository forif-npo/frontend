import { describe, expect, it } from "@jest/globals";
import type { StudyOpenValues } from "@core/schemas";
import type { StudyApplicationDetail } from "@/features/study-application/api";
import {
  buildReferenceUpdate,
  toShortDate,
} from "./study-application-editor-utils";

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
