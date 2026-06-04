"use client";

import { DropdownMenuItem } from "@/components/list/dropdown-menu";
import { DataTable } from "@/components/list/data-table";
import { OffsetPagination } from "@/components/list/offset-pagination";
import { SearchBar } from "@/components/list/search-bar";
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
import { Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { createPost, deletePost, updatePost } from "./api";
import { postColumns } from "./columns";
import type {
  AdminPost,
  PostFormState,
  PostKind,
  PostListLabels,
} from "./types";

const EMPTY_FORM: PostFormState = {
  title: "",
  tag: "",
  content: "",
};

interface PostManagementViewProps {
  kind: PostKind;
  labels: PostListLabels;
  initialData: AdminPost[];
  totalElements: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  initialSearch?: string;
}

function toFormState(post: AdminPost): PostFormState {
  return {
    title: post.title,
    tag: post.tag,
    content: post.content,
  };
}

export function PostManagementView({
  kind,
  labels,
  initialData,
  totalElements,
  currentPage,
  totalPages,
  pageSize,
  initialSearch = "",
}: PostManagementViewProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<AdminPost | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminPost | null>(null);
  const [form, setForm] = useState<PostFormState>({ ...EMPTY_FORM });
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const routePath = kind === "announcement" ? "/announcements" : "/faqs";
  const isAnnouncement = kind === "announcement";
  const displayTotalCount =
    totalElements && totalElements > 0 ? totalElements : initialData.length;

  const pushWithParams = (page: number, search = searchQuery) => {
    const params = new URLSearchParams();

    if (search.trim()) {
      params.set("search", search.trim());
    }

    params.set("page", String(page));
    router.push(`${routePath}?${params.toString()}`);
  };

  const resetFormState = () => {
    setEditingPost(null);
    setForm({ ...EMPTY_FORM });
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleOpenCreate = () => {
    resetFormState();
    setIsFormOpen(true);
  };

  const handleOpenEdit = (post: AdminPost) => {
    setEditingPost(post);
    setForm(toFormState(post));
    setImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsFormOpen(true);
  };

  const handleFormOpenChange = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      resetFormState();
    }
  };

  const handleSubmit = async () => {
    const payload = {
      title: form.title.trim(),
      tag: form.tag.trim(),
      content: form.content.trim(),
    };

    if (!payload.title || !payload.content) {
      toast.error("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      setSubmitting(true);

      if (editingPost) {
        await updatePost(kind, editingPost.postId, payload, images);
        toast.success("게시글이 수정되었습니다.");
      } else {
        await createPost(kind, payload, images);
        toast.success("게시글이 등록되었습니다.");
      }

      handleFormOpenChange(false);
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    try {
      setDeleting(true);
      await deletePost(kind, deleteTarget.postId);
      toast.success("게시글이 삭제되었습니다.");
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(await handleApiError(error));
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {labels.pageTitle}
          </h1>
          <p className="text-muted-foreground">{labels.pageDescription}</p>
        </div>

        <Button className="gap-2" onClick={handleOpenCreate}>
          <Plus className="h-4 w-4" />
          {labels.createButton}
        </Button>
      </div>

      <div className="space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={() => pushWithParams(0)}
          placeholder={labels.searchPlaceholder}
        />

        <DataTable
          columns={postColumns}
          data={initialData}
          showPagination={false}
          renderRowActions={(post) => (
            <>
              <DropdownMenuItem onClick={() => handleOpenEdit(post)}>
                수정
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteTarget(post)}
              >
                삭제
              </DropdownMenuItem>
            </>
          )}
        />

        <OffsetPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={displayTotalCount}
          pageSize={pageSize}
          onPageChange={(page) => pushWithParams(page)}
        />
      </div>

      <Dialog open={isFormOpen} onOpenChange={handleFormOpenChange}>
        <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? labels.editTitle : labels.createTitle}
            </DialogTitle>
            <DialogDescription>
              제목, 태그, 내용을 입력한 뒤 저장해주세요.
            </DialogDescription>
          </DialogHeader>

          <form
            className="space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              void handleSubmit();
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="post-title">제목</Label>
              <Input
                id="post-title"
                value={form.title}
                disabled={submitting}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-tag">태그</Label>
              <Input
                id="post-tag"
                value={form.tag}
                disabled={submitting}
                placeholder="예: 공지, 운영, 스터디"
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tag: event.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="post-content">내용</Label>
              <Textarea
                id="post-content"
                className="min-h-56"
                value={form.content}
                disabled={submitting}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, content: event.target.value }))
                }
              />
            </div>

            {isAnnouncement && (
              <div className="space-y-2">
                <Label htmlFor="post-images">이미지</Label>
                <Input
                  ref={fileInputRef}
                  id="post-images"
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={submitting}
                  onChange={(event) =>
                    setImages(Array.from(event.target.files ?? []))
                  }
                />
                {editingPost && editingPost.imageUrls.length > 0 && (
                  <p className="text-muted-foreground text-xs">
                    새 이미지를 선택하면 기존 이미지가 교체됩니다.
                  </p>
                )}
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={submitting}
                onClick={() => handleFormOpenChange(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                저장
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{labels.deleteTitle}</DialogTitle>
            <DialogDescription>{labels.deleteDescription}</DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={deleting}
              onClick={() => void handleConfirmDelete()}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin" />}
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
