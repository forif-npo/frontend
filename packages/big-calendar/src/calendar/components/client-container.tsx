"use client";

import { isSameDay } from "date-fns";
import { useMemo } from "react";

import { useCalendar } from "@big-calendar/calendar/contexts/calendar-context";
import { parseToKST } from "@big-calendar/lib/date";

import { DndProviderWrapper } from "@big-calendar/calendar/components/dnd/dnd-provider";

import { CalendarAgendaView } from "@big-calendar/calendar/components/agenda-view/calendar-agenda-view";
import { CalendarHeader } from "@big-calendar/calendar/components/header/calendar-header";
import { CalendarMonthView } from "@big-calendar/calendar/components/month-view/calendar-month-view";
import { CalendarDayView } from "@big-calendar/calendar/components/week-and-day-view/calendar-day-view";
import { CalendarWeekView } from "@big-calendar/calendar/components/week-and-day-view/calendar-week-view";
import { CalendarYearView } from "@big-calendar/calendar/components/year-view/calendar-year-view";

export function ClientContainer() {
  const { view, selectedDate, selectedUserId, events } = useCalendar();

  const filteredEvents = useMemo(() => {
    const selectedDateKST = parseToKST(selectedDate.toISOString());

    return events.filter((event) => {
      const eventStartDate = parseToKST(event.startDate);
      const eventEndDate = parseToKST(event.endDate);

      if (view === "year") {
        const yearStart = new Date(selectedDateKST.getFullYear(), 0, 1);
        const yearEnd = new Date(
          selectedDateKST.getFullYear(),
          11,
          31,
          23,
          59,
          59,
          999,
        );
        const isInSelectedYear =
          eventStartDate <= yearEnd && eventEndDate >= yearStart;
        const isUserMatch =
          selectedUserId === "all" ||
          event.attendees.some((a) => a.id === selectedUserId);
        return isInSelectedYear && isUserMatch;
      }

      if (view === "month" || view === "agenda") {
        const monthStart = new Date(
          selectedDateKST.getFullYear(),
          selectedDateKST.getMonth(),
          1,
        );
        const monthEnd = new Date(
          selectedDateKST.getFullYear(),
          selectedDateKST.getMonth() + 1,
          0,
          23,
          59,
          59,
          999,
        );
        const isInSelectedMonth =
          eventStartDate <= monthEnd && eventEndDate >= monthStart;
        const isUserMatch =
          selectedUserId === "all" ||
          event.attendees.some((a) => a.id === selectedUserId);
        return isInSelectedMonth && isUserMatch;
      }

      if (view === "week") {
        const dayOfWeek = selectedDateKST.getDay();
        const weekStart = new Date(selectedDateKST);
        weekStart.setDate(selectedDateKST.getDate() - dayOfWeek);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);
        const isInSelectedWeek =
          eventStartDate <= weekEnd && eventEndDate >= weekStart;
        const isUserMatch =
          selectedUserId === "all" ||
          event.attendees.some((a) => a.id === selectedUserId);
        return isInSelectedWeek && isUserMatch;
      }

      if (view === "day") {
        const dayStart = new Date(
          selectedDateKST.getFullYear(),
          selectedDateKST.getMonth(),
          selectedDateKST.getDate(),
          0,
          0,
          0,
        );
        const dayEnd = new Date(
          selectedDateKST.getFullYear(),
          selectedDateKST.getMonth(),
          selectedDateKST.getDate(),
          23,
          59,
          59,
        );
        const isInSelectedDay =
          eventStartDate <= dayEnd && eventEndDate >= dayStart;
        const isUserMatch =
          selectedUserId === "all" ||
          event.attendees.some((a) => a.id === selectedUserId);
        return isInSelectedDay && isUserMatch;
      }
    });
  }, [selectedDate, selectedUserId, events, view]);

  const singleDayEvents = filteredEvents.filter((event) => {
    const startDate = parseToKST(event.startDate);
    const endDate = parseToKST(event.endDate);
    return isSameDay(startDate, endDate);
  });

  const multiDayEvents = filteredEvents.filter((event) => {
    const startDate = parseToKST(event.startDate);
    const endDate = parseToKST(event.endDate);
    return !isSameDay(startDate, endDate);
  });

  const eventStartDates = useMemo(() => {
    return filteredEvents.map((event) => ({
      ...event,
      endDate: event.startDate,
    }));
  }, [filteredEvents]);

  return (
    <div className="overflow-hidden rounded-xl border">
      <CalendarHeader events={filteredEvents} />

      <DndProviderWrapper>
        {view === "day" && (
          <CalendarDayView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "month" && (
          <CalendarMonthView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "week" && (
          <CalendarWeekView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
        {view === "year" && <CalendarYearView allEvents={eventStartDates} />}
        {view === "agenda" && (
          <CalendarAgendaView
            singleDayEvents={singleDayEvents}
            multiDayEvents={multiDayEvents}
          />
        )}
      </DndProviderWrapper>
    </div>
  );
}
