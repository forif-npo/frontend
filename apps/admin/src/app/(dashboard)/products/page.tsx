import type { Metadata } from "next";
import { ProductsAdminView } from "./products-admin-view";

export const metadata: Metadata = {
  title: "서비스 관리 | FORIF Admin",
};

export default function ProductsAdminPage() {
  return <ProductsAdminView />;
}
