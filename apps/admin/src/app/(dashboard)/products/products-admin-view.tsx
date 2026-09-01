"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
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
import { DataTable } from "@/components/list/data-table";
import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/page-header";
import {
  PRODUCT_APPLICATION_STATUS_LABELS,
  PRODUCT_OPERATION_STATUS_LABELS,
  PRODUCT_SOURCE_LABELS,
} from "@core/products";
import { handleApiError } from "@core/utils/api-client";
import {
  approveProduct,
  changeProductOperationStatus,
  getAdminProducts,
  rejectProduct,
  type AdminProduct,
  type ProductOperationStatus,
} from "./api";
import { ProductEditDialog } from "./product-edit-dialog";

type StatusFilter = "ALL" | "PENDING" | "ACCEPTED" | "REJECTED";

/** 링크 주입 방지: http(s) URL만 렌더링한다 */
function safeExternalUrl(url: string | null): string | null {
  return url && /^https?:\/\//i.test(url) ? url : null;
}

function statusBadges(product: AdminProduct) {
  const { status, operation_status: operationStatus } = product;

  switch (status) {
    case "PENDING":
      return (
        <Badge className="bg-warning-50 text-text-inverse-static">
          {PRODUCT_APPLICATION_STATUS_LABELS[status]}
        </Badge>
      );
    case "REJECTED":
      return (
        <Badge variant="destructive">
          {PRODUCT_APPLICATION_STATUS_LABELS[status]}
        </Badge>
      );
    case "ACCEPTED":
      return (
        <div className="flex flex-wrap justify-center gap-1">
          <Badge className="bg-success-60 text-text-inverse-static">
            {PRODUCT_APPLICATION_STATUS_LABELS[status]}
          </Badge>
          {operationStatus && (
            <Badge
              variant={operationStatus === "LIVE" ? "default" : "secondary"}
            >
              {PRODUCT_OPERATION_STATUS_LABELS[operationStatus]}
            </Badge>
          )}
        </div>
      );
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
      case "ACCEPTED":
        return products.filter((p) => p.status === "ACCEPTED");
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

  const handleOperationStatusChange = (
    product: AdminProduct,
    operationStatus: ProductOperationStatus,
  ) => {
    runAction(
      () => changeProductOperationStatus(product.product_id, operationStatus),
      "운영 상태가 변경되었습니다.",
    );
  };

  const columns = useMemo<ColumnDef<AdminProduct>[]>(
    () => [
      {
        accessorKey: "status",
        header: "신청·운영 상태",
        cell: ({ row }) => statusBadges(row.original),
      },
      {
        accessorKey: "name",
        header: "서비스",
        cell: ({ row }) => {
          const product = row.original;
          return (
            <div>
              <button
                className="text-left font-medium hover:underline"
                onClick={() => setDetailTarget(product)}
              >
                {product.name}
              </button>
              <p className="text-muted-foreground line-clamp-1 max-w-[260px] text-xs">
                {product.one_liner}
              </p>
            </div>
          );
        },
      },
      {
        accessorKey: "slug",
        header: "서브도메인",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {row.original.slug}.forif.org
          </span>
        ),
      },
      {
        accessorKey: "source_type",
        header: "출처",
        cell: ({ row }) => (
          <span className="text-xs">
            {PRODUCT_SOURCE_LABELS[row.original.source_type] ??
              row.original.source_type}
          </span>
        ),
      },
      {
        accessorKey: "applicant_name",
        header: "신청자",
        cell: ({ row }) => (
          <span className="text-xs">
            {row.original.applicant_name}
            <span className="text-muted-foreground ml-1 text-xs">
              {row.original.applicant_id}
            </span>
          </span>
        ),
      },
      {
        accessorKey: "applied_at",
        header: "신청일",
        cell: ({ row }) => (
          <span className="text-muted-foreground text-xs">
            {row.original.applied_at}
          </span>
        ),
      },
    ],
    [],
  );

  const renderProductActions = (product: AdminProduct) => (
    <>
      {product.status === "PENDING" && (
        <>
          <DropdownMenuItem
            onClick={() => setApproveTarget(product)}
            disabled={isSubmitting}
          >
            승인
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setRejectTarget(product);
              setRejectReason("");
            }}
            disabled={isSubmitting}
            className="text-destructive focus:text-destructive"
          >
            반려
          </DropdownMenuItem>
        </>
      )}
      {product.status === "ACCEPTED" && product.operation_status && (
        <DropdownMenuItem
          onClick={() =>
            handleOperationStatusChange(
              product,
              product.operation_status === "LIVE" ? "PAUSED" : "LIVE",
            )
          }
          disabled={isSubmitting}
        >
          {product.operation_status === "LIVE" ? "일시 중지" : "운영 재개"}
        </DropdownMenuItem>
      )}
      <DropdownMenuItem
        onClick={() => setEditTarget(product)}
        disabled={isSubmitting}
      >
        <Pencil className="mr-2 h-4 w-4" />
        수정
      </DropdownMenuItem>
    </>
  );

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="서비스 관리"
        description={
          <>
            부원들의 서비스 등록 신청을 검토하고 승인된 서비스의 운영 상태를
            관리합니다.
            {pendingCount > 0 && (
              <span className="text-text-warning ml-2 font-semibold">
                검토 대기 {pendingCount}건
              </span>
            )}
          </>
        }
      />

      <Tabs
        value={filter}
        onValueChange={(value) => setFilter(value as StatusFilter)}
      >
        <TabsList>
          <TabsTrigger value="ALL">전체</TabsTrigger>
          <TabsTrigger value="PENDING">검토 대기</TabsTrigger>
          <TabsTrigger value="ACCEPTED">승인</TabsTrigger>
          <TabsTrigger value="REJECTED">반려</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTable
        columns={columns}
        data={isLoading ? [] : filtered}
        getRowId={(product) => String(product.product_id)}
        renderRowActions={renderProductActions}
        showPagination={false}
        emptyMessage={
          isLoading ? "불러오는 중..." : "해당하는 서비스가 없습니다."
        }
      />

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
                  {statusBadges(detailTarget)}
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
                      {PRODUCT_SOURCE_LABELS[detailTarget.source_type]}
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
                    <div className="bg-danger-5 text-text-danger rounded-md p-3">
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
          <div className="bg-success-5 text-text-success rounded-md p-3 text-sm">
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
    </div>
  );
}
