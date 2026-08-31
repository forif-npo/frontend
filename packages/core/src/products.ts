/** 서비스 등록 신청의 심사 상태. */
export type ProductApplicationStatus = "PENDING" | "ACCEPTED" | "REJECTED";

/** 승인된 서비스에만 부여하는 운영 상태. */
export type ProductOperationStatus = "LIVE" | "PAUSED";

export type ProductSourceType = "STUDY" | "HACKATHON" | "SIDE";

export const PRODUCT_APPLICATION_STATUS_LABELS: Record<
  ProductApplicationStatus,
  string
> = {
  PENDING: "검토 대기",
  ACCEPTED: "승인",
  REJECTED: "반려",
};

export const PRODUCT_OPERATION_STATUS_LABELS: Record<
  ProductOperationStatus,
  string
> = {
  LIVE: "운영 중",
  PAUSED: "운영 중단",
};

export const PRODUCT_SOURCE_LABELS: Record<ProductSourceType, string> = {
  STUDY: "스터디",
  HACKATHON: "해커톤",
  SIDE: "자율 프로젝트",
};
