import { z } from "zod";

const phoneNumberRegex = /^01[016789]\d{7,8}$/;

export const sendAlimTalkSchema = z.object({
  receivers: z
    .string()
    .min(1, "수신자 번호를 입력해주세요.")
    .refine(
      (val) => {
        const numbers = val
          .split("\n")
          .map((n) => n.trim())
          .filter(Boolean);
        return numbers.length > 0;
      },
      { message: "최소 1개 이상의 번호를 입력해주세요." },
    )
    .refine(
      (val) => {
        const numbers = val
          .split("\n")
          .map((n) => n.trim())
          .filter(Boolean);
        return numbers.every((n) =>
          phoneNumberRegex.test(n.replace(/\D/g, "")),
        );
      },
      { message: "올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)" },
    ),
  templateCode: z.string().min(1, "템플릿을 선택해주세요."),
  variables: z.record(z.string()),
});

export type SendAlimTalkFormValues = z.infer<typeof sendAlimTalkSchema>;
