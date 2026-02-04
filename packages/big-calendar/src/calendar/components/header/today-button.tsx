import { useCalendar } from "@big-calendar/calendar/contexts/calendar-context";

import { formatDate } from "@big-calendar/lib/date";

export function TodayButton() {
  const { setSelectedDate } = useCalendar();

  const today = new Date();
  const handleClick = () => setSelectedDate(today);

  return (
    <button
      className="focus-visible:ring-ring flex size-14 flex-col items-start overflow-hidden rounded-lg border focus-visible:outline-none focus-visible:ring-1"
      onClick={handleClick}
    >
      <p className="bg-primary text-primary-foreground flex h-6 w-12 items-center justify-center text-center text-xs font-semibold">
        {formatDate(today, "M월")}
      </p>
      <p className="flex w-full items-center justify-center text-lg font-bold">
        {today.getDate()}
      </p>
    </button>
  );
}
