/**
 * 프로덕트(부원 서비스 쇼케이스) 타입.
 * 백엔드 API(/api/v1/products) 연동 시 응답 스키마와 1:1 대응하도록 snake_case를 사용한다.
 */

export type ProductStatus = "LIVE" | "DEV" | "PAUSED" | "RETIRED";

export type ProductSourceType = "STUDY" | "HACKATHON" | "SIDE";

export interface ProductMember {
  user_name: string;
  role_label: string;
}

export interface ProductSummary {
  slug: string;
  name: string;
  one_liner: string;
  status: ProductStatus;
  source_type: ProductSourceType;
  /** 출처 표기용 라벨 (예: "2026-1 해커톤 대상") */
  source_label: string | null;
  tags: string[];
  thumbnail_url: string | null;
  act_year: number;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  service_url: string | null;
  github_url: string | null;
  tech_stack: string[];
  members: ProductMember[];
  screenshots: string[];
}

// ── 등록 신청 ────────────────────────────────────────────────────────

export type ProductApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ProductApplication {
  application_id: string;
  name: string;
  slug: string;
  one_liner: string;
  description: string;
  source_type: ProductSourceType;
  service_url: string | null;
  github_url: string | null;
  tech_stack: string[];
  status: ProductApplicationStatus;
  /** 반려 시 운영진이 남기는 사유 */
  reject_reason: string | null;
  applied_at: string;
}
