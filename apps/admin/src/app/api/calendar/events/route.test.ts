import { beforeEach, describe, expect, it, jest } from "@jest/globals";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/env", () => ({
  env: {
    GOOGLE_CALENDAR_ID: "calendar-id",
    GOOGLE_PRIVATE_KEY: "private-key",
    GOOGLE_SERVICE_ACCOUNT_EMAIL: "calendar@forif.org",
  },
}));
jest.mock("googleapis", () => ({
  google: {
    auth: { GoogleAuth: jest.fn() },
    calendar: jest.fn(),
  },
}));

import { auth } from "@/auth";
import { google } from "googleapis";
import { POST } from "./route";

const mockedAuth = auth as jest.MockedFunction<typeof auth>;
const mockedCalendar = google.calendar as jest.MockedFunction<
  typeof google.calendar
>;

describe("calendar event POST", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedCalendar.mockReset();
  });

  it("rejects unauthenticated mutation requests before calling Google Calendar", async () => {
    mockedAuth.mockResolvedValue(null as never);

    const response = await POST(
      new Request("https://admin.forif.org/api/calendar/events", {
        method: "POST",
        body: JSON.stringify({ summary: "FORIF 회의" }),
      }),
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Unauthorized" });
    expect(mockedCalendar).not.toHaveBeenCalled();
  });
});
