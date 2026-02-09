import { CalendarWrapper } from "@/components/calendar-wrapper";
import { getCalendarData } from "@/lib/calendar";

export default async function Page() {
  const { events, users } = await getCalendarData();

  return (
    <main className="min-h-screen min-w-full p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">캘린더</h1>
        <p className="mt-2 text-gray-600">포리프 운영진 공용 캘린더</p>
      </div>
      <CalendarWrapper events={events} users={users} defaultView="month" />
    </main>
  );
}
