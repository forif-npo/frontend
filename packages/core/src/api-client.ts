import ky from "ky";
import { env } from "./env.js";

const apiClient = ky.create({
  prefixUrl: env.SERVER_URL,
  headers: {
    "content-type": "application/json",
  },
});

const authApiClient = (
  getAccessToken: () => string | undefined,
  refreshAndStoreAccessToken: () => Promise<{
    accessToken: string;
    refreshToken: string;
  }>,
) => {
  return apiClient.extend({
    hooks: {
      beforeRequest: [
        (request) => {
          const accessToken = getAccessToken();
          if (accessToken) {
            request.headers.set("Authorization", `Bearer ${accessToken}`);
          }
        },
      ],
      beforeRetry: [
        async ({ request }) => {
          const { accessToken } = await refreshAndStoreAccessToken();
          request.headers.set("Authorization", `Bearer ${accessToken}`);
        },
      ],
    },
  });
};

export { apiClient, authApiClient };
