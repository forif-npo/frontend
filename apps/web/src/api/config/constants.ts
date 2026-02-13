/**
 * API client configuration constants
 */

export const API_CONFIG = {
  baseUrl: "https://api.forif.org",
  timeout: 30000,
  retryLimit: 2,
  retryStatusCodes: [408, 413, 429, 500, 502, 503, 504],
};

export const API_ENDPOINTS = {
  studies: "api/v2/studies",
  posts: "posts",
  auth: {
    login: "auth/login",
    logout: "auth/logout",
    refresh: "auth/refresh",
  },
};
