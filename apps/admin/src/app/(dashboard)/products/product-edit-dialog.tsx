"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { handleApiError } from "@core/utils/api-client";
import {
  deleteProductThumbnail,
  updateProduct,
  uploadProductThumbnail,
  type AdminProduct,
  type UpdateProductBody,
} from "@core/products/api";

const MAX_THUMBNAIL_BYTES = 5 * 1024 * 1024;

interface ProductEditDialogProps {
  product: AdminProduct | null;
  onClose: () => void;
  /** 저장 후 목록 갱신 */
  onSaved: () => Promise<void> | void;
}

interface FormState {
  name: string;
  oneLiner: string;
  description: string;
  sourceLabel: string;
  techStack: string;
  serviceUrl: string;
  githubUrl: string;
}

function toForm(product: AdminProduct): FormState {
  return {
    name: product.name,
    oneLiner: product.one_liner,
    description: product.description,
    sourceLabel: product.source_label ?? "",
    techStack: product.tech_stack.join(", "),
    serviceUrl: product.service_url ?? "",
    githubUrl: product.github_url ?? "",
  };
}

export function ProductEditDialog({
  product,
  onClose,
  onSaved,
}: ProductEditDialogProps) {
  const [form, setForm] = useState<FormState>({
    name: "",
    oneLiner: "",
    description: "",
    sourceLabel: "",
    techStack: "",
    serviceUrl: "",
    githubUrl: "",
  });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 다이얼로그가 열릴 때마다 대상 프로덕트 값으로 초기화
  useEffect(() => {
    if (!product) return;
    setForm(toForm(product));
    setThumbnailFile(null);
    setPreviewUrl(null);
  }, [product]);

  // 미리보기 objectURL 정리
  useEffect(() => {
    if (!thumbnailFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(thumbnailFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  const shownThumbnail = useMemo(
    () => previewUrl ?? product?.thumbnail_url ?? null,
    [previewUrl, product?.thumbnail_url],
  );

  const handleFileChange = (file: File | null) => {
    if (!file) {
      setThumbnailFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 등록할 수 있습니다.");
      return;
    }
    if (file.size > MAX_THUMBNAIL_BYTES) {
      toast.error("이미지 크기는 5MB 이하여야 합니다.");
      return;
    }
    setThumbnailFile(file);
  };

  const handleRemoveThumbnail = async () => {
    if (!product || isSubmitting) return;

    // 아직 저장 전인 선택은 되돌리기만 하면 된다
    if (thumbnailFile) {
      setThumbnailFile(null);
      return;
    }
    if (!product.thumbnail_url) return;

    setIsSubmitting(true);
    try {
      await deleteProductThumbnail(product.product_id);
      toast.success("대표 이미지를 삭제했습니다.");
      await onSaved();
      onClose();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSave = async () => {
    if (!product || isSubmitting) return;

    if (
      !form.name.trim() ||
      !form.oneLiner.trim() ||
      !form.description.trim()
    ) {
      toast.error("이름, 한 줄 소개, 상세 소개는 비울 수 없습니다.");
      return;
    }

    // 변경된 필드만 전송 (미전달 필드는 서버에서 유지)
    const original = toForm(product);
    const body: UpdateProductBody = {};
    if (form.name.trim() !== original.name) body.name = form.name.trim();
    if (form.oneLiner.trim() !== original.oneLiner) {
      body.one_liner = form.oneLiner.trim();
    }
    if (form.description.trim() !== original.description) {
      body.description = form.description.trim();
    }
    if (form.sourceLabel.trim() !== original.sourceLabel) {
      body.source_label = form.sourceLabel.trim();
    }
    if (form.techStack.trim() !== original.techStack) {
      body.tech_stack = form.techStack
        .split(",")
        .map((tech) => tech.trim())
        .filter(Boolean);
    }
    if (form.serviceUrl.trim() !== original.serviceUrl) {
      body.service_url = form.serviceUrl.trim();
    }
    if (form.githubUrl.trim() !== original.githubUrl) {
      body.github_url = form.githubUrl.trim();
    }

    const hasInfoChange = Object.keys(body).length > 0;
    if (!hasInfoChange && !thumbnailFile) {
      toast.error("변경된 내용이 없습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (hasInfoChange) {
        await updateProduct(product.product_id, body);
      }
      if (thumbnailFile) {
        await uploadProductThumbnail(product.product_id, thumbnailFile);
      }
      toast.success("프로덕트 정보가 수정되었습니다.");
      await onSaved();
      onClose();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={product !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-[560px]">
        {product && (
          <>
            <DialogHeader>
              <DialogTitle>프로덕트 수정</DialogTitle>
              <DialogDescription>
                {product.slug}.forif.org · 수정 내용은 홈페이지에 바로
                반영됩니다.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              {/* 대표 이미지 */}
              <div className="flex flex-col gap-2">
                <Label>대표 이미지</Label>
                <div className="flex items-start gap-3">
                  <div className="bg-muted flex h-[90px] w-40 shrink-0 items-center justify-center overflow-hidden rounded-md border">
                    {shownThumbnail ? (
                      // next/image는 admin의 remotePatterns 제약이 있어 img를 쓴다
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={shownThumbnail}
                        alt={`${product.name} 대표 이미지`}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-muted-foreground text-xs">
                        이미지 없음
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="w-fit">
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleFileChange(e.target.files?.[0] ?? null)
                        }
                      />
                      <span className="border-input hover:bg-accent inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-md border px-3 text-sm font-medium">
                        <ImagePlus className="h-4 w-4" />
                        이미지 선택
                      </span>
                    </label>
                    {(thumbnailFile || product.thumbnail_url) && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-destructive w-fit"
                        onClick={handleRemoveThumbnail}
                        disabled={isSubmitting}
                      >
                        <Trash2 className="mr-1 h-4 w-4" />
                        {thumbnailFile ? "선택 취소" : "이미지 삭제"}
                      </Button>
                    )}
                    <p className="text-muted-foreground text-xs">
                      5MB 이하 이미지 · 가로형 권장
                      {thumbnailFile && (
                        <span className="ml-1 font-medium text-amber-600">
                          (저장해야 반영됩니다)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="product-name">이름</Label>
                <Input
                  id="product-name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="product-one-liner">한 줄 소개</Label>
                <Input
                  id="product-one-liner"
                  value={form.oneLiner}
                  onChange={(e) =>
                    setForm({ ...form, oneLiner: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="product-description">상세 소개</Label>
                <Textarea
                  id="product-description"
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="product-source-label">출처 라벨</Label>
                <Input
                  id="product-source-label"
                  value={form.sourceLabel}
                  placeholder="예: 2026-1 해커톤 대상"
                  onChange={(e) =>
                    setForm({ ...form, sourceLabel: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="product-tech-stack">기술 스택</Label>
                <Input
                  id="product-tech-stack"
                  value={form.techStack}
                  placeholder="Next.js, Spring Boot, MySQL"
                  onChange={(e) =>
                    setForm({ ...form, techStack: e.target.value })
                  }
                />
                <p className="text-muted-foreground text-xs">
                  쉼표로 구분해 입력하세요.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="product-service-url">서비스 URL</Label>
                <Input
                  id="product-service-url"
                  value={form.serviceUrl}
                  placeholder="https://..."
                  onChange={(e) =>
                    setForm({ ...form, serviceUrl: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="product-github-url">GitHub</Label>
                <Input
                  id="product-github-url"
                  value={form.githubUrl}
                  placeholder="https://github.com/..."
                  onChange={(e) =>
                    setForm({ ...form, githubUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                취소
              </Button>
              <Button onClick={handleSave} disabled={isSubmitting}>
                {isSubmitting ? "저장 중..." : "저장"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
