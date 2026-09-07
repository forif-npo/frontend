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
import { DELETE, GET, PATCH } from "./route";

const mockedAuth = auth as jest.MockedFunction<typeof auth>;
const mockedCalendar = google.calendar as jest.MockedFunction<
  typeof google.calendar
>;
const routeParams = { params: Promise.resolve({ eventId: "event-id" }) };

describe("calendar event detail routes", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedCalendar.mockReset();
    mockedAuth.mockResolvedValue(null as never);
  });

  it("rejects unauthenticated event reads before calling Google Calendar", async () => {
    const response = await GET(
      new Request("https://admin.forif.org"),
      routeParams,
    );

    expect(response.status).toBe(401);
    expect(mockedCalendar).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated event updates before calling Google Calendar", async () => {
    const response = await PATCH(
      new Request("https://admin.forif.org", {
        method: "PATCH",
        body: JSON.stringify({ summary: "변경" }),
      }),
      routeParams,
    );

    expect(response.status).toBe(401);
    expect(mockedCalendar).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated event deletions before calling Google Calendar", async () => {
    const response = await DELETE(
      new Request("https://admin.forif.org", { method: "DELETE" }),
      routeParams,
    );

    expect(response.status).toBe(401);
    expect(mockedCalendar).not.toHaveBeenCalled();
  });
});
