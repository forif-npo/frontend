"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import { handleApiError } from "@core/utils/api-client";
import { formatPhoneNumber } from "@core/utils/phone-number";
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
import { getAllReceivers, getReceiverPage } from "./api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Receiver, ReceiverTarget } from "./types";

const RECEIVER_TARGET_OPTIONS: { value: ReceiverTarget; label: string }[] = [
  {
    value: "CURRENT_SEMESTER_ACCEPTED_APPLICANTS",
    label: "현재 학기 합격자",
  },
  {
    value: "CURRENT_SEMESTER_REJECTED_APPLICANTS",
    label: "현재 학기 불합격자",
  },
  { value: "CURRENT_SEMESTER_APPLICANTS", label: "현재 학기 신청자" },
  {
    value: "ACCEPTED_DUES_UNPAID",
    label: "현재 학기 회비 미납 합격자",
  },
  {
    value: "ACCEPTED_GOOGLE_FORM_NOT_SUBMITTED",
    label: "현재 학기 구글폼 미제출 합격자",
  },
  { value: "CURRENT_SEMESTER_MEMBERS", label: "현재 학기 부원" },
  { value: "PREVIOUS_SEMESTER_MEMBERS", label: "직전 학기 부원" },
  { value: "ALL_MEMBERS", label: "전체 부원" },
];

interface ReceiverSelectorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApply: (receivers: Receiver[]) => void;
}

export function ReceiverSelectorDialog({
  open,
  onOpenChange,
  onApply,
}: ReceiverSelectorDialogProps) {
  const [receivers, setReceivers] = useState<Receiver[]>([]);
  const [receiverSearch, setReceiverSearch] = useState("");
  const [activeReceiverSearch, setActiveReceiverSearch] = useState("");
  const [receiverTarget, setReceiverTarget] = useState<ReceiverTarget>(
    "CURRENT_SEMESTER_MEMBERS",
  );
  const [nextReceiverCursor, setNextReceiverCursor] = useState<number | null>(
    null,
  );
  const [hasNextReceiverPage, setHasNextReceiverPage] = useState(false);
  const [totalReceiverCount, setTotalReceiverCount] = useState(0);
  const [isReceiversLoading, setIsReceiversLoading] = useState(false);
  const [receiverError, setReceiverError] = useState<string | null>(null);
  const receiverRequestId = useRef(0);
  const [selectedReceivers, setSelectedReceivers] = useState<
    Map<string, Receiver>
  >(new Map());

  const confirmSelectionReset = () => {
    if (selectedReceivers.size === 0) return true;

    return window.confirm(
      `선택한 ${selectedReceivers.size}명이 해제됩니다. 계속하시겠습니까?`,
    );
  };

  const loadReceivers = useCallback(
    async ({
      cursor,
      search,
      replace,
      target,
    }: {
      cursor?: number;
      search: string;
      replace: boolean;
      target: ReceiverTarget;
    }) => {
      const requestId = ++receiverRequestId.current;
      setIsReceiversLoading(true);
      setReceiverError(null);

      try {
        const page = await getReceiverPage({
          cursor,
          search,
          target,
        });
        if (requestId !== receiverRequestId.current) return;
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
      } catch (err) {
        if (requestId !== receiverRequestId.current) return;
        setReceiverError(await handleApiError(err));
      } finally {
        if (requestId === receiverRequestId.current) {
          setIsReceiversLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (!open) return;

    const initialize = async () => {
      setReceiverSearch("");
      setReceiverTarget("CURRENT_SEMESTER_MEMBERS");
      setSelectedReceivers(new Map());
      setIsReceiversLoading(true);
      setReceiverError(null);

      try {
        await loadReceivers({
          search: "",
          replace: true,
          target: "CURRENT_SEMESTER_MEMBERS",
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
    if (!confirmSelectionReset()) return;

    setSelectedReceivers(new Map());
    void loadReceivers({
      search: receiverSearch.trim(),
      replace: true,
      target: receiverTarget,
    });
  };

  const changeReceiverTarget = (target: ReceiverTarget) => {
    if (!confirmSelectionReset()) return;

    setReceiverTarget(target);
    setReceiverSearch("");
    setSelectedReceivers(new Map());
    void loadReceivers({ search: "", replace: true, target });
  };

  const toggleReceiver = (receiver: Receiver) => {
    setSelectedReceivers((previous) => {
      const next = new Map(previous);
      if (next.has(receiver.phoneNumber)) next.delete(receiver.phoneNumber);
      else next.set(receiver.phoneNumber, receiver);
      return next;
    });
  };

  const toggleVisibleReceivers = () => {
    setSelectedReceivers((previous) => {
      const next = new Map(previous);
      const allVisibleReceiversSelected = receivers.every((receiver) =>
        next.has(receiver.phoneNumber),
      );

      receivers.forEach((receiver) =>
        allVisibleReceiversSelected
          ? next.delete(receiver.phoneNumber)
          : next.set(receiver.phoneNumber, receiver),
      );
      return next;
    });
  };

  const selectAllSearchResults = async () => {
    setIsReceiversLoading(true);
    setReceiverError(null);

    try {
      const allReceivers = await getAllReceivers({
        search: activeReceiverSearch,
        target: receiverTarget,
      });
      setSelectedReceivers(
        new Map(
          allReceivers.map((receiver) => [receiver.phoneNumber, receiver]),
        ),
      );
      setTotalReceiverCount(allReceivers.length);
    } catch (err) {
      setReceiverError(await handleApiError(err));
    } finally {
      setIsReceiversLoading(false);
    }
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
            발송 대상 유형을 선택한 뒤 해당 목록에서 수신자를 검색하고
            선택하세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Select
            value={receiverTarget}
            onValueChange={(value) =>
              changeReceiverTarget(value as ReceiverTarget)
            }
            disabled={isReceiversLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="발송 대상을 선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {RECEIVER_TARGET_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Input
              value={receiverSearch}
              onChange={(event) => setReceiverSearch(event.target.value)}
              onKeyDown={(event) => {
                if (event.key !== "Enter") return;

                event.preventDefault();
                searchReceivers();
              }}
              placeholder="이름 또는 학번으로 검색"
            />
            <Button
              type="button"
              variant="outline"
              disabled={isReceiversLoading}
              onClick={searchReceivers}
            >
              검색
            </Button>
          </div>

          <p className="text-muted-foreground text-xs">
            검색은 현재 선택한 발송 대상 목록 안에서만 수행됩니다.
          </p>

          <div className="flex items-center justify-between border-b pb-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                className="border-border h-4 w-4 rounded"
                checked={
                  receivers.length > 0 &&
                  receivers.every((receiver) =>
                    selectedReceivers.has(receiver.phoneNumber),
                  )
                }
                onChange={toggleVisibleReceivers}
              />
              현재 불러온 {receivers.length}명 선택
            </label>
            <Badge variant="secondary">
              {selectedReceivers.size}/{totalReceiverCount}
            </Badge>
          </div>

          {totalReceiverCount > receivers.length && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isReceiversLoading}
              onClick={() => void selectAllSearchResults()}
            >
              검색 결과 전체 {totalReceiverCount}명 선택
            </Button>
          )}

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
                  className="border-border h-4 w-4 rounded"
                  checked={selectedReceivers.has(receiver.phoneNumber)}
                  onChange={() => toggleReceiver(receiver)}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{receiver.name}</div>
                  <div className="text-muted-foreground text-xs">
                    {formatPhoneNumber(receiver.phoneNumber)} |{" "}
                    {receiver.department}
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
              disabled={isReceiversLoading || nextReceiverCursor === null}
              onClick={() => {
                if (nextReceiverCursor === null) return;
                void loadReceivers({
                  cursor: nextReceiverCursor,
                  search: activeReceiverSearch,
                  replace: false,
                  target: receiverTarget,
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
            onClick={() => onApply(Array.from(selectedReceivers.values()))}
            disabled={selectedReceivers.size === 0}
          >
            {selectedReceivers.size}명 추가
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
