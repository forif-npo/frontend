import { authorizeAdminRequest } from "@/lib/admin-authorization";
import { getCalendarUsers } from "@/lib/calendar-service";
import { NextResponse } from "next/server";

export async function GET() {
  const authorization = await authorizeAdminRequest();
  if (!authorization.authorized) return authorization.response;

  try {
    const users = await getCalendarUsers();

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Calendar Users API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar users" },
      { status: 500 },
    );
  }
}
