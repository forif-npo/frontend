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
        return numbers.every((n) => phoneNumberRegex.test(n));
      },
      { message: "올바른 전화번호 형식이 아닙니다. (예: 01012345678)" },
    ),
  templateCode: z.string().min(1, "템플릿을 선택해주세요."),
  studyName: z.string().min(1, "스터디명을 입력해주세요."),
  responseSchedule: z.string().min(1, "응답 기한을 입력해주세요."),
  dateTime: z.string().min(1, "일시를 입력해주세요."),
  location: z.string().min(1, "장소를 입력해주세요."),
  url: z.string().url("올바른 URL을 입력해주세요."),
});

export type SendAlimTalkFormValues = z.infer<typeof sendAlimTalkSchema>;
