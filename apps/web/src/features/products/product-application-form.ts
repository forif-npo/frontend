import type {
  CreateProductApplicationBody,
  ProductApplication,
  ProductSourceType,
} from "./api";

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{1,18})[a-z0-9]$/;
const RESERVED_SLUGS = new Set([
  "www",
  "dev",
  "api",
  "admin",
  "mail",
  "apply",
  "applications",
  "products",
  "forif",
]);

export interface ProductApplicationFormState {
  name: string;
  slug: string;
  oneLiner: string;
  description: string;
  sourceType: ProductSourceType;
  serviceUrl: string;
  githubUrl: string;
  tags: string;
  techStack: string;
}

export type ProductApplicationFieldErrors = Partial<
  Record<keyof ProductApplicationFormState | "thumbnail", string>
>;

export const EMPTY_PRODUCT_APPLICATION_FORM: ProductApplicationFormState = {
  name: "",
  slug: "",
  oneLiner: "",
  description: "",
  sourceType: "STUDY",
  serviceUrl: "",
  githubUrl: "",
  tags: "",
  techStack: "",
};

export function toProductApplicationFormState(
  application: ProductApplication,
): ProductApplicationFormState {
  return {
    name: application.name,
    slug: application.slug,
    oneLiner: application.one_liner,
    description: application.description,
    sourceType: application.source_type,
    serviceUrl: application.service_url ?? "",
    githubUrl: application.github_url ?? "",
    tags: application.tags.join(", "),
    techStack: application.tech_stack.join(", "),
  };
}

export function validateProductApplicationForm({
  form,
  thumbnail,
  existingThumbnailUrl,
  isExistingThumbnailRemoved,
}: {
  form: ProductApplicationFormState;
  thumbnail: File | null;
  existingThumbnailUrl?: string | null;
  isExistingThumbnailRemoved: boolean;
}): ProductApplicationFieldErrors {
  const errors: ProductApplicationFieldErrors = {};

  if (!form.name.trim()) {
    errors.name = "서비스 이름을 입력해주세요.";
  }

  const slug = form.slug.trim().toLowerCase();
  if (!slug) {
    errors.slug = "희망 서브도메인을 입력해주세요.";
  } else if (!SLUG_PATTERN.test(slug)) {
    errors.slug =
      "영소문자·숫자·하이픈 3~20자로, 하이픈으로 시작하거나 끝날 수 없습니다.";
  } else if (RESERVED_SLUGS.has(slug)) {
    errors.slug = `"${slug}"는 사용할 수 없는 예약된 주소입니다.`;
  }

  if (!form.oneLiner.trim()) {
    errors.oneLiner = "한 줄 소개를 입력해주세요.";
  }
  if (!form.description.trim()) {
    errors.description = "상세 소개를 입력해주세요.";
  }
  if (!thumbnail && (!existingThumbnailUrl || isExistingThumbnailRemoved)) {
    errors.thumbnail = "썸네일을 등록해주세요.";
  }

  if (form.serviceUrl.trim() && !/^https?:\/\//i.test(form.serviceUrl.trim())) {
    errors.serviceUrl =
      "http:// 또는 https:// 로 시작하는 주소를 입력해주세요.";
  }
  if (form.githubUrl.trim() && !/^https?:\/\//i.test(form.githubUrl.trim())) {
    errors.githubUrl = "http:// 또는 https:// 로 시작하는 주소를 입력해주세요.";
  }

  return errors;
}

export function toProductApplicationRequest(
  form: ProductApplicationFormState,
): CreateProductApplicationBody {
  return {
    name: form.name.trim(),
    slug: form.slug.trim().toLowerCase(),
    one_liner: form.oneLiner.trim(),
    description: form.description.trim(),
    source_type: form.sourceType,
    service_url: form.serviceUrl.trim() || null,
    github_url: form.githubUrl.trim() || null,
    tags: form.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    tech_stack: form.techStack
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean),
  };
}
