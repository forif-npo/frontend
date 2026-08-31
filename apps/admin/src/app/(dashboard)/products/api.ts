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

// ── 운영진 ──────────────────────────────────────────────────────────

export interface AdminProduct {
  product_id: number;
  slug: string;
  name: string;
  one_liner: string;
  description: string;
  status: ProductApplicationStatus;
  operation_status: ProductOperationStatus | null;
  source_type: ProductSourceType;
  source_label: string | null;
  tags: string[];
  tech_stack: string[];
  service_url: string | null;
  github_url: string | null;
  act_year: number;
  thumbnail_url: string | null;
  reject_reason: string | null;
  applied_at: string;
  applicant_name: string;
  applicant_id: number;
}

export async function getAdminProducts(): Promise<AdminProduct[]> {
  const response = await apiClient
    .get("api/v1/admin/products")
    .json<ApiResponse<AdminProduct[]>>();
  return response.data ?? [];
}

export async function approveProduct(productId: number): Promise<void> {
  await apiClient.patch(`api/v1/admin/products/${productId}/approve`).json();
}

export async function rejectProduct(
  productId: number,
  rejectReason: string,
): Promise<void> {
  await apiClient
    .patch(`api/v1/admin/products/${productId}/reject`, {
      json: { reject_reason: rejectReason },
    })
    .json();
}

export async function changeProductOperationStatus(
  productId: number,
  operationStatus: ProductOperationStatus,
): Promise<void> {
  await apiClient
    .patch(`api/v1/admin/products/${productId}/operation-status`, {
      json: { operation_status: operationStatus },
    })
    .json();
}

export async function deleteProduct(productId: number): Promise<void> {
  await apiClient.delete(`api/v1/admin/products/${productId}`).json();
}

export interface UpdateProductBody {
  name?: string;
  one_liner?: string;
  description?: string;
  source_label?: string;
  tags?: string[];
  tech_stack?: string[];
  service_url?: string;
  github_url?: string;
}

/** 전달한 필드만 수정된다. 빈 문자열·빈 배열은 해당 항목을 비운다. */
export async function updateProduct(
  productId: number,
  body: UpdateProductBody,
): Promise<AdminProduct> {
  const response = await apiClient
    .patch(`api/v1/admin/products/${productId}`, { json: body })
    .json<ApiResponse<AdminProduct>>();
  return response.data!;
}

/** 대표 이미지 등록·교체 (5MB 이하 이미지) */
export async function uploadProductThumbnail(
  productId: number,
  file: File,
): Promise<string | null> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient
    .post(`api/v1/admin/products/${productId}/thumbnail`, { body: formData })
    .json<ApiResponse<{ thumbnail_url: string }>>();
  return response.data?.thumbnail_url ?? null;
}

export async function deleteProductThumbnail(productId: number): Promise<void> {
  await apiClient.delete(`api/v1/admin/products/${productId}/thumbnail`).json();
}
