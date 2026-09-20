import { describe, expect, it } from "@jest/globals";
import { CLUB_RULE_REVISIONS, CURRENT_RULE_REVISION_ID } from "./club-rule";
import { SECOND_REVISION_RULE } from "./club-rule-revision-2";

describe("CLUB_RULE_REVISIONS", () => {
  it("uses the second revision as the default and retains the current content", () => {
    const currentRevision = CLUB_RULE_REVISIONS.find(
      (revision) => revision.id === CURRENT_RULE_REVISION_ID,
    );

    expect(currentRevision).toMatchObject({
      id: "second-revision",
      revisionDate: "2020. 02. 31",
      amendmentType: "일부개정",
      content: SECOND_REVISION_RULE,
    });
  });

  it("includes the initial and first revision entries", () => {
    expect(CLUB_RULE_REVISIONS).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "initial",
          revisionDate: "2018. 05. 01",
          amendmentType: "제정",
        }),
        expect.objectContaining({
          id: "first-revision",
          revisionDate: "2018. 08. 27",
          amendmentType: "일부개정",
        }),
      ]),
    );
  });
});
