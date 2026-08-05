"use client";

import { useCallback, useEffect, useState } from "react";
import { Users } from "lucide-react";
import { handleApiError } from "@core/utils/api-client";
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
import {
  getCurrentSemester,
  getReceiverPage,
  type CurrentSemester,
} from "./api";
import type { Receiver } from "./types";

interface ReceiverSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (phoneNumbers: string[]) => void;
}

export function ReceiverSelectorDialog({
  open,
  onOpenChange,
  onApply,
}: ReceiverSelectorDialogProps) {
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [receiverSearch, setReceiverSearch] = useState("");
  const [activeReceiverSearch, setActiveReceiverSearch] = useState("");
  const [searchAllMembers, setSearchAllMembers] = useState(false);
  const [activeSearchAllMembers, setActiveSearchAllMembers] = useState(false);
  const [currentSemester, setCurrentSemester] =
    useState<CurrentSemester | null>(null);
  const [nextReceiverCursor, setNextReceiverCursor] = useState<number | null>(
    null,
  );
  const [hasNextReceiverPage, setHasNextReceiverPage] = useState(false);
  const [totalReceiverCount, setTotalReceiverCount] = useState(0);
  const [isReceiversLoading, setIsReceiversLoading] = useState(false);
  const [receiverError, setReceiverError] = useState<string | null>(null);
  const [selectedReceivers, setSelectedReceivers] = useState<Set<string>>(
    new Set(),
  );

  const loadReceivers = useCallback(
    async ({
      cursor,
      search,
      replace,
      searchAll,
      semester,
    }: {
      cursor?: number;
      search: string;
      replace: boolean;
      searchAll: boolean;
      semester: CurrentSemester;
    }) => {
      setIsReceiversLoading(true);
      setReceiverError(null);

      try {
        const page = await getReceiverPage({
          cursor,
          search,
          semester: searchAll ? undefined : semester,
        });
        setReceivers((previous) => {
          if (replace) return page.receivers;

          const receiverByPhoneNumber = new Map(
            previous.map((receiver) => [receiver.phoneNumber, receiver]),
          );
          page.receivers.forEach((receiver) => {
            receiverByPhoneNumber.set(receiver.phoneNumber, receiver);
          });
          return Array.from(receiverByPhoneNumber.values());
        });
        setNextReceiverCursor(page.nextCursor);
        setHasNextReceiverPage(page.hasNext);
        setTotalReceiverCount(page.totalElements);
        setActiveReceiverSearch(search);
        setActiveSearchAllMembers(searchAll);
      } catch (err) {
        setReceiverError(await handleApiError(err));
      } finally {
        setIsReceiversLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (!open) return;

    const initialize = async () => {
      setReceiverSearch("");
      setSearchAllMembers(false);
      setSelectedReceivers(new Set());
      setIsReceiversLoading(true);
      setReceiverError(null);

      try {
        const semester = await getCurrentSemester();
        setCurrentSemester(semester);
        await loadReceivers({
          search: "",
          replace: true,
          searchAll: false,
          semester,
        });
      } catch (err) {
        setReceiverError(await handleApiError(err));
      } finally {
        setIsReceiversLoading(false);
      }
    };

    void initialize();
  }, [loadReceivers, open]);

  const searchReceivers = () => {
    if (!currentSemester) return;

    void loadReceivers({
      search: receiverSearch.trim(),
      replace: true,
      searchAll: searchAllMembers,
      semester: currentSemester,
    });
  };

  const toggleReceiver = (phoneNumber: string) => {
    setSelectedReceivers((previous) => {
      const next = new Set(previous);
      if (next.has(phoneNumber)) next.delete(phoneNumber);
      else next.add(phoneNumber);
      return next;
    });
  };

  const toggleAll = () => {
    setSelectedReceivers((previous) => {
      const next = new Set(previous);
      const allVisibleReceiversSelected = receivers.every((receiver) =>
        next.has(receiver.phoneNumber),
      );

      receivers.forEach((receiver) => {
        if (allVisibleReceiversSelected) next.delete(receiver.phoneNumber);
        else next.add(receiver.phoneNumber);
      });
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            수신자 목록
          </DialogTitle>
          <DialogDescription>
            알림톡을 발송할 부원을 검색하고 선택하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={receiverSearch}
              onChange={(event) => {
                setReceiverSearch(event.target.value);
                if (!event.target.value.trim()) setSearchAllMembers(false);
              }}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;

                event.preventDefault();
                searchReceivers();
              }}
              placeholder="이름 또는 학과로 검색"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isReceiversLoading || !currentSemester}
              onClick={searchReceivers}
            >
              검색
            </Button>
          </div>

          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300"
              checked={searchAllMembers}
              disabled={isReceiversLoading || !receiverSearch.trim()}
              onChange={(event) => setSearchAllMembers(event.target.checked)}
            />
            전체 부원에서 검색
          </label>
          {currentSemester && (
            <p className="text-muted-foreground text-xs">
              기본 목록은 현재 학기({currentSemester.label}) 부원입니다. 전체
              검색은 검색어 입력 후 사용할 수 있습니다.
            </p>
          )}

          <div className="flex items-center justify-between border-b pb-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300"
                checked={
                  receivers.length > 0 &&
                  receivers.every((receiver) =>
                    selectedReceivers.has(receiver.phoneNumber),
                  )
                }
                onChange={toggleAll}
              />
              현재 목록 전체 선택
            </label>
            <Badge variant="secondary">
              {selectedReceivers.size}/{totalReceiverCount}
            </Badge>
          </div>

          <div className="max-h-60 space-y-1 overflow-y-auto">
            {isReceiversLoading && receivers.length === 0 && (
              <div className="text-muted-foreground py-6 text-center text-sm">
                부원 목록을 불러오는 중입니다.
              </div>
            )}
            {receiverError && (
              <div className="text-destructive py-4 text-center text-sm">
                부원 목록을 불러오지 못했습니다: {receiverError}
              </div>
            )}
            {!isReceiversLoading &&
              !receiverError &&
              receivers.length === 0 && (
                <div className="text-muted-foreground py-6 text-center text-sm">
                  조건에 맞는 부원이 없습니다.
                </div>
              )}
            {receivers.map((receiver) => (
              <label
                key={receiver.phoneNumber}
                className="hover:bg-accent flex cursor-pointer items-center gap-3 rounded-md px-2 py-2"
              >
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={selectedReceivers.has(receiver.phoneNumber)}
                  onChange={() => toggleReceiver(receiver.phoneNumber)}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{receiver.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {receiver.phoneNumber} | {receiver.department}
                    {receiver.currentStudyName &&
                      ` | ${receiver.currentStudyName}`}
                  </div>
                </div>
              </label>
            ))}
          </div>

          {hasNextReceiverPage && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={
                isReceiversLoading ||
                nextReceiverCursor === null ||
                currentSemester === null
              }
              onClick={() => {
                if (nextReceiverCursor === null || currentSemester === null)
                  return;
                void loadReceivers({
                  cursor: nextReceiverCursor,
                  search: activeReceiverSearch,
                  replace: false,
                  searchAll: activeSearchAllMembers,
                  semester: currentSemester,
                });
              }}
            >
              {isReceiversLoading ? "불러오는 중..." : "더 불러오기"}
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button
            onClick={() => onApply(Array.from(selectedReceivers))}
            disabled={selectedReceivers.size === 0}
          >
            {selectedReceivers.size}명 추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
