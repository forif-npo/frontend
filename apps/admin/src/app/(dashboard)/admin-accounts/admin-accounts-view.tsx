"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner";
import { Crown, Pencil, ShieldCheck, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPhoneNumber } from "@core/utils/phone-number";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DataTable } from "@/components/list/data-table";
import { DropdownMenuItem, DropdownMenuSeparator } from "@/components/list/dropdown-menu";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
import { PageHeader } from "@/components/page-header";
import { handleApiError } from "@core/utils/api-client";
import { passwordSchema } from "@core/schemas";
import { createAdminAccount, deleteAdminAccount, delegatePresidency, getAdminAccounts, getCurrentTeamNames, updateAdminAccount, type AdminAccount } from "./api";

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

interface DelegateConfirm {
  account: AdminAccount;
  role: "회장" | "부회장";
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
  const [teamNames, setTeamNames] = useState<string[]>([]);

  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(EMPTY_CREATE_FORM);

  const [editTarget, setEditTarget] = useState<AdminAccount | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    name: "",
    password: "",
    affiliation: "",
  });
  const [delegateConfirm, setDelegateConfirm] =
    useState<DelegateConfirm | null>(null);

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

  useEffect(() => {
    getCurrentTeamNames()
      .then(setTeamNames)
      .catch(async (error) => toast.error(await handleApiError(error)));
  }, []);

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
    const passwordValidation = passwordSchema.safeParse(createForm.password);
    if (!passwordValidation.success) {
      toast.error(
        passwordValidation.error.issues[0]?.message ??
          "비밀번호 형식이 올바르지 않습니다.",
      );
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
      const passwordValidation = passwordSchema.safeParse(editForm.password);
      if (!passwordValidation.success) {
        toast.error(
          passwordValidation.error.issues[0]?.message ??
            "비밀번호 형식이 올바르지 않습니다.",
        );
        return;
      }
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
        `${account.name}(${account.user_id}) 운영진 계정을 삭제할까요?\n삭제 후에는 admin 페이지에 로그인할 수 없습니다. 부원 계정과 운영진 이력은 유지됩니다.`,
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
    if (!delegateConfirm || isSubmitting) return;
    const { account, role } = delegateConfirm;

    setIsSubmitting(true);
    try {
      await delegatePresidency(account.user_id, role);
      toast.success(
        role === "회장"
          ? "회장이 위임되었습니다."
          : "부회장이 임명되었습니다.",
      );
      setDelegateConfirm(null);
      await fetchAccounts();
      if (role === "회장") {
        // 본인 소속이 바뀌었으므로 세션 갱신을 위해 새로고침
        window.location.reload();
      }
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = useMemo<ColumnDef<AdminAccount>[]>(
    () => [
      { accessorKey: "name", header: "이름" },
      { accessorKey: "user_id", header: "학번" },
      {
        accessorKey: "department",
        header: "학과",
        cell: ({ row }) => row.original.department ?? "-",
      },
      {
        accessorKey: "phone_num",
        header: "연락처",
        cell: ({ row }) => formatPhoneNumber(row.original.phone_num) || "-",
      },
      {
        accessorKey: "affiliation",
        header: "소속",
      },
    ],
    [],
  );

  const renderAccountActions = (account: AdminAccount) => {
    const isSelf = account.user_id === myUserId;
    const isPresidentTeamMember = PRESIDENT_TEAM.includes(account.affiliation);
    const canDelegate = isPresident && !isSelf && !isPresidentTeamMember;
    const canManage =
      !isSelf &&
      account.affiliation !== "회장" &&
      (isPresident || account.affiliation !== "부회장");

    if (!canDelegate && !canManage) return null;

    return (
      <>
        {canDelegate && (
          <>
            <DropdownMenuItem
              onSelect={() => setDelegateConfirm({ account, role: "회장" })}
            >
              <Crown className="mr-2 h-4 w-4" />
              회장 위임
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() =>
                setDelegateConfirm({ account, role: "부회장" })
              }
            >
              <ShieldCheck className="mr-2 h-4 w-4" />
              부회장 임명
            </DropdownMenuItem>
          </>
        )}
        {canDelegate && canManage && <DropdownMenuSeparator />}
        {canManage && (
          <>
            <DropdownMenuItem onSelect={() => openEdit(account)}>
              <Pencil className="mr-2 h-4 w-4" />
              수정
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => handleDelete(account)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              삭제
            </DropdownMenuItem>
          </>
        )}
      </>
    );
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 md:p-8">
      <PageHeader
        title="운영진 계정 관리"
        description="ADMIN 페이지에 로그인할 수 있는 운영진 계정을 관리합니다."
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          onSearch={() => {
            setPage(0);
            setAppliedSearch(search.trim());
          }}
          placeholder="이름 또는 소속으로 검색"
        />
        <div className="ml-auto flex shrink-0 items-center gap-3">
          <Button onClick={() => setCreateOpen(true)}>운영진 계정 생성</Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={isLoading ? [] : accounts}
        getRowId={(account) => String(account.user_id)}
        renderRowActions={renderAccountActions}
        showPagination={false}
        emptyMessage={isLoading ? "불러오는 중..." : "운영진 계정이 없습니다"}
      />

      <OffsetPagination
        currentPage={page}
        totalPages={totalPages}
        totalElements={totalElements}
        pageSize={PAGE_SIZE}
        onPageChange={setPage}
      />

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
              <Label htmlFor="create-affiliation">소속</Label>
              <Select
                value={createForm.affiliation}
                onValueChange={(affiliation) =>
                  setCreateForm((f) => ({ ...f, affiliation }))
                }
              >
                <SelectTrigger id="create-affiliation">
                  <SelectValue placeholder="소속 팀 선택" />
                </SelectTrigger>
                <SelectContent>
                  {teamNames.map((team) => (
                    <SelectItem key={team} value={team}>
                      {team}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              <Label htmlFor="edit-affiliation">소속</Label>
              <Select
                value={editForm.affiliation}
                onValueChange={(affiliation) =>
                  setEditForm((f) => ({ ...f, affiliation }))
                }
              >
                <SelectTrigger id="edit-affiliation">
                  <SelectValue placeholder="소속 선택" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from(new Set([editForm.affiliation, ...teamNames]))
                    .filter(Boolean)
                    .map((team) => (
                      <SelectItem key={team} value={team}>
                        {team}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
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

      <Dialog
        open={delegateConfirm !== null}
        onOpenChange={(open) => !open && setDelegateConfirm(null)}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>
              {delegateConfirm?.role === "회장" ? "회장 위임" : "부회장 임명"}
            </DialogTitle>
            <DialogDescription>
              {delegateConfirm
                ? delegateConfirm.role === "회장"
                  ? `${delegateConfirm.account.name} 님에게 회장을 위임하시겠습니까? 위임 후 본인은 일반 운영진이 됩니다.`
                  : `${delegateConfirm.account.name} 님을 부회장으로 임명하시겠습니까? 기존 부회장은 일반 운영진이 됩니다.`
                : null}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDelegateConfirm(null)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button onClick={handleDelegate} disabled={isSubmitting}>
              {isSubmitting ? "처리 중..." : "확인"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
