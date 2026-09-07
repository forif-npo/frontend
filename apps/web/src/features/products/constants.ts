import { PRODUCT_SOURCE_LABELS, type ProductSourceType } from "@core/products";
import type { ProductOperationStatus } from "./api";

export { PRODUCT_SOURCE_LABELS };

export const PRODUCT_OPERATION_STATUS_BADGE_VARIANTS: Record<
  ProductOperationStatus,
  "primary" | "success" | "warning" | "danger" | "disabled" | "info"
> = {
  LIVE: "success",
  PAUSED: "warning",
};

/** 서비스 등록 신청과 목록 필터에서 공유하는 출처 선택지. */
export const PRODUCT_SOURCE_OPTIONS: Array<{
  value: ProductSourceType;
  label: string;
}> = [
  { value: "STUDY", label: PRODUCT_SOURCE_LABELS.STUDY },
  { value: "HACKATHON", label: PRODUCT_SOURCE_LABELS.HACKATHON },
  { value: "SIDE", label: PRODUCT_SOURCE_LABELS.SIDE },
];

/** 목록 상단 필터 탭: 전체 + 출처별 */
export const PRODUCT_SOURCE_FILTERS = [
  { value: "ALL", label: "전체" },
  ...PRODUCT_SOURCE_OPTIONS,
] as const;

export type ProductSourceFilter =
  (typeof PRODUCT_SOURCE_FILTERS)[number]["value"];
