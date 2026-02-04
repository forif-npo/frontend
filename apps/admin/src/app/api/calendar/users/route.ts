import { env } from "@/env";
import type { IAttendee } from "@repo/big-calendar";
import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const response = await calendar.events.list({
      calendarId: env.GOOGLE_CALENDAR_ID || "primary",
      singleEvents: true,
      orderBy: "startTime",
    });

    const userMap = new Map<string, IAttendee>();

    response.data.items?.forEach((event) => {
      event.attendees?.forEach((attendee) => {
        if (attendee.email && !attendee.resource) {
          const email = attendee.email;
          if (!userMap.has(email)) {
            userMap.set(email, {
              id: email,
              name: attendee.displayName || email,
              picturePath: null,
            });
          }
        }
      });

      if (event.organizer?.email && !userMap.has(event.organizer.email)) {
        const email = event.organizer.email;
        userMap.set(email, {
          id: email,
          name: event.organizer.displayName || email,
          picturePath: null,
        });
      }
    });

    const users: IAttendee[] = Array.from(userMap.values());

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Calendar Users API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar users" },
      { status: 500 },
    );
  }
}
