import * as postApis from "@/mocks/apis/post";
import * as userApis from "@/mocks/apis/user";
// import * as studyApis from "@/mocks/apis/study"; // Disabled: using real API
import { http, passthrough, RequestHandler } from "msw";

export const handlers: RequestHandler[] = [
  http.get(/^\/_next\//, () => passthrough()),
  http.get(/\/favicon\.ico$/, () => passthrough()),
  http.get(/\/icon(-\d+x\d+)?\.png$/, () => passthrough()),
  ...Object.values(postApis),
  ...Object.values(userApis),
  // Study APIs are now using real backend instead of mocks
];
