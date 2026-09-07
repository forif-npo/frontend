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
import { GET } from "./route";

const mockedAuth = auth as jest.MockedFunction<typeof auth>;
const mockedCalendar = google.calendar as jest.MockedFunction<
  typeof google.calendar
>;

describe("calendar users route", () => {
  beforeEach(() => {
    mockedAuth.mockReset();
    mockedCalendar.mockReset();
  });

  it("rejects unauthenticated requests before calling Google Calendar", async () => {
    mockedAuth.mockResolvedValue(null as never);

    const response = await GET();

    expect(response.status).toBe(401);
    expect(mockedCalendar).not.toHaveBeenCalled();
  });

  it("keeps the existing attendee filtering and deduplication result", async () => {
    const list = jest.fn(async () => ({
      data: {
        items: [
          {
            attendees: [
              { email: "member@forif.org", displayName: "회원" },
              { email: "resource@forif.org", resource: true },
            ],
            organizer: {
              email: "organizer@forif.org",
              displayName: "주최자",
            },
          },
          {
            attendees: [
              { email: "member@forif.org", displayName: "다른 이름" },
            ],
          },
        ],
      },
    }));
    mockedAuth.mockResolvedValue({ role: "ADMIN" } as never);
    mockedCalendar.mockReturnValue({ events: { list } } as never);

    const response = await GET();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      users: [
        { id: "member@forif.org", name: "회원", picturePath: null },
        { id: "organizer@forif.org", name: "주최자", picturePath: null },
      ],
    });
    expect(list).toHaveBeenCalledWith({
      calendarId: "calendar-id",
      singleEvents: true,
      orderBy: "startTime",
    });
  });
});
