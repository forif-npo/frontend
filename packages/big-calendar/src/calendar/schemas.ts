import { z } from "zod";

export const eventSchema = z
  .object({
    user: z.string(),
    title: z.string().min(1, "일정 제목을 입력해주세요."),
    description: z.string().min(1, "설명을 입력해주세요."),
    startDate: z.date({ required_error: "시작일을 선택해주세요." }),
    startTime: z.object(
      { hour: z.number(), minute: z.number() },
      { required_error: "시작 시간을 선택해주세요." },
    ),
    endDate: z.date({ required_error: "종료일을 선택해주세요." }),
    endTime: z.object(
      { hour: z.number(), minute: z.number() },
      { required_error: "종료 시간을 선택해주세요." },
    ),
    color: z.enum(
      ["blue", "green", "red", "yellow", "purple", "orange", "gray"],
      { required_error: "색상을 선택해주세요." },
    ),
  })
  .refine(
    (data) => {
      const startDateTime = new Date(data.startDate);
      startDateTime.setHours(data.startTime.hour, data.startTime.minute, 0, 0);

      const endDateTime = new Date(data.endDate);
      endDateTime.setHours(data.endTime.hour, data.endTime.minute, 0, 0);

      return startDateTime < endDateTime;
    },
    {
      message: "종료 일시는 시작 일시보다 늦어야 합니다.",
      path: ["startDate"],
    },
  );

export type TEventFormData = z.infer<typeof eventSchema>;
