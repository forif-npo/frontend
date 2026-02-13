import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod/v4";

export const env = createEnv({
  server: {
    AUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().min(1).optional(),
    GOOGLE_SERVICE_ACCOUNT_EMAIL: z.string().min(1),
    GOOGLE_PRIVATE_KEY: z.string().min(1),
    GOOGLE_CALENDAR_ID: z.string().min(1),
  },

  client: {
    NEXT_PUBLIC_APP_URL: z.string().min(1),
    NEXT_PUBLIC_SERVER_URL: z.string().min(1),
  },

  /**
   * For Next.js >= 13.4.4, only client-side variables need to be specified here.
   * Server variables are automatically picked up from process.env.
   */
  experimental__runtimeEnv: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
  },

  emptyStringAsUndefined: true,
});
