import { env } from "@/env";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import {
  mapEventColorToColorId,
  transformGoogleEventsToIEvents,
} from "./transform";

import type { TEventColor } from "@repo/big-calendar";

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
      // timeMin: new Date().toISOString(),
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = transformGoogleEventsToIEvents(response.data.items);
    return NextResponse.json({ events });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

// 이벤트 생성
export async function POST(req: Request) {
  const { summary, description, start, end, color } = (await req.json()) as {
    summary: string;
    description: string;
    start: string;
    end: string;
    color?: TEventColor;
  };

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });

    const calendar = google.calendar({ version: "v3", auth });

    const event = await calendar.events.insert({
      calendarId: env.GOOGLE_CALENDAR_ID || "primary",
      requestBody: {
        summary,
        description,
        start: { dateTime: start, timeZone: "Asia/Seoul" },
        end: { dateTime: end, timeZone: "Asia/Seoul" },
        colorId: color ? mapEventColorToColorId(color) : undefined,
      },
    });

    return NextResponse.json(event.data);
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
