import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function requireCalendarAdmin(): Promise<NextResponse | null> {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.role !== "ADMIN" || session.error) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return null;
}
