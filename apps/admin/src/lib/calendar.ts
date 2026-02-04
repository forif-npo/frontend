export async function getCalendarData() {
  const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3001";

  try {
    const [eventsRes, usersRes] = await Promise.all([
      fetch(`${baseUrl}/api/calendar/events`, { cache: "no-store" }),
      fetch(`${baseUrl}/api/calendar/users`, { cache: "no-store" }),
    ]);

    const eventsData = await eventsRes.json();
    const usersData = await usersRes.json();

    return {
      events: eventsData.events || [],
      users: usersData.users || [],
    };
  } catch (error) {
    console.error("Failed to fetch calendar data:", error);
    return {
      events: [],
      users: [],
    };
  }
}
