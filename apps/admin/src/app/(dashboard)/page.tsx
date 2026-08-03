import { CalendarWrapper } from "@/components/calendar-wrapper";
import { PageHeader } from "@/components/page-header";
import { getCalendarData } from "@/lib/calendar";

export default async function Page() {
  const { events, users } = await getCalendarData();

  return (
    <main className="min-h-screen min-w-full p-8">
      <PageHeader
        className="mb-6"
        title="캘린더"
        description="포리프 운영진 공용 캘린더"
      />
      <CalendarWrapper events={events} users={users} defaultView="month" />
    </main>
  );
}
