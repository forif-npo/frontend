import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@/auth", () => ({ auth: jest.fn() }));

import { auth } from "@/auth";
import { requireCalendarAdmin } from "./auth";

const mockedAuth = auth as jest.MockedFunction<typeof auth>;

describe("requireCalendarAdmin", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
  });

  it("rejects unauthenticated requests before calendar access", async () => {
    mockedAuth.mockResolvedValue(null as never);

    const response = await requireCalendarAdmin();

    expect(response?.status).toBe(401);
    await expect(response?.json()).resolves.toEqual({ error: "Unauthorized" });
  });

  it("rejects non-admin and expired sessions", async () => {
    mockedAuth.mockResolvedValue({ role: "MENTOR" } as never);
    expect((await requireCalendarAdmin())?.status).toBe(403);

    mockedAuth.mockResolvedValue({
      role: "ADMIN",
      error: "RefreshError",
    } as never);
    expect((await requireCalendarAdmin())?.status).toBe(403);
  });

  it("allows an active admin session", async () => {
    mockedAuth.mockResolvedValue({ role: "ADMIN" } as never);

    await expect(requireCalendarAdmin()).resolves.toBeNull();
  });
});
