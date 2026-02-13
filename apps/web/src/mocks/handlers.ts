import * as apis from "@/mocks/apis";
import { http, passthrough, RequestHandler } from "msw";

export const handlers: RequestHandler[] = [
  http.all(/^\/api\/proxy\/.*/, () => passthrough()),
  http.get(/^\/_next\//, () => passthrough()),
  http.get(/\/favicon\.ico$/, () => passthrough()),
  http.get(/\/icon(-\d+x\d+)?\.png$/, () => passthrough()),
  ...Object.values(apis),
];
