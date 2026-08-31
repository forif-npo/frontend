/**
 * 서비스 쇼케이스에서 사용하는 상태와 표시 이름이다.
 *
 * 두 앱이 같은 API 상태를 서로 다른 문자열로 해석하지 않도록 이곳에서
 * 도메인 정의만 공유한다. 각 앱은 기존 Badge 구현과 스타일을 그대로 사용한다.
 */
export type ProductStatus = "LIVE" | "DEV" | "PAUSED" | "RETIRED";

export type ProductApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export type ProductAdminStatus = ProductStatus | "PENDING" | "REJECTED";

export type ProductSourceType = "STUDY" | "HACKATHON" | "SIDE";

export const PRODUCT_STATUS_LABELS: Record<ProductAdminStatus, string> = {
  PENDING: "검토 대기",
  REJECTED: "반려",
  LIVE: "운영 중",
  DEV: "개발 중",
  PAUSED: "운영 중단",
  RETIRED: "서비스 종료",
};

export const PRODUCT_SOURCE_LABELS: Record<ProductSourceType, string> = {
  STUDY: "스터디",
  HACKATHON: "해커톤",
  SIDE: "자율 프로젝트",
};

export const PRODUCT_PUBLISHED_STATUSES: ProductStatus[] = [
  "LIVE",
  "DEV",
  "PAUSED",
  "RETIRED",
];

/** API에 새 상태가 추가돼도 기존 화면처럼 원본 값을 표시한다. */
export function getProductStatusLabel(status: string): string {
  return PRODUCT_STATUS_LABELS[status as ProductAdminStatus] ?? status;
}
