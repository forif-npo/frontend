export type HallOfFamePublicationStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

export interface HallOfFameAchievement {
  achievement_id: number;
  title: string;
  description: string | null;
  link_url: string | null;
  display_order: number;
}

export interface HallOfFameBadge {
  label: string;
  display_order: number;
}

export interface HallOfFameEntry {
  entry_id: number;
  slug: string;
  user_id: number | null;
  name: string;
  act_year: number;
  act_semester: number;
  semester_label: string;
  title: string;
  introduction: string;
  achievements: HallOfFameAchievement[];
  badges: HallOfFameBadge[];
  image_url: string | null;
  display_order: number;
  published_at: string | null;
  updated_at: string;
}

export interface AdminHallOfFameEntry extends HallOfFameEntry {
  publication_status: HallOfFamePublicationStatus;
  version: number;
}

export interface HallOfFameAchievementInput {
  title: string;
  description: string | null;
  link_url: string | null;
  display_order: number;
}

export interface HallOfFameEntryCreateRequest {
  user_id: number;
  slug: string;
  act_year: number;
  act_semester: number;
  title: string;
  introduction: string;
  achievements: HallOfFameAchievementInput[];
  badges: HallOfFameBadge[];
  display_order: number;
}

export interface HallOfFameEntryUpdateRequest
  extends HallOfFameEntryCreateRequest {
  version: number;
}

export interface HallOfFameMemberCandidate {
  user_id: number;
  user_name: string;
  department: string | null;
}
