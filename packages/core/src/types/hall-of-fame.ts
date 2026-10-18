export type HallOfFamePublicationStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

export interface HallOfFameAchievement {
  achievement_id: number;
  title: string;
  description: string | null;
  link_url: string | null;
  display_order: number;
}

export interface HallOfFameEntry {
  entry_id: number;
  slug: string;
  member_name: string;
  act_year: number;
  act_semester: number;
  semester_label: string;
  headline: string | null;
  introduction: string | null;
  achievements: HallOfFameAchievement[];
  badges: string[];
  image_url: string | null;
  published_at: string | null;
}

export interface AdminHallOfFameEntry extends HallOfFameEntry {
  member_user_id: number | null;
  status: HallOfFamePublicationStatus;
  display_order: number;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface HallOfFameAchievementInput {
  title: string;
  description: string | null;
  link_url: string | null;
  display_order: number;
}

export interface HallOfFameEntryCreateRequest {
  member_user_id: number | null;
  member_name: string | null;
  slug: string;
  act_year: number;
  act_semester: number;
  headline: string | null;
  introduction: string | null;
  achievements: HallOfFameAchievementInput[];
  badges: string[];
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

export interface HallOfFameImageUploadResponse {
  image_url: string;
  version: number;
}
