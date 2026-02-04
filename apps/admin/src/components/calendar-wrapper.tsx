"use client";

import {
  Calendar,
  CalendarProvider,
  type IEvent,
  type IAttendee,
  type TCalendarView,
} from "@repo/big-calendar";

interface CalendarWrapperProps {
  events: IEvent[];
  users: IAttendee[];
  defaultView?: TCalendarView;
}

export function CalendarWrapper({
  events,
  users,
  defaultView = "month",
}: CalendarWrapperProps) {
  return (
    <CalendarProvider users={users} events={events} defaultView={defaultView}>
      <Calendar />
    </CalendarProvider>
  );
}
