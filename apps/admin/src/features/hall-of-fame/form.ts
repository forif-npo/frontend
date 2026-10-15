import type {
  AdminHallOfFameEntry,
  HallOfFameEntryCreateRequest,
} from "@core/types/hall-of-fame";

export interface HallOfFameFormState {
  userId: string;
  memberName: string;
  memberDepartment: string;
  slug: string;
  actYear: string;
  actSemester: "1" | "2";
  title: string;
  introduction: string;
  badges: string[];
  achievements: Array<{
    title: string;
    description: string;
    linkUrl: string;
  }>;
  displayOrder: string;
}

export function emptyHallOfFameForm(): HallOfFameFormState {
  return {
    userId: "",
    memberName: "",
    memberDepartment: "",
    slug: "",
    actYear: String(new Date().getFullYear()),
    actSemester: "1",
    title: "",
    introduction: "",
    badges: [],
    achievements: [{ title: "", description: "", linkUrl: "" }],
    displayOrder: "0",
  };
}

export function hallOfFameEntryToForm(
  entry: AdminHallOfFameEntry,
): HallOfFameFormState {
  return {
    userId: entry.user_id === null ? "" : String(entry.user_id),
    memberName: entry.name,
    memberDepartment: "",
    slug: entry.slug,
    actYear: String(entry.act_year),
    actSemester: String(entry.act_semester) as "1" | "2",
    title: entry.title,
    introduction: entry.introduction,
    badges: [...entry.badges]
      .sort((first, second) => first.display_order - second.display_order)
      .map((badge) => badge.label),
    achievements: [...entry.achievements]
      .sort((first, second) => first.display_order - second.display_order)
      .map((achievement) => ({
        title: achievement.title,
        description: achievement.description ?? "",
        linkUrl: achievement.link_url ?? "",
      })),
    displayOrder: String(entry.display_order),
  };
}

export function validateHallOfFameForm(
  form: HallOfFameFormState,
): string | null {
  if (!form.userId || !form.memberName.trim()) {
    return "전시할 회원을 선택해주세요.";
  }
  if (!/^[a-z0-9](?:[a-z0-9-]{1,78}[a-z0-9])$/.test(form.slug.trim())) {
    return "slug는 영문 소문자·숫자·하이픈을 사용해 3~80자로 입력해주세요.";
  }
  if (!form.title.trim() || !form.introduction.trim()) {
    return "전시 제목과 소개를 입력해주세요.";
  }
  const year = Number(form.actYear);
  if (!Number.isInteger(year) || year < 2000 || year > 2100) {
    return "활동 연도를 확인해주세요.";
  }
  const displayOrder = Number(form.displayOrder);
  if (!Number.isInteger(displayOrder) || displayOrder < 0) {
    return "노출 순서는 0 이상의 정수로 입력해주세요.";
  }
  const badges = form.badges.map((badge) => badge.trim()).filter(Boolean);
  if (badges.length > 10 || badges.some((badge) => badge.length > 30)) {
    return "배지는 최대 10개, 각 30자까지 입력할 수 있습니다.";
  }
  const achievements = form.achievements.filter(
    (achievement) =>
      achievement.title.trim() ||
      achievement.description.trim() ||
      achievement.linkUrl.trim(),
  );
  if (achievements.length > 20) {
    return "성취는 최대 20개까지 입력할 수 있습니다.";
  }
  if (achievements.some((achievement) => !achievement.title.trim())) {
    return "작성한 성취에는 제목이 필요합니다.";
  }
  if (
    achievements.some(
      (achievement) =>
        achievement.linkUrl.trim() &&
        !achievement.linkUrl.trim().startsWith("https://"),
    )
  ) {
    return "성취 링크는 https 주소만 사용할 수 있습니다.";
  }
  return null;
}

export function toHallOfFameSaveRequest(
  form: HallOfFameFormState,
): HallOfFameEntryCreateRequest {
  return {
    user_id: Number(form.userId),
    slug: form.slug.trim(),
    act_year: Number(form.actYear),
    act_semester: Number(form.actSemester),
    title: form.title.trim(),
    introduction: form.introduction.trim(),
    badges: form.badges
      .map((badge) => badge.trim())
      .filter(Boolean)
      .map((label, index) => ({ label, display_order: index + 1 })),
    achievements: form.achievements
      .filter(
        (achievement) =>
          achievement.title.trim() ||
          achievement.description.trim() ||
          achievement.linkUrl.trim(),
      )
      .map((achievement, index) => ({
        title: achievement.title.trim(),
        description: achievement.description.trim() || null,
        link_url: achievement.linkUrl.trim() || null,
        display_order: index + 1,
      })),
    display_order: Number(form.displayOrder),
  };
}
