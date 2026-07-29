"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Github, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { handleApiError } from "@core/utils/api-client";
import {
  approveProduct,
  changeProductStatus,
  deleteProduct,
  getAdminProducts,
  rejectProduct,
  type AdminProduct,
  type ProductStatus,
} from "@core/products/api";
import { ProductEditDialog } from "./product-edit-dialog";

type StatusFilter = "ALL" | "PENDING" | "PUBLISHED" | "REJECTED";

/** 링크 주입 방지: http(s) URL만 렌더링한다 */
function safeExternalUrl(url: string | null): string | null {
  return url && /^https?:\/\//i.test(url) ? url : null;
}

const STATUS_LABELS: Record<string, string> = {
  PENDING: "검토 대기",
  REJECTED: "반려",
  LIVE: "운영 중",
  DEV: "개발 중",
  PAUSED: "운영 중단",
  RETIRED: "서비스 종료",
};

const SOURCE_LABELS: Record<string, string> = {
  STUDY: "스터디",
  HACKATHON: "해커톤",
  SIDE: "자율 프로젝트",
};

const PUBLISHED_STATUSES: ProductStatus[] = [
  "LIVE",
  "DEV",
  "PAUSED",
  "RETIRED",
];

function statusBadge(status: string) {
  switch (status) {
    case "PENDING":
      return <Badge className="bg-amber-500 text-white">검토 대기</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">반려</Badge>;
    case "LIVE":
      return <Badge className="bg-emerald-600 text-white">운영 중</Badge>;
    case "DEV":
      return <Badge className="bg-blue-600 text-white">개발 중</Badge>;
    case "PAUSED":
      return <Badge variant="secondary">운영 중단</Badge>;
    case "RETIRED":
      return <Badge variant="outline">서비스 종료</Badge>;
    default:
      return <Badge variant="secondary">{status}</Badge>;
  }
}

export function ProductsAdminView() {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<StatusFilter>("ALL");

  const [detailTarget, setDetailTarget] = useState<AdminProduct | null>(null);
  const [approveTarget, setApproveTarget] = useState<AdminProduct | null>(null);
  const [rejectTarget, setRejectTarget] = useState<AdminProduct | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminProduct | null>(null);
  const [editTarget, setEditTarget] = useState<AdminProduct | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      setProducts(await getAdminProducts());
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = useMemo(() => {
    switch (filter) {
      case "PENDING":
        return products.filter((p) => p.status === "PENDING");
      case "REJECTED":
        return products.filter((p) => p.status === "REJECTED");
      case "PUBLISHED":
        return products.filter((p) =>
          PUBLISHED_STATUSES.includes(p.status as ProductStatus),
        );
      default:
        return products;
    }
  }, [products, filter]);

  const pendingCount = products.filter((p) => p.status === "PENDING").length;

  const runAction = async (action: () => Promise<void>, message: string) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await action();
      toast.success(message);
      await fetchProducts();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = () => {
    if (!approveTarget) return;
    runAction(async () => {
      await approveProduct(approveTarget.product_id);
      setApproveTarget(null);
    }, "승인되었습니다. 서비스 목록에 게시됩니다.");
  };

  const handleReject = () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      toast.error("반려 사유를 입력해주세요.");
      return;
    }
    runAction(async () => {
      await rejectProduct(rejectTarget.product_id, rejectReason.trim());
      setRejectTarget(null);
      setRejectReason("");
    }, "반려 처리되었습니다. 신청자에게 사유가 표시됩니다.");
  };

  const handleStatusChange = (product: AdminProduct, status: ProductStatus) => {
    runAction(
      () => changeProductStatus(product.product_id, status),
      "상태가 변경되었습니다.",
    );
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    runAction(async () => {
      await deleteProduct(deleteTarget.product_id);
      setDeleteTarget(null);
    }, "삭제되었습니다.");
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div>
        <h1 className="text-2xl font-bold">서비스 관리</h1>
        <p className="text-muted-foreground text-sm">
          부원들의 서비스 등록 신청을 검토하고 게시 상태를 관리합니다.
          {pendingCount > 0 && (
            <span className="ml-2 font-semibold text-amber-600">
              검토 대기 {pendingCount}건
            </span>
          )}
        </p>
      </div>

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as StatusFilter)}
      >
        <TabsList>
          <TabsTrigger value="ALL">전체</TabsTrigger>
          <TabsTrigger value="PENDING">검토 대기</TabsTrigger>
          <TabsTrigger value="PUBLISHED">게시 중</TabsTrigger>
          <TabsTrigger value="REJECTED">반려</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>상태</TableHead>
              <TableHead>서비스</TableHead>
              <TableHead>서브도메인</TableHead>
              <TableHead>출처</TableHead>
              <TableHead>신청자</TableHead>
              <TableHead>신청일</TableHead>
              <TableHead className="text-right">액션</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground h-24 text-center"
                >
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-muted-foreground h-24 text-center"
                >
                  해당하는 서비스가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>{statusBadge(product.status)}</TableCell>
                  <TableCell>
                    <button
                      className="text-left font-medium hover:underline"
                      onClick={() => setDetailTarget(product)}
                    >
                      {product.name}
                    </button>
                    <p className="text-muted-foreground line-clamp-1 max-w-[260px] text-xs">
                      {product.one_liner}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {product.slug}.forif.org
                  </TableCell>
                  <TableCell className="text-sm">
                    {SOURCE_LABELS[product.source_type] ?? product.source_type}
                  </TableCell>
                  <TableCell className="text-sm">
                    {product.applicant_name}
                    <span className="text-muted-foreground ml-1 text-xs">
                      {product.applicant_id}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {product.applied_at}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {product.status === "PENDING" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => setApproveTarget(product)}
                            disabled={isSubmitting}
                          >
                            승인
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setRejectTarget(product);
                              setRejectReason("");
                            }}
                            disabled={isSubmitting}
                          >
                            반려
                          </Button>
                        </>
                      )}
                      {PUBLISHED_STATUSES.includes(
                        product.status as ProductStatus,
                      ) && (
                        <Select
                          value={product.status}
                          onValueChange={(value) =>
                            handleStatusChange(product, value as ProductStatus)
                          }
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {PUBLISHED_STATUSES.map((status) => (
                              <SelectItem key={status} value={status}>
                                {STATUS_LABELS[status]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditTarget(product)}
                        disabled={isSubmitting}
                      >
                        <Pencil className="mr-1 h-3.5 w-3.5" />
                        수정
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteTarget(product)}
                        disabled={isSubmitting}
                      >
                        삭제
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 상세 다이얼로그 */}
      <Dialog
        open={detailTarget !== null}
        onOpenChange={(open) => !open && setDetailTarget(null)}
      >
        <DialogContent className="max-h-[80vh] overflow-y-auto sm:max-w-[560px]">
          {detailTarget && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {detailTarget.name}
                  {statusBadge(detailTarget.status)}
                </DialogTitle>
                <DialogDescription>
                  {detailTarget.slug}.forif.org · {detailTarget.applicant_name}(
                  {detailTarget.applicant_id}) · {detailTarget.applied_at} 신청
                </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-4 text-sm">
                {detailTarget.thumbnail_url && (
                  // next/image는 admin의 remotePatterns 제약이 있어 img를 쓴다
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={detailTarget.thumbnail_url}
                    alt={`${detailTarget.name} 대표 이미지`}
                    className="h-[160px] w-full rounded-md border object-cover"
                  />
                )}
                <div>
                  <p className="mb-1 font-semibold">한 줄 소개</p>
                  <p>{detailTarget.one_liner}</p>
                </div>
                <div>
                  <p className="mb-1 font-semibold">상세 소개</p>
                  <p className="whitespace-pre-line">
                    {detailTarget.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div>
                    <p className="mb-1 font-semibold">출처</p>
                    <p>
                      {SOURCE_LABELS[detailTarget.source_type]}
                      {detailTarget.source_label
                        ? ` · ${detailTarget.source_label}`
                        : ""}
                    </p>
                  </div>
                  <div>
                    <p className="mb-1 font-semibold">기술 스택</p>
                    <p>
                      {detailTarget.tech_stack.length > 0
                        ? detailTarget.tech_stack.join(", ")
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-3">
                  {safeExternalUrl(detailTarget.service_url) && (
                    <a
                      href={safeExternalUrl(detailTarget.service_url)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1 hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      배포된 서비스
                    </a>
                  )}
                  {safeExternalUrl(detailTarget.github_url) && (
                    <a
                      href={safeExternalUrl(detailTarget.github_url)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary inline-flex items-center gap-1 hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                </div>
                {detailTarget.status === "REJECTED" &&
                  detailTarget.reject_reason && (
                    <div className="rounded-md bg-red-50 p-3 text-red-800">
                      <p className="mb-1 font-semibold">반려 사유</p>
                      <p>{detailTarget.reject_reason}</p>
                    </div>
                  )}
              </div>

              {detailTarget.status === "PENDING" && (
                <DialogFooter>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      setRejectTarget(detailTarget);
                      setRejectReason("");
                      setDetailTarget(null);
                    }}
                    disabled={isSubmitting}
                  >
                    반려
                  </Button>
                  <Button
                    onClick={() => {
                      setApproveTarget(detailTarget);
                      setDetailTarget(null);
                    }}
                    disabled={isSubmitting}
                  >
                    승인
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* 반려 다이얼로그 */}
      <Dialog
        open={rejectTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRejectTarget(null);
            setRejectReason("");
          }
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>신청 반려</DialogTitle>
            <DialogDescription>
              {rejectTarget?.name} ({rejectTarget?.slug}.forif.org) 신청을
              반려합니다. 사유는 신청자에게 그대로 표시됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2">
            <Label htmlFor="reject-reason">반려 사유</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="예: 배포된 서비스 URL이 없어 검토가 어렵습니다. 배포 후 다시 신청해주세요."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRejectTarget(null);
                setRejectReason("");
              }}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={isSubmitting}
            >
              반려하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 승인 확인 다이얼로그 */}
      <Dialog
        open={approveTarget !== null}
        onOpenChange={(open) => !open && setApproveTarget(null)}
      >
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>신청 승인</DialogTitle>
            <DialogDescription>
              &quot;{approveTarget?.name}&quot; 신청을 승인할까요?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-900">
            승인하면 <span className="font-semibold">운영 중</span> 상태로
            전환되어 홈페이지 서비스 목록에 바로 게시되고,{" "}
            <span className="font-semibold">
              {approveTarget?.slug}.forif.org
            </span>{" "}
            서브도메인 연결 대상이 됩니다.
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveTarget(null)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button onClick={handleApprove} disabled={isSubmitting}>
              {isSubmitting ? "처리 중..." : "승인하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수정 다이얼로그 */}
      <ProductEditDialog
        product={editTarget}
        onClose={() => setEditTarget(null)}
        onSaved={fetchProducts}
      />

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>서비스 삭제</DialogTitle>
            <DialogDescription>
              &quot;{deleteTarget?.name}&quot; ({deleteTarget?.slug}.forif.org)
              서비스를 삭제할까요?
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-900">
            삭제하면 서비스 목록과 신청 이력에서 모두 사라지며 되돌릴 수
            없습니다.
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? "처리 중..." : "삭제하기"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
