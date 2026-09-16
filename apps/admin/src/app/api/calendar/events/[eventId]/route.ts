import { authorizeAdminRequest } from "@/lib/admin-authorization";
import {
  deleteCalendarEvent,
  getCalendarEvent,
  updateCalendarEvent,
} from "@/lib/calendar-service";
import { NextResponse } from "next/server";
import type { TEventColor } from "@repo/big-calendar";

interface RouteParams {
  params: Promise<{ eventId: string }>;
}

// 이벤트 수정 (PATCH)
export async function PATCH(req: Request, { params }: RouteParams) {
  const authorization = await authorizeAdminRequest();
  if (!authorization.authorized) return authorization.response;

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

    const event = await updateCalendarEvent(eventId, {
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
      { error: "Failed to update event" },
      { status: 500 },
    );
  }
}

// 이벤트 삭제 (DELETE)
export async function DELETE(_req: Request, { params }: RouteParams) {
  const authorization = await authorizeAdminRequest();
  if (!authorization.authorized) return authorization.response;

  const { eventId } = await params;

  try {
    await deleteCalendarEvent(eventId);

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
  const authorization = await authorizeAdminRequest();
  if (!authorization.authorized) return authorization.response;

  const { eventId } = await params;

  try {
    const event = await getCalendarEvent(eventId);
    return NextResponse.json(event);
  } catch (error) {
    console.error("Calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 },
    );
  }
}
