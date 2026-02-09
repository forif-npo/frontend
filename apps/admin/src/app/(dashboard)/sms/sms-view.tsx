"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Loader2,
  CheckCircle,
  XCircle,
  Users,
  UserPlus,
} from "lucide-react";
import { handleApiError } from "@core/utils/api-client";
import { sendAlimTalk } from "./api";
import { sendAlimTalkSchema, type SendAlimTalkFormValues } from "./schema";
import {
  TEMPLATE_OPTIONS,
  type SendAlimTalkResult,
  type Receiver,
} from "./types";

interface SmsViewProps {
  initialReceivers: Receiver[];
}

export function SmsView({ initialReceivers }: SmsViewProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SendAlimTalkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReceiverList, setShowReceiverList] = useState(false);
  const [selectedReceivers, setSelectedReceivers] = useState<Set<string>>(
    new Set(),
  );

  const form = useForm<SendAlimTalkFormValues>({
    resolver: zodResolver(sendAlimTalkSchema),
    defaultValues: {
      receivers: "",
      templateCode: "",
      studyName: "",
      responseSchedule: "",
      dateTime: "",
      location: "",
      url: "https://forif.org/apply",
    },
  });

  const receiversText = form.watch("receivers");
  const receiverCount = receiversText
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean).length;

  const toggleReceiver = (phoneNumber: string) => {
    setSelectedReceivers((prev) => {
      const next = new Set(prev);
      if (next.has(phoneNumber)) {
        next.delete(phoneNumber);
      } else {
        next.add(phoneNumber);
      }
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedReceivers.size === initialReceivers.length) {
      setSelectedReceivers(new Set());
    } else {
      setSelectedReceivers(new Set(initialReceivers.map((r) => r.phoneNumber)));
    }
  };

  const applySelectedReceivers = () => {
    const currentText = form.getValues("receivers");
    const currentNumbers = new Set(
      currentText
        .split("\n")
        .map((n) => n.trim())
        .filter(Boolean),
    );

    selectedReceivers.forEach((num) => currentNumbers.add(num));

    form.setValue("receivers", Array.from(currentNumbers).join("\n"), {
      shouldValidate: true,
    });
    setShowReceiverList(false);
    setSelectedReceivers(new Set());
  };

  const handleFormSubmit = (values: SendAlimTalkFormValues) => {
    void values;
    setShowConfirm(true);
  };

  const handleConfirmSend = async () => {
    setShowConfirm(false);
    setIsSubmitting(true);
    setResult(null);
    setError(null);

    const values = form.getValues();

    try {
      const receivers = values.receivers
        .split("\n")
        .map((n) => n.trim())
        .filter(Boolean);

      const response = await sendAlimTalk({
        ...values,
        receivers,
      });

      if (response.data) {
        setResult(response.data);
      }
    } catch (err) {
      const errorMessage = await handleApiError(err);
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">문자 발송 서비스</h1>
        <p className="text-muted-foreground">
          카카오 알림톡을 통해 스터디 관련 알림을 발송할 수 있습니다.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* 발송 폼 */}
        <div className="rounded-md border p-6">
          <h2 className="mb-4 text-lg font-semibold">알림톡 발송</h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFormSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="templateCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>템플릿</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="템플릿을 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TEMPLATE_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="receivers"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FormLabel>수신자</FormLabel>
                        {receiverCount > 0 && (
                          <Badge variant="secondary">{receiverCount}명</Badge>
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => setShowReceiverList(true)}
                        disabled={isSubmitting}
                      >
                        <UserPlus className="h-3 w-3" />
                        목록에서 선택
                      </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder={"01012345678\n01087654321\n01098765432"}
                        className="min-h-[120px] font-mono"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      전화번호를 한 줄에 하나씩 입력하거나, 목록에서 선택하세요.
                      (하이픈 없이)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="studyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>스터디명</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Spring Boot 스터디"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="responseSchedule"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>응답 기한</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2025-01-15까지"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>일시</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2025-01-20 14:00"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>장소</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="IT관 123호"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://forif.org/apply"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    발송 중...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    알림톡 발송
                  </>
                )}
              </Button>
            </form>
          </Form>
        </div>

        {/* 발송 결과 */}
        <div className="rounded-md border p-6">
          <h2 className="mb-4 text-lg font-semibold">발송 결과</h2>

          {!result && !error && (
            <div className="text-muted-foreground flex h-48 items-center justify-center text-sm">
              알림톡을 발송하면 결과가 여기에 표시됩니다.
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-4">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">발송 실패</span>
              </div>
              <p className="mt-2 text-sm text-red-700">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="flex gap-3">
                <Badge
                  variant="outline"
                  className="border-blue-200 bg-blue-50 text-blue-700"
                >
                  전체 {result.totalCount}건
                </Badge>
                <Badge
                  variant="outline"
                  className="border-green-200 bg-green-50 text-green-700"
                >
                  <CheckCircle className="mr-1 h-3 w-3" />
                  성공 {result.successCount}건
                </Badge>
                {result.failureCount > 0 && (
                  <Badge
                    variant="outline"
                    className="border-red-200 bg-red-50 text-red-700"
                  >
                    <XCircle className="mr-1 h-3 w-3" />
                    실패 {result.failureCount}건
                  </Badge>
                )}
              </div>

              <div className="max-h-80 space-y-1 overflow-y-auto">
                {result.results.map((item, index) => {
                  const isSuccess = item.startsWith("Success");
                  return (
                    <div
                      key={index}
                      className={`rounded px-3 py-2 text-sm ${
                        isSuccess
                          ? "bg-green-50 text-green-800"
                          : "bg-red-50 text-red-800"
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle className="mr-2 inline h-3 w-3" />
                      ) : (
                        <XCircle className="mr-2 inline h-3 w-3" />
                      )}
                      {item}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 발송 확인 다이얼로그 */}
      <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>알림톡 발송 확인</DialogTitle>
            <DialogDescription>
              {receiverCount}명에게 알림톡을 발송합니다. 계속하시겠습니까?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirm(false)}>
              취소
            </Button>
            <Button onClick={handleConfirmSend}>발송</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 수신자 목록 다이얼로그 */}
      <Dialog open={showReceiverList} onOpenChange={setShowReceiverList}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              수신자 목록
            </DialogTitle>
            <DialogDescription>
              알림톡을 발송할 수신자를 선택하세요.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <div className="flex items-center justify-between border-b pb-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300"
                  checked={
                    selectedReceivers.size === initialReceivers.length &&
                    initialReceivers.length > 0
                  }
                  onChange={toggleAll}
                />
                전체 선택
              </label>
              <Badge variant="secondary">
                {selectedReceivers.size}/{initialReceivers.length}
              </Badge>
            </div>

            <div className="max-h-60 space-y-1 overflow-y-auto">
              {initialReceivers.map((receiver) => (
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
                      {receiver.phoneNumber} | {receiver.studentId}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowReceiverList(false);
                setSelectedReceivers(new Set());
              }}
            >
              취소
            </Button>
            <Button
              onClick={applySelectedReceivers}
              disabled={selectedReceivers.size === 0}
            >
              {selectedReceivers.size}명 추가
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
