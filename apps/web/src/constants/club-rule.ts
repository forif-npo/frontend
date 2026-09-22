import { INITIAL_RULE } from "./club-rule-initial";
import { FIRST_REVISION_RULE } from "./club-rule-revision-1";
import { SECOND_REVISION_RULE } from "./club-rule-revision-2";
import type { ClubRuleRevision } from "./club-rule.types";

export type { ClubRuleRevision } from "./club-rule.types";

export const CURRENT_RULE_REVISION_ID = "second-revision";

export const CURRENT_CLUB_RULE: ClubRuleRevision = {
  id: CURRENT_RULE_REVISION_ID,
  revisionDate: "2020. 02. 31",
  amendmentType: "일부개정",
  content: SECOND_REVISION_RULE,
};

export const CLUB_RULE_REVISIONS: readonly ClubRuleRevision[] = [
  CURRENT_CLUB_RULE,
  FIRST_REVISION_RULE,
  INITIAL_RULE,
];
