"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Crown, Pencil, ShieldCheck, Trash2 } from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchBar } from "@/components/list/search-bar";
import { handleApiError } from "@core/utils/api-client";
import {
  createAdminAccount,
  deleteAdminAccount,
  delegatePresidency,
  getAdminAccounts,
  updateAdminAccount,
  type AdminAccount,
} from "./api";

interface AdminAccountsViewProps {
  /** 로그인한 운영진의 소속 (회장 / 부회장 / 운영진 ...) */
  myAffiliation: string;
  myUserId: number;
}

const PAGE_SIZE = 20;
const PRESIDENT_TEAM = ["회장", "부회장"];

interface EditForm {
  name: string;
  password: string;
  affiliation: string;
}

const EMPTY_CREATE_FORM = { userId: "", password: "", affiliation: "" };

export function AdminAccountsView({
  myAffiliation,
  myUserId,
}: AdminAccountsViewProps) {
  const isPresident = myAffiliation === "회장";

  const [accounts, setAccounts] = useState<AdminAccount[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);

  const [editTarget, setEditTarget] = useState<AdminAccount | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    password: "",
    affiliation: "",
  });

  const [delegateTarget, setDelegateTarget] = useState<AdminAccount | null>(
    null,
  );
  const [delegateRole, setDelegateRole] = useState<"회장" | "부회장">("부회장");

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminAccounts({
        page,
        size: PAGE_SIZE,
        search: appliedSearch || undefined,
      });
      setAccounts(data.content);
      setTotalElements(data.total_elements);
      setTotalPages(data.total_pages ?? 1);
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsLoading(false);
    }
  }, [page, appliedSearch]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  const handleCreate = async () => {
    if (isSubmitting) return;
    const userId = Number(createForm.userId);
    if (!createForm.userId || Number.isNaN(userId)) {
      toast.error("학번을 숫자로 입력해주세요.");
      return;
    }
    if (!createForm.password || !createForm.affiliation.trim()) {
      toast.error("비밀번호와 소속(팀명)을 입력해주세요.");
      return;
    }
    if (PRESIDENT_TEAM.includes(createForm.affiliation.trim())) {
      toast.error("회장/부회장은 위임 기능으로만 지정할 수 있습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await createAdminAccount({
        user_id: userId,
        password: createForm.password,
        affiliation: createForm.affiliation.trim(),
      });
      toast.success("운영진 계정이 생성되었습니다.");
      setCreateOpen(false);
      setCreateForm(EMPTY_CREATE_FORM);
      await fetchAccounts();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEdit = (account: AdminAccount) => {
    setEditTarget(account);
    setEditForm({
      name: account.name,
      password: "",
      affiliation: account.affiliation,
    });
  };

  const handleUpdate = async () => {
    if (!editTarget || isSubmitting) return;

    const body: { name?: string; password?: string; affiliation?: string } = {};
    if (editForm.name.trim() && editForm.name.trim() !== editTarget.name) {
      body.name = editForm.name.trim();
    }
    if (editForm.password) {
      body.password = editForm.password;
    }
    if (
      editForm.affiliation.trim() &&
      editForm.affiliation.trim() !== editTarget.affiliation
    ) {
      body.affiliation = editForm.affiliation.trim();
    }
    if (Object.keys(body).length === 0) {
      toast.error("변경된 내용이 없습니다.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateAdminAccount(editTarget.user_id, body);
      toast.success("운영진 정보가 수정되었습니다.");
      setEditTarget(null);
      await fetchAccounts();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (account: AdminAccount) => {
    if (isSubmitting) return;
    if (
      !confirm(
        `${account.name}(${account.user_id}) 운영진 계정을 삭제할까요?\n삭제 후에는 admin 페이지에 로그인할 수 없습니다.`,
      )
    ) {
      return;
    }
    setIsSubmitting(true);
    try {
      await deleteAdminAccount(account.user_id);
      toast.success("운영진 계정이 삭제되었습니다.");
      await fetchAccounts();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelegate = async () => {
    if (!delegateTarget || isSubmitting) return;
    const label =
      delegateRole === "회장"
        ? `${delegateTarget.name}님에게 회장을 위임합니다.\n위임 후 본인은 일반 운영진이 됩니다.`
        : `${delegateTarget.name}님을 부회장으로 임명합니다.\n기존 부회장은 일반 운영진이 됩니다.`;
    if (!confirm(label)) return;

    setIsSubmitting(true);
    try {
      await delegatePresidency(delegateTarget.user_id, delegateRole);
      toast.success(
        delegateRole === "회장"
          ? "회장이 위임되었습니다."
          : "부회장이 임명되었습니다.",
      );
      setDelegateTarget(null);
      await fetchAccounts();
      if (delegateRole === "회장") {
        // 본인 소속이 바뀌었으므로 세션 갱신을 위해 새로고침
        window.location.reload();
      }
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const affiliationBadge = (affiliation: string) => {
    if (affiliation === "회장") {
      return (
        <Badge className="bg-amber-500 text-white hover:bg-amber-500">
          <Crown className="mr-1 h-3 w-3" />
          회장
        </Badge>
      );
    }
    if (affiliation === "부회장") {
      return (
        <Badge className="bg-blue-600 text-white hover:bg-blue-600">
          <ShieldCheck className="mr-1 h-3 w-3" />
          부회장
        </Badge>
      );
    }
    return <Badge variant="secondary">{affiliation}</Badge>;
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">운영진 계정 관리</h1>
          <p className="text-muted-foreground text-sm">
            admin 페이지에 로그인할 수 있는 운영진(ADMIN) 계정을 관리합니다.
            회장 위임과 부회장 임명은 회장만 할 수 있습니다.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>운영진 계정 생성</Button>
      </div>

      <div className="flex items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={() => {
            setPage(0);
            setAppliedSearch(search.trim());
          }}
          placeholder="이름 또는 소속으로 검색"
        />
        <span className="text-muted-foreground shrink-0 text-sm">
          총 {totalElements}명
        </span>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>이름</TableHead>
              <TableHead>학번</TableHead>
              <TableHead>학과</TableHead>
              <TableHead>연락처</TableHead>
              <TableHead>소속</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  불러오는 중...
                </TableCell>
              </TableRow>
            ) : accounts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  운영진 계정이 없습니다
                </TableCell>
              </TableRow>
            ) : (
              accounts.map((account) => {
                const isSelf = account.user_id === myUserId;
                const isPresidentTeamMember = PRESIDENT_TEAM.includes(
                  account.affiliation,
                );
                // 백엔드 규칙과 동일하게: 자기 자신 관리 불가,
                // 부회장은 회장만 관리 가능, 회장 계정은 관리 대상 아님
                const canManage =
                  !isSelf &&
                  account.affiliation !== "회장" &&
                  (isPresident || account.affiliation !== "부회장");

                return (
                  <TableRow key={account.user_id}>
                    <TableCell className="font-medium">
                      {account.name}
                      {isSelf && (
                        <span className="text-muted-foreground ml-1 text-xs">
                          (나)
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{account.user_id}</TableCell>
                    <TableCell>{account.department ?? "-"}</TableCell>
                    <TableCell>{account.phone_num ?? "-"}</TableCell>
                    <TableCell>
                      {affiliationBadge(account.affiliation)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isPresident && !isSelf && !isPresidentTeamMember && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setDelegateTarget(account);
                              setDelegateRole("부회장");
                            }}
                          >
                            <Crown className="mr-1 h-3.5 w-3.5" />
                            위임/임명
                          </Button>
                        )}
                        {canManage && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="수정"
                              onClick={() => openEdit(account)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="삭제"
                              onClick={() => handleDelete(account)}
                            >
                              <Trash2 className="text-destructive h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            disabled={page === 0}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
          >
            이전
          </Button>
          <span className="text-sm">
            {page + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            다음
          </Button>
        </div>
      )}

      {/* 생성 다이얼로그 */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>운영진 계정 생성</DialogTitle>
            <DialogDescription>
              가입된 부원의 학번으로 운영진 계정을 만듭니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-user-id">학번</Label>
              <Input
                id="create-user-id"
                placeholder="2024000000"
                value={createForm.userId}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, userId: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-password">초기 비밀번호</Label>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, password: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="create-affiliation">소속 (팀명)</Label>
              <Input
                id="create-affiliation"
                placeholder="기획팀"
                value={createForm.affiliation}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, affiliation: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              취소
            </Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? "생성 중..." : "생성"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수정 다이얼로그 */}
      <Dialog
        open={editTarget !== null}
        onOpenChange={(open) => !open && setEditTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>운영진 정보 수정</DialogTitle>
            <DialogDescription>
              {editTarget?.name}({editTarget?.user_id})의 정보를 수정합니다.
              비밀번호는 입력한 경우에만 변경됩니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name">이름</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-password">새 비밀번호 (선택)</Label>
              <Input
                id="edit-password"
                type="password"
                placeholder="변경 시에만 입력"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, password: e.target.value }))
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-affiliation">소속 (팀명)</Label>
              <Input
                id="edit-affiliation"
                value={editForm.affiliation}
                onChange={(e) =>
                  setEditForm((f) => ({ ...f, affiliation: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              취소
            </Button>
            <Button onClick={handleUpdate} disabled={isSubmitting}>
              {isSubmitting ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 위임/임명 다이얼로그 (회장 전용) */}
      <Dialog
        open={delegateTarget !== null}
        onOpenChange={(open) => !open && setDelegateTarget(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>회장 위임 / 부회장 임명</DialogTitle>
            <DialogDescription>
              {delegateTarget?.name}({delegateTarget?.user_id})님에게 부여할
              역할을 선택하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Button
              variant={delegateRole === "부회장" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setDelegateRole("부회장")}
            >
              <ShieldCheck className="mr-1 h-4 w-4" />
              부회장 임명
            </Button>
            <Button
              variant={delegateRole === "회장" ? "default" : "outline"}
              className="flex-1"
              onClick={() => setDelegateRole("회장")}
            >
              <Crown className="mr-1 h-4 w-4" />
              회장 위임
            </Button>
          </div>
          {delegateRole === "회장" && (
            <p className="text-destructive text-sm">
              회장을 위임하면 본인은 일반 운영진이 되며, 이 페이지의 위임/임명
              기능을 더 이상 사용할 수 없습니다.
            </p>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setDelegateTarget(null)}>
              취소
            </Button>
            <Button onClick={handleDelegate} disabled={isSubmitting}>
              {isSubmitting ? "처리 중..." : "확정"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
