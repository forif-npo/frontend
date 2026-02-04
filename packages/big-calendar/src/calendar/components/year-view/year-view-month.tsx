import { useMemo } from "react";
import { isSameDay, getDaysInMonth, startOfMonth } from "date-fns";

import { formatDate, parseToKST } from "@big-calendar/lib/date";

import { useCalendar } from "@big-calendar/calendar/contexts/calendar-context";

import { YearViewDayCell } from "@big-calendar/calendar/components/year-view/year-view-day-cell";

import type { IEvent } from "@big-calendar/calendar/interfaces";

interface IProps {
  month: Date;
  events: IEvent[];
}

export function YearViewMonth({ month, events }: IProps) {
  const { setSelectedDate, setView } = useCalendar();

  const monthName = formatDate(month, "MMMM");

  const daysInMonth = useMemo(() => {
    const totalDays = getDaysInMonth(month);
    const firstDay = startOfMonth(month).getDay();

    const days = Array.from({ length: totalDays }, (_, i) => i + 1);
    const blanks = Array(firstDay).fill(null);

    return [...blanks, ...days];
  }, [month]);

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const handleClick = () => {
    setSelectedDate(new Date(month.getFullYear(), month.getMonth(), 1));
    setView("month");
  };

  return (
    <div className="flex flex-col">
      <button
        type="button"
        onClick={handleClick}
        className="w-full rounded-t-lg border px-3 py-2 text-sm font-semibold hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        {monthName}
      </button>

      <div className="flex-1 space-y-2 rounded-b-lg border border-t-0 p-3">
        <div className="grid grid-cols-7 gap-x-0.5 text-center">
          {weekDays.map((day, index) => (
            <div key={index} className="text-xs font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-x-0.5 gap-y-2">
          {daysInMonth.map((day, index) => {
            if (day === null) return <div key={`blank-${index}`} className="h-10" />;

            const date = new Date(month.getFullYear(), month.getMonth(), day);
            const dayEvents = events.filter(event => isSameDay(parseToKST(event.startDate), date) || isSameDay(parseToKST(event.endDate), date));

            return <YearViewDayCell key={`day-${day}`} day={day} date={date} events={dayEvents} />;
          })}
        </div>
      </div>
    </div>
  );
}
