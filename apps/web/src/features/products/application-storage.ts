import type { ProductApplication } from "./types";

/**
 * 목업 단계용 신청 저장소 (localStorage).
 * TODO(FOR-105): 백엔드 POST /api/v1/products/applications 연동 시 제거.
 */
const STORAGE_KEY = "product-applications-mock";

export function loadLocalApplications(): ProductApplication[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    return Array.isArray(parsed) ? (parsed as ProductApplication[]) : [];
  } catch {
    return [];
  }
}

export function saveLocalApplication(application: ProductApplication) {
  if (typeof window === "undefined") return;

  const applications = [application, ...loadLocalApplications()];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
}
