import { Member } from "@core/types/member";
import { z } from "zod/v4";
import { createSchema } from "../utils/schema.util";

export const signUpSchema = createSchema<Member & { referralSource: string }>()(
  z
    .object({
      email: z.email().min(1, "email.error"),
      id: z.string().min(1, "id.error").length(10, "id.length-error"),
      name: z.string().min(1, "name.error"),
      department: z.string().min(1, "department.error"),
      phoneNumber: z
        .string()
        .min(1, "phoneNumber.error")
        .regex(/^\d{3}-\d{4}-\d{4}$/, "phoneNumber.shape-error"),
      referralSource: z.string().min(1, "referralSource.error"),
      serviceTermAgree: z.boolean(), // z.enum(["on", "off", "intermediate"])
      privacyPolicyAgree: z.boolean(),
    })
    .refine(
      (data) => {
        return data.serviceTermAgree && data.privacyPolicyAgree;
      },
      {
        error: "terms.error",
        path: ["serviceTermAgree"],
      },
    ),
);

export type SignUpValues = z.infer<typeof signUpSchema>;
