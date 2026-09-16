import { describe, expect, it, jest } from "@jest/globals";

jest.mock("@/auth", () => ({ auth: jest.fn() }));
jest.mock("@/lib/calendar-service", () => ({
  createCalendarEvent: jest.fn(),
  deleteCalendarEvent: jest.fn(),
  getCalendarEvent: jest.fn(),
  getCalendarEvents: jest.fn(),
  getCalendarUsers: jest.fn(),
  updateCalendarEvent: jest.fn(),
}));

import { auth } from "@/auth";
import {
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvent,
  getCalendarEvents,
  getCalendarUsers,
  updateCalendarEvent,
} from "@/lib/calendar-service";
import { GET as getEvents, POST as postEvent } from "./events/route";
import {
  DELETE as deleteEvent,
  GET as getEvent,
  PATCH as patchEvent,
} from "./events/[eventId]/route";
import { GET as getUsers } from "./users/route";

const mockedAuth = auth as unknown as jest.MockedFunction<
  () => Promise<unknown>
>;
const serviceMethods = [
  createCalendarEvent,
  deleteCalendarEvent,
  getCalendarEvent,
  getCalendarEvents,
  getCalendarUsers,
  updateCalendarEvent,
] as const;
const eventContext = { params: Promise.resolve({ eventId: "event-id" }) };

describe("calendar API authorization", () => {
  it("blocks every calendar endpoint before it invokes Google Calendar", async () => {
    mockedAuth.mockResolvedValue(null);

    const responses = await Promise.all([
      getEvents(),
      postEvent(
        new Request("https://admin.forif.org/api/calendar/events", {
          method: "POST",
          body: JSON.stringify({}),
        }),
      ),
      getUsers(),
      getEvent(new Request("https://admin.forif.org"), eventContext),
      patchEvent(
        new Request("https://admin.forif.org", {
          method: "PATCH",
          body: JSON.stringify({}),
        }),
        eventContext,
      ),
      deleteEvent(new Request("https://admin.forif.org"), eventContext),
    ]);

    for (const response of responses) {
      expect(response.status).toBe(401);
    }
    for (const method of serviceMethods) {
      expect(method).not.toHaveBeenCalled();
    }
  });

  it("rejects an authenticated non-admin user", async () => {
    mockedAuth.mockResolvedValue({ role: "USER" } as never);

    const response = await getEvents();

    expect(response.status).toBe(403);
    expect(getCalendarEvents).not.toHaveBeenCalled();
  });
});
