import type { ApiResponse } from "@core/types/api";
import type {
  ProductApplicationStatus,
  ProductOperationStatus,
  ProductSourceType,
} from "@core/products";
import { apiClient } from "@core/utils/api-client";

/**
 * 서비스 쇼케이스 API (FOR-105)
 */

export type {
  ProductApplicationStatus,
  ProductOperationStatus,
  ProductSourceType,
} from "@core/products";

export interface ProductSummary {
  slug: string;
  name: string;
  one_liner: string;
  status: ProductApplicationStatus;
  operation_status: ProductOperationStatus;
  source_type: ProductSourceType;
  source_label: string | null;
  tags: string[];
  thumbnail_url: string | null;
  act_year: number;
}

export interface ProductMember {
  user_name: string;
  role_label: string;
}

export interface ProductDetail extends ProductSummary {
  description: string;
  service_url: string | null;
  github_url: string | null;
  tech_stack: string[];
  members: ProductMember[];
  screenshots: string[];
}

export interface ProductApplication {
  application_id: number;
  name: string;
  slug: string;
  one_liner: string;
  description: string;
  source_type: ProductSourceType;
  service_url: string | null;
  github_url: string | null;
  thumbnail_url: string | null;
  tags: string[];
  tech_stack: string[];
  status: ProductApplicationStatus;
  operation_status: ProductOperationStatus | null;
  reject_reason: string | null;
  applied_at: string;
}

export interface CreateProductApplicationBody {
  name: string;
  slug: string;
  one_liner: string;
  description: string;
  source_type: ProductSourceType;
  service_url?: string | null;
  github_url?: string | null;
  tech_stack?: string[];
  tags?: string[];
}

export interface UpdateProductApplicationBody
  extends CreateProductApplicationBody {
  remove_thumbnail?: boolean;
}

// ── 공개 ────────────────────────────────────────────────────────────

export async function getProducts(): Promise<ProductSummary[]> {
  const response = await apiClient
    .get("api/v1/products")
    .json<ApiResponse<ProductSummary[]>>();
  return response.data ?? [];
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const response = await apiClient
      .get(`api/v1/products/${slug}`)
      .json<ApiResponse<ProductDetail>>();
    return response.data ?? null;
  } catch {
    return null;
  }
}

// ── 부원 (로그인 필요) ───────────────────────────────────────────────

export async function applyProduct(
  body: CreateProductApplicationBody,
  thumbnail?: File | null,
): Promise<ProductApplication> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(body)], { type: "application/json" }),
  );
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }

  const response = await apiClient
    .post("api/v1/products/applications", { body: formData })
    .json<ApiResponse<ProductApplication>>();
  return response.data!;
}

export async function getMyProductApplications(
  token?: string,
): Promise<ProductApplication[]> {
  const options = token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : {};
  const response = await apiClient
    .get("api/v1/products/applications/me", options)
    .json<ApiResponse<ProductApplication[]>>();
  return response.data ?? [];
}

/** 검토 대기 중인 본인 서비스 신청서를 수정한다. */
export async function updateProductApplication(
  applicationId: number,
  body: UpdateProductApplicationBody,
  thumbnail?: File | null,
): Promise<ProductApplication> {
  const formData = new FormData();
  formData.append(
    "request",
    new Blob([JSON.stringify(body)], { type: "application/json" }),
  );
  if (thumbnail) {
    formData.append("thumbnail", thumbnail);
  }

  const response = await apiClient
    .patch(`api/v1/products/applications/${applicationId}`, { body: formData })
    .json<ApiResponse<ProductApplication>>();
  return response.data!;
}

/** 검토 대기 중인 본인 서비스 신청서를 삭제한다. */
export async function deleteProductApplication(
  applicationId: number,
): Promise<void> {
  await apiClient
    .delete(`api/v1/products/applications/${applicationId}`)
    .json();
}
