import { env } from "@/env";
import { google } from "googleapis";
import { NextResponse } from "next/server";
import { mapEventColorToColorId } from "../transform";

import type { TEventColor } from "@repo/big-calendar";

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

function getCalendarAuth() {
  return new google.auth.GoogleAuth({
    credentials: {
      client_email: env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/calendar"],
  });
}

// 이벤트 수정 (PATCH)
export async function PATCH(req: Request, { params }: RouteParams) {
  const { eventId } = await params;

  try {
    const body = await req.json();
    const { summary, description, start, end, color } = body as {
      summary?: string;
      description?: string;
      start?: string;
      end?: string;
      color?: TEventColor;
    };

    const auth = getCalendarAuth();
    const calendar = google.calendar({ version: "v3", auth });

    // Build the update payload with only provided fields
    const updatePayload: {
      summary?: string;
      description?: string;
      start?: { dateTime: string; timeZone: string };
      end?: { dateTime: string; timeZone: string };
      colorId?: string;
    } = {};

    if (summary !== undefined) {
      updatePayload.summary = summary;
    }
    if (description !== undefined) {
      updatePayload.description = description;
    }
    if (start !== undefined) {
      updatePayload.start = { dateTime: start, timeZone: "Asia/Seoul" };
    }
    if (end !== undefined) {
      updatePayload.end = { dateTime: end, timeZone: "Asia/Seoul" };
    }
    if (color !== undefined) {
      updatePayload.colorId = mapEventColorToColorId(color);
    }

    const event = await calendar.events.patch({
      calendarId: env.GOOGLE_CALENDAR_ID || "primary",
      eventId,
      requestBody: updatePayload,
    });

    return NextResponse.json(event.data);
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 },
    );
  }
}

// 이벤트 삭제 (DELETE)
export async function DELETE(_req: Request, { params }: RouteParams) {
  const { eventId } = await params;

  try {
    const auth = getCalendarAuth();
    const calendar = google.calendar({ version: "v3", auth });

    await calendar.events.delete({
      calendarId: env.GOOGLE_CALENDAR_ID || "primary",
      eventId,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 },
    );
  }
}

// 개별 이벤트 조회 (GET)
export async function GET(_req: Request, { params }: RouteParams) {
  const { eventId } = await params;

  try {
    const auth = getCalendarAuth();
    const calendar = google.calendar({ version: "v3", auth });

    const event = await calendar.events.get({
      calendarId: env.GOOGLE_CALENDAR_ID || "primary",
      eventId,
    });

    return NextResponse.json(event.data);
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}
