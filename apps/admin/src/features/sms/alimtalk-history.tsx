"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { formatPhoneNumber } from "@core/utils/phone-number";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { handleApiError } from "@core/utils/api-client";
import { getAlimTalkHistory } from "./api";
import type { AlimTalkTemplate } from "./types";

function formatHistoryDate(value: string | null) {
  if (!value) return "-";

  return value.replace("T", " ").replace(/\.\d+/, "");
}

export function AlimTalkHistory({
  templates,
}: {
  templates: AlimTalkTemplate[];
}) {
  const [items, setItems] = useState<
    Awaited<ReturnType<typeof getAlimTalkHistory>>["content"]
  >([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const templateNameById = useMemo(
    () =>
      new Map(
        templates.map((template) => [template.templateId, template.name]),
      ),
    [templates],
  );

  const loadHistory = useCallback(async (cursor?: string) => {
    if (cursor) setIsLoadingMore(true);
    else setIsLoading(true);
    setError(null);

    try {
      const page = await getAlimTalkHistory({ cursor });
      setItems((previous) =>
        cursor ? [...previous, ...page.content] : page.content,
      );
      setNextCursor(page.nextCursor);
      setHasNext(page.hasNext);
    } catch (caught) {
      setError(await handleApiError(caught));
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  return (
    <section className="min-w-0 rounded-md border p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">발송 이력</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            Solapi에 보관된 최근 6개월 알림톡 발송 내역입니다.
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isLoading || isLoadingMore}
          onClick={() => void loadHistory()}
        >
          {isLoading ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-1 h-4 w-4" />
          )}
          새로고침
        </Button>
      </div>

      {error && (
        <p className="border-border-danger-light bg-danger-5 text-text-danger rounded-md border px-4 py-3 text-sm">
          발송 이력을 불러오지 못했습니다: {error}
        </p>
      )}

      {!error && isLoading && (
        <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
          발송 이력을 불러오는 중입니다.
        </div>
      )}

      {!error && !isLoading && items.length === 0 && (
        <div className="text-muted-foreground flex h-32 items-center justify-center text-sm">
          최근 6개월 발송 이력이 없습니다.
        </div>
      )}

      {!error && items.length > 0 && (
        <>
          <Table className="max-md:min-w-[720px]">
            <TableHeader>
              <TableRow>
                <TableHead>발송 시각</TableHead>
                <TableHead>템플릿</TableHead>
                <TableHead>수신 번호</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>상태 코드</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.messageId}>
                  <TableCell>{formatHistoryDate(item.createdAt)}</TableCell>
                  <TableCell>
                    {item.templateId
                      ? (templateNameById.get(item.templateId) ??
                        item.templateId)
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {item.receiver ? formatPhoneNumber(item.receiver) : "-"}
                  </TableCell>
                  <TableCell>{item.status ?? "-"}</TableCell>
                  <TableCell>{item.statusCode ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {hasNext && nextCursor && (
            <div className="mt-4 flex justify-center">
              <Button
                type="button"
                variant="outline"
                disabled={isLoadingMore}
                onClick={() => void loadHistory(nextCursor)}
              >
                {isLoadingMore && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                더 불러오기
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
