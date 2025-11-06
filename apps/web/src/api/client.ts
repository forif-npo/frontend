import ky, { type KyInstance, type Options } from "ky";
import { API_CONFIG } from "./config";
import { ApiError, authUtils } from "./utils";

/**
 * Create configured ky instance with error handling
 */
function createApiClient(): KyInstance {
  return ky.create({
    prefixUrl: API_CONFIG.baseUrl,
    timeout: API_CONFIG.timeout,
    retry: {
      limit: API_CONFIG.retryLimit,
      methods: ["get"],
      statusCodes: API_CONFIG.retryStatusCodes,
    },
    hooks: {
      beforeRequest: [
        (request) => {
          // Set default headers
          request.headers.set("Content-Type", "application/json");

          // Add auth token if available
          const token = authUtils.getToken();
          if (token) {
            request.headers.set("Authorization", `Bearer ${token}`);
          }
        },
      ],
      beforeError: [
        async (error) => {
          // Convert HTTPError to ApiError with custom error handling
          const apiError = await ApiError.fromHTTPError(error);
          // Preserve the original error but add custom properties
          error.message = apiError.message;
          return error;
        },
      ],
    },
  });
}

/**
 * Singleton API client instance
 */
export const kvInstance = createApiClient();

/**
 * Create a new API client with custom options
 */
export function createCustomApiClient(options: Options): KyInstance {
  return kvInstance.extend(options);
}
