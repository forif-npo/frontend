import type { ApiResponse } from "../types/api";
import { apiClient } from "../utils/api-client";

/**
 * 프로덕트 쇼케이스 API (FOR-105)
 */

export type ProductStatus = "LIVE" | "DEV" | "PAUSED" | "RETIRED";
export type ProductSourceType = "STUDY" | "HACKATHON" | "SIDE";
export type ProductApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface ProductSummary {
  slug: string;
  name: string;
  one_liner: string;
  status: ProductStatus;
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
  tech_stack: string[];
  status: ProductApplicationStatus;
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
): Promise<ProductApplication> {
  const response = await apiClient
    .post("api/v1/products/applications", { json: body })
    .json<ApiResponse<ProductApplication>>();
  return response.data!;
}

export async function getMyProductApplications(): Promise<
  ProductApplication[]
> {
  const response = await apiClient
    .get("api/v1/products/applications/me")
    .json<ApiResponse<ProductApplication[]>>();
  return response.data ?? [];
}

// ── 운영진 ──────────────────────────────────────────────────────────

export interface AdminProduct {
  product_id: number;
  slug: string;
  name: string;
  one_liner: string;
  description: string;
  status: "PENDING" | "REJECTED" | ProductStatus;
  source_type: ProductSourceType;
  source_label: string | null;
  tags: string[];
  tech_stack: string[];
  service_url: string | null;
  github_url: string | null;
  act_year: number;
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

export async function changeProductStatus(
  productId: number,
  status: ProductStatus,
): Promise<void> {
  await apiClient
    .patch(`api/v1/admin/products/${productId}/status`, { json: { status } })
    .json();
}

export async function deleteProduct(productId: number): Promise<void> {
  await apiClient.delete(`api/v1/admin/products/${productId}`).json();
}
