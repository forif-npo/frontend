import { auth } from "@/auth";
import { NextResponse } from "next/server";

type AdminAuthorization =
  | { authorized: true }
  | { authorized: false; response: NextResponse };

/**
 * Route handlers are excluded from the middleware matcher, so they must
 * enforce the admin session boundary themselves.
 */
export async function authorizeAdminRequest(): Promise<AdminAuthorization> {
  try {
    const session = await auth();

    if (!session || session.error) {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Authentication required" },
          { status: 401 },
        ),
      };
    }

    if (session.role !== "ADMIN") {
      return {
        authorized: false,
        response: NextResponse.json(
          { error: "Admin access required" },
          { status: 403 },
        ),
      };
    }

    return { authorized: true };
  } catch (error) {
    console.error("Admin API authorization failed:", error);
    return {
      authorized: false,
      response: NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      ),
    };
  }
}
