import type { ProductDetail, ProductSummary } from "./types";
import { getMockProductBySlug, getMockProducts } from "./mock";

/**
 * 프로덕트 API.
 *
 * TODO(FOR-105): 백엔드 /api/v1/products 구현 후 apiClient 호출로 교체.
 * 현재는 목업 데이터를 반환한다 (호출 형태는 실제 API와 동일하게 유지).
 */

export async function getProducts(): Promise<ProductSummary[]> {
  return getMockProducts();
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  return getMockProductBySlug(slug);
}
