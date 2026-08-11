import type { TeamMember } from "./types";

const EXECUTIVE_PRIORITY: Record<string, number> = {
  회장: 0,
  부회장: 1,
};

const getExecutivePriority = (title: string | null) =>
  title ? (EXECUTIVE_PRIORITY[title] ?? 2) : 2;

const compareKorean = (first: string, second: string) =>
  first.localeCompare(second, "ko");

export const sortTeamMembers = (members: TeamMember[]) =>
  [...members].sort((first, second) => {
    const executivePriority =
      getExecutivePriority(first.user_title) -
      getExecutivePriority(second.user_title);
    if (executivePriority !== 0) return executivePriority;

    if (getExecutivePriority(first.user_title) < 2) {
      return compareKorean(first.user_name, second.user_name);
    }

    const departmentOrder = compareKorean(
      first.club_department ?? "\uffff",
      second.club_department ?? "\uffff",
    );
    if (departmentOrder !== 0) return departmentOrder;

    const teamLeaderOrder =
      Number(second.user_title === "팀장") -
      Number(first.user_title === "팀장");
    if (teamLeaderOrder !== 0) return teamLeaderOrder;

    return compareKorean(first.user_name, second.user_name);
  });
