import ky from "ky";
import { env } from "./env.js";

const apiClient = ky.create({
  prefixUrl: env.SERVER_URL,
  headers: {},
});

const authApiClient = apiClient.extend({
  hooks: {
    beforeRetry: [
      async ({ request, options, error, retryCount }) => {
        const token = await ky<string>(`${env.SERVER_URL}/refresh-token`);
        request.headers.set("Authorization", `token ${token}`);
      },
    ],
  },
});

export { apiClient, authApiClient };
