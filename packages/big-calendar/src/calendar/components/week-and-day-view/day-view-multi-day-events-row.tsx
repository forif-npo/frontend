import { differenceInDays, endOfDay, isWithinInterval, startOfDay } from "date-fns";

import { MonthEventBadge } from "@big-calendar/calendar/components/month-view/month-event-badge";

import type { IEvent } from "@big-calendar/calendar/interfaces";
import { parseToKST } from "@big-calendar/lib/date";

interface IProps {
  selectedDate: Date;
  multiDayEvents: IEvent[];
}

export function DayViewMultiDayEventsRow({ selectedDate, multiDayEvents }: IProps) {
  const dayStart = startOfDay(selectedDate);
  const dayEnd = endOfDay(selectedDate);

  const multiDayEventsInDay = multiDayEvents
    .filter(event => {
      const eventStart = parseToKST(event.startDate);
      const eventEnd = parseToKST(event.endDate);

      const isOverlapping =
        isWithinInterval(dayStart, { start: eventStart, end: eventEnd }) ||
        isWithinInterval(dayEnd, { start: eventStart, end: eventEnd }) ||
        (eventStart <= dayStart && eventEnd >= dayEnd);

      return isOverlapping;
    })
    .sort((a, b) => {
      const durationA = differenceInDays(parseToKST(a.endDate), parseToKST(a.startDate));
      const durationB = differenceInDays(parseToKST(b.endDate), parseToKST(b.startDate));
      return durationB - durationA;
    });

  if (multiDayEventsInDay.length === 0) return null;

  return (
    <div className="flex border-b">
      <div className="w-18"></div>
      <div className="flex flex-1 flex-col gap-1 border-l py-1">
        {multiDayEventsInDay.map(event => {
          const eventStart = startOfDay(parseToKST(event.startDate));
          const eventEnd = startOfDay(parseToKST(event.endDate));
          const currentDate = startOfDay(selectedDate);

          const eventTotalDays = differenceInDays(eventEnd, eventStart) + 1;
          const eventCurrentDay = differenceInDays(currentDate, eventStart) + 1;

          return <MonthEventBadge key={event.id} event={event} cellDate={selectedDate} eventCurrentDay={eventCurrentDay} eventTotalDays={eventTotalDays} className="flex" />;
        })}
      </div>
    </div>
  );
}
