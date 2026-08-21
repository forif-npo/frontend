/**
 * 서비스 API — 공통 모듈(@core/products/api) 재노출.
 * 페이지/컴포넌트는 이 파일을 통해 사용한다.
 */
export {
  getProducts,
  getProduct,
  applyProduct,
  getMyProductApplications,
  updateProductApplication,
  deleteProductApplication,
  type ProductSummary,
  type ProductDetail,
  type ProductMember,
  type ProductStatus,
  type ProductSourceType,
  type ProductApplication,
  type ProductApplicationStatus,
  type CreateProductApplicationBody,
  type UpdateProductApplicationBody,
} from "@core/products/api";
