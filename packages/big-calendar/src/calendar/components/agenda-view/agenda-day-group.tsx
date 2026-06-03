import { differenceInDays, startOfDay } from "date-fns";

import { formatDate, parseToKST } from "@big-calendar/lib/date";

import { AgendaEventCard } from "@big-calendar/calendar/components/agenda-view/agenda-event-card";

import type { IEvent } from "@big-calendar/calendar/interfaces";

interface IProps {
  date: Date;
  events: IEvent[];
  multiDayEvents: IEvent[];
}

export function AgendaDayGroup({ date, events, multiDayEvents }: IProps) {
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
  );

  return (
    <div className="space-y-4">
      <div className="bg-background sticky top-0 flex items-center gap-4 py-2">
        <p className="text-sm font-semibold">
          {formatDate(date, "yyyy년 M월 d일 EEEE")}
        </p>
      </div>

      <div className="space-y-2">
        {multiDayEvents.length > 0 &&
          multiDayEvents.map((event) => {
            const eventStart = startOfDay(parseToKST(event.startDate));
            const eventEnd = startOfDay(parseToKST(event.endDate));
            const currentDate = startOfDay(date);

            const eventTotalDays = differenceInDays(eventEnd, eventStart) + 1;
            const eventCurrentDay =
              differenceInDays(currentDate, eventStart) + 1;
            return (
              <AgendaEventCard
                key={event.id}
                event={event}
                eventCurrentDay={eventCurrentDay}
                eventTotalDays={eventTotalDays}
              />
            );
          })}

        {sortedEvents.length > 0 &&
          sortedEvents.map((event) => (
            <AgendaEventCard key={event.id} event={event} />
          ))}
      </div>
    </div>
  );
}
