import { authorizeAdminRequest } from "@/lib/admin-authorization";
import { createCalendarEvent, getCalendarEvents } from "@/lib/calendar-service";
import { NextResponse } from "next/server";
import type { TEventColor } from "@repo/big-calendar";

export async function GET() {
  const authorization = await authorizeAdminRequest();
  if (!authorization.authorized) return authorization.response;

  try {
    const events = await getCalendarEvents();
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
  const authorization = await authorizeAdminRequest();
  if (!authorization.authorized) return authorization.response;

  const { summary, description, start, end, color } = (await req.json()) as {
    summary: string;
    description: string;
    start: string;
    end: string;
    color?: TEventColor;
  };

  try {
    const event = await createCalendarEvent({
      summary,
      description,
      start,
      end,
      color,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
