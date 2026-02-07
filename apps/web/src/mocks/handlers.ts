import * as authApis from "@/mocks/apis/auth";
import * as postApis from "@/mocks/apis/post";
import * as studyApis from "@/mocks/apis/study";
import * as userApis from "@/mocks/apis/user";
import { http, passthrough, RequestHandler } from "msw";

export const handlers: RequestHandler[] = [
  http.get(/^\/_next\//, () => passthrough()),
  http.get(/\/favicon\.ico$/, () => passthrough()),
  http.get(/\/icon(-\d+x\d+)?\.png$/, () => passthrough()),
  ...Object.values(authApis),
  ...Object.values(postApis),
  ...Object.values(studyApis),
  ...Object.values(userApis),
];
