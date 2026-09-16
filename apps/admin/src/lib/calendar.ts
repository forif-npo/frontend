import { getCalendarEvents, getCalendarUsers } from "@/lib/calendar-service";

export async function getCalendarData() {
  try {
    const [events, users] = await Promise.all([
      getCalendarEvents(),
      getCalendarUsers(),
    ]);

    return { events, users };
  } catch (error) {
    console.error("Failed to fetch calendar data:", error);
    return {
      events: [],
      users: [],
    };
  }
}
