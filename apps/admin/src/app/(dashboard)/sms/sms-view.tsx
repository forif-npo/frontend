"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
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
import { Send, Loader2, CheckCircle, XCircle, UserPlus } from "lucide-react";
import { handleApiError } from "@core/utils/api-client";
import { formatPhoneNumber } from "@core/utils/phone-number";
import { sendAlimTalkSchema, type SendAlimTalkFormValues } from "./schema";
import {
  type AlimTalkTemplate,
  type Receiver,
  type SendAlimTalkResult,
} from "./types";
import { getAlimTalkTemplates, sendAlimTalk } from "./api";
import { AlimTalkPreview } from "./alimtalk-preview";
import { ReceiverSelectorDialog } from "./receiver-selector-dialog";

const AUTO_FILLED_VARIABLES = new Set(["#{이름}"]);
const PHONE_NUMBER_IN_RECEIVER_LINE_REGEX =
  /01[016789][\s-]?\d{3,4}[\s-]?\d{4}/;

const VARIABLE_LABELS: Record<string, string> = {
  "#{스터디명}": "스터디명",
  "#{응답일정}": "응답 기한",
  "#{일시}": "일시",
  "#{장소}": "장소",
  "#{url}": "URL",
};

function formatPhoneNumberLines(value: string) {
  return value
    .split("\n")
    .map((line) => {
      const phoneNumber = line.match(PHONE_NUMBER_IN_RECEIVER_LINE_REGEX)?.[0];
      if (!phoneNumber) return formatPhoneNumber(line.trim());

      return line.replace(phoneNumber, formatPhoneNumber(phoneNumber));
    })
    .join("\n");
}

function extractPhoneNumber(value: string) {
  const phoneNumber = value.match(PHONE_NUMBER_IN_RECEIVER_LINE_REGEX)?.[0];
  return (phoneNumber ?? value).replace(/\D/g, "");
}

function formatReceiverLine(receiver: Receiver) {
  return `${receiver.name}, ${formatPhoneNumber(receiver.phoneNumber)}, ${receiver.department}`;
}

function getVariableLabel(variable: string) {
  return VARIABLE_LABELS[variable] ?? variable;
}

function getTemplateVariables(template: AlimTalkTemplate | undefined) {
  if (!template) return [];

  const contentVariables = template.content.match(/#\{[^}]+\}/g) ?? [];
  const buttonVariables = template.buttonLinks.flatMap(
    (link) => link.match(/#\{[^}]+\}/g) ?? [],
  );
  return Array.from(
    new Set([...template.variables, ...contentVariables, ...buttonVariables]),
  );
}

export function SmsView() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [templates, setTemplates] = useState<AlimTalkTemplate[]>([]);
  const [isTemplatesLoading, setIsTemplatesLoading] = useState(true);
  const [templateError, setTemplateError] = useState<string | null>(null);
  const [variableError, setVariableError] = useState<string | null>(null);
  const [result, setResult] = useState<SendAlimTalkResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showReceiverList, setShowReceiverList] = useState(false);
  const [selectedReceiverByPhoneNumber, setSelectedReceiverByPhoneNumber] =
    useState<Map<string, Receiver>>(new Map());

  const form = useForm<SendAlimTalkFormValues>({
    resolver: zodResolver(sendAlimTalkSchema),
    defaultValues: {
      receivers: "",
      templateCode: "",
      variables: {},
    },
  });

  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setTemplates(await getAlimTalkTemplates());
      } catch (err) {
        setTemplateError(await handleApiError(err));
      } finally {
        setIsTemplatesLoading(false);
      }
    };

    void loadTemplates();
  }, []);

  const receiversText = form.watch("receivers");
  const selectedTemplateCode = form.watch("templateCode");
  const variableValues = form.watch("variables");
  const selectedTemplate = templates.find(
    (template) => template.templateId === selectedTemplateCode,
  );
  const templateVariables = getTemplateVariables(selectedTemplate);
  const requiredVariables = templateVariables.filter(
    (variable) => !AUTO_FILLED_VARIABLES.has(variable),
  );
  const receiverCount = receiversText
    .split("\n")
    .map((n) => n.trim())
    .filter(Boolean).length;

  const applySelectedReceivers = (selectedReceivers: Receiver[]) => {
    const currentText = form.getValues("receivers");
    const receiverLineByPhoneNumber = new Map(
      currentText
        .split("\n")
        .map((line) => [extractPhoneNumber(line), line] as const)
        .filter(([phoneNumber]) => Boolean(phoneNumber)),
    );
    const nextSelectedReceiverByPhoneNumber = new Map(
      selectedReceiverByPhoneNumber,
    );

    selectedReceivers.forEach((receiver) => {
      const phoneNumber = extractPhoneNumber(receiver.phoneNumber);
      nextSelectedReceiverByPhoneNumber.set(phoneNumber, receiver);
      receiverLineByPhoneNumber.set(phoneNumber, formatReceiverLine(receiver));
    });

    form.setValue(
      "receivers",
      Array.from(receiverLineByPhoneNumber.values()).join("\n"),
      {
        shouldValidate: true,
      },
    );
    setSelectedReceiverByPhoneNumber(nextSelectedReceiverByPhoneNumber);
    setShowReceiverList(false);
  };

  const handleFormSubmit = (values: SendAlimTalkFormValues) => {
    const missingVariables = requiredVariables.filter(
      (variable) => !values.variables[variable]?.trim(),
    );

    if (missingVariables.length > 0) {
      setVariableError(
        `${missingVariables.map(getVariableLabel).join(", ")} 항목을 입력해주세요.`,
      );
      return;
    }

    setVariableError(null);
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
        .map(extractPhoneNumber)
        .filter(Boolean);
      const variables = Object.fromEntries(
        requiredVariables.map((variable) => [
          variable,
          values.variables[variable]?.trim() ?? "",
        ]),
      );

      const response = await sendAlimTalk({
        receivers,
        templateCode: values.templateCode,
        variables,
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
      <PageHeader
        title="문자 발송 서비스"
        description="카카오 알림톡을 통해 스터디 관련 알림을 발송할 수 있습니다."
      />

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
                      onValueChange={(value) => {
                        field.onChange(value);
                        setVariableError(null);
                      }}
                      defaultValue={field.value}
                      disabled={isSubmitting || isTemplatesLoading}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="템플릿을 선택해주세요" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {templates.map((template) => (
                          <SelectItem
                            key={template.templateId}
                            value={template.templateId}
                          >
                            {template.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isTemplatesLoading && (
                      <FormDescription>
                        발송 가능한 템플릿을 불러오는 중입니다.
                      </FormDescription>
                    )}
                    {templateError && (
                      <FormDescription className="text-destructive">
                        템플릿을 불러오지 못했습니다: {templateError}
                      </FormDescription>
                    )}
                    {!isTemplatesLoading &&
                      !templateError &&
                      templates.length === 0 && (
                        <FormDescription className="text-destructive">
                          발송 가능한 템플릿이 없습니다. Solapi에서 템플릿
                          상태를 확인해주세요.
                        </FormDescription>
                      )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              {selectedTemplate && (
                <p className="text-muted-foreground text-xs">
                  템플릿 ID: <code>{selectedTemplate.templateId}</code>
                  {selectedTemplate.status && ` · ${selectedTemplate.status}`}
                  {templateVariables.includes("#{이름}") &&
                    " · #{이름}은 수신자 정보에서 자동 입력"}
                </p>
              )}

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
                        placeholder={
                          "010-1234-5678\n010-8765-4321\n010-9876-5432"
                        }
                        className="min-h-[120px] font-mono"
                        disabled={isSubmitting}
                        {...field}
                        onChange={(event) =>
                          field.onChange(
                            formatPhoneNumberLines(event.target.value),
                          )
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      전화번호를 한 줄에 하나씩 입력하거나, 목록에서 선택하세요.
                      (하이픈은 자동으로 표시됩니다.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {requiredVariables.map((variable) => (
                <FormItem key={variable}>
                  <FormLabel>{getVariableLabel(variable)}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder={`${getVariableLabel(variable)}을 입력해주세요.`}
                      {...form.register(`variables.${variable}`)}
                    />
                  </FormControl>
                </FormItem>
              ))}

              {variableError && (
                <p className="text-destructive text-sm">{variableError}</p>
              )}

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

        <div className="space-y-8">
          <AlimTalkPreview
            template={selectedTemplate}
            variables={variableValues}
          />

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
                  <Badge variant="outline">
                    템플릿 ID: {result.templateId}
                  </Badge>
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
                  {result.results.map((item) => {
                    const isSuccess = item.success;
                    return (
                      <div
                        key={item.receiver}
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
                        <span className="font-medium">
                          {formatPhoneNumber(item.receiver)}
                        </span>
                        {!isSuccess && (
                          <span className="ml-2">
                            {item.errorCode && `[${item.errorCode}] `}
                            {item.errorMessage ??
                              "Solapi에서 발송을 거절했습니다."}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
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

      <ReceiverSelectorDialog
        open={showReceiverList}
        onOpenChange={setShowReceiverList}
        onApply={applySelectedReceivers}
      />
    </div>
  );
}
