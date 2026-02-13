import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInDays,
  differenceInMinutes,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isSameDay,
  isSameMonth,
  isSameWeek,
  isSameYear,
  isWithinInterval,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

import type { ICalendarCell, IEvent } from "@big-calendar/calendar/interfaces";
import type {
  TCalendarView,
  TVisibleHours,
  TWorkingHours,
} from "@big-calendar/calendar/types";
import { formatDate, parseToKST } from "@big-calendar/lib/date";

// ================ Header helper functions ================ //

export function rangeText(view: TCalendarView, date: Date) {
  const formatString = "MMM d, yyyy";
  let start: Date;
  let end: Date;

  switch (view) {
    case "agenda":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "year":
      start = startOfYear(date);
      end = endOfYear(date);
      break;
    case "month":
      start = startOfMonth(date);
      end = endOfMonth(date);
      break;
    case "week":
      start = startOfWeek(date);
      end = endOfWeek(date);
      break;
    case "day":
      return formatDate(date, formatString);
    default:
      return "Error while formatting ";
  }

  return `${formatDate(start, formatString)} - ${formatDate(end, formatString)}`;
}

export function navigateDate(
  date: Date,
  view: TCalendarView,
  direction: "previous" | "next",
): Date {
  const operations = {
    agenda: direction === "next" ? addMonths : subMonths,
    year: direction === "next" ? addYears : subYears,
    month: direction === "next" ? addMonths : subMonths,
    week: direction === "next" ? addWeeks : subWeeks,
    day: direction === "next" ? addDays : subDays,
  };

  return operations[view](date, 1);
}

export function getEventsCount(
  events: IEvent[],
  date: Date,
  view: TCalendarView,
): number {
  const compareFns = {
    agenda: isSameMonth,
    year: isSameYear,
    day: isSameDay,
    week: isSameWeek,
    month: isSameMonth,
  };

  return events.filter((event) =>
    compareFns[view](new Date(event.startDate), date),
  ).length;
}

// ================ Week and day view helper functions ================ //

export function getCurrentEvents(events: IEvent[]) {
  const now = new Date();
  return (
    events.filter((event) =>
      isWithinInterval(now, {
        start: parseToKST(event.startDate),
        end: parseToKST(event.endDate),
      }),
    ) || null
  );
}

export function groupEvents(dayEvents: IEvent[]) {
  const sortedEvents = dayEvents.sort(
    (a, b) =>
      parseToKST(a.startDate).getTime() - parseToKST(b.startDate).getTime(),
  );
  const groups: IEvent[][] = [];

  for (const event of sortedEvents) {
    const eventStart = parseToKST(event.startDate);

    let placed = false;
    for (const group of groups) {
      const lastEventInGroup = group[group.length - 1];
      const lastEventEnd = parseToKST(lastEventInGroup.endDate);

      if (eventStart >= lastEventEnd) {
        group.push(event);
        placed = true;
        break;
      }
    }

    if (!placed) groups.push([event]);
  }

  return groups;
}

export function getEventBlockStyle(
  event: IEvent,
  day: Date,
  groupIndex: number,
  groupSize: number,
  visibleHoursRange?: { from: number; to: number },
) {
  const startDate = parseToKST(event.startDate);
  const dayStart = new Date(day.setHours(0, 0, 0, 0));
  const eventStart = startDate < dayStart ? dayStart : startDate;
  const startMinutes = differenceInMinutes(eventStart, dayStart);

  let top;

  if (visibleHoursRange) {
    const visibleStartMinutes = visibleHoursRange.from * 60;
    const visibleEndMinutes = visibleHoursRange.to * 60;
    const visibleRangeMinutes = visibleEndMinutes - visibleStartMinutes;
    top = ((startMinutes - visibleStartMinutes) / visibleRangeMinutes) * 100;
  } else {
    top = (startMinutes / 1440) * 100;
  }

  const width = 100 / groupSize;
  const left = groupIndex * width;

  return { top: `${top}%`, width: `${width}%`, left: `${left}%` };
}

export function isWorkingHour(
  day: Date,
  hour: number,
  workingHours: TWorkingHours,
) {
  const dayIndex = day.getDay() as keyof typeof workingHours;
  const dayHours = workingHours[dayIndex];
  return hour >= dayHours.from && hour < dayHours.to;
}

export function getVisibleHours(
  visibleHours: TVisibleHours,
  singleDayEvents: IEvent[],
) {
  let earliestEventHour = visibleHours.from;
  let latestEventHour = visibleHours.to;

  singleDayEvents.forEach((event) => {
    const startHour = parseToKST(event.startDate).getHours();
    const endTime = parseToKST(event.endDate);
    const endHour = endTime.getHours() + (endTime.getMinutes() > 0 ? 1 : 0);
    if (startHour < earliestEventHour) earliestEventHour = startHour;
    if (endHour > latestEventHour) latestEventHour = endHour;
  });

  latestEventHour = Math.min(latestEventHour, 24);

  const hours = Array.from(
    { length: latestEventHour - earliestEventHour },
    (_, i) => i + earliestEventHour,
  );

  return { hours, earliestEventHour, latestEventHour };
}

// ================ Month view helper functions ================ //

export function getCalendarCells(selectedDate: Date): ICalendarCell[] {
  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
  const daysInPrevMonth = getDaysInMonth(currentYear, currentMonth - 1);
  const totalDays = firstDayOfMonth + daysInMonth;

  const prevMonthCells = Array.from({ length: firstDayOfMonth }, (_, i) => ({
    day: daysInPrevMonth - firstDayOfMonth + i + 1,
    currentMonth: false,
    date: new Date(
      currentYear,
      currentMonth - 1,
      daysInPrevMonth - firstDayOfMonth + i + 1,
    ),
  }));

  const currentMonthCells = Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    currentMonth: true,
    date: new Date(currentYear, currentMonth, i + 1),
  }));

  const nextMonthCells = Array.from(
    { length: (7 - (totalDays % 7)) % 7 },
    (_, i) => ({
      day: i + 1,
      currentMonth: false,
      date: new Date(currentYear, currentMonth + 1, i + 1),
    }),
  );

  return [...prevMonthCells, ...currentMonthCells, ...nextMonthCells];
}

export function calculateMonthEventPositions(
  multiDayEvents: IEvent[],
  singleDayEvents: IEvent[],
  selectedDate: Date,
) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);

  const eventPositions: { [key: string]: number } = {};
  const occupiedPositions: { [key: string]: boolean[] } = {};

  eachDayOfInterval({ start: monthStart, end: monthEnd }).forEach((day) => {
    occupiedPositions[day.toISOString()] = [false, false, false];
  });

  const sortedEvents = [
    ...multiDayEvents.sort((a, b) => {
      const aDuration = differenceInDays(
        parseToKST(a.endDate),
        parseToKST(a.startDate),
      );
      const bDuration = differenceInDays(
        parseToKST(b.endDate),
        parseToKST(b.startDate),
      );
      return (
        bDuration - aDuration ||
        parseToKST(a.startDate).getTime() - parseToKST(b.startDate).getTime()
      );
    }),
    ...singleDayEvents.sort(
      (a, b) =>
        parseToKST(a.startDate).getTime() - parseToKST(b.startDate).getTime(),
    ),
  ];

  sortedEvents.forEach((event) => {
    const eventStart = parseToKST(event.startDate);
    const eventEnd = parseToKST(event.endDate);

    // Use startOfDay to normalize dates for comparison
    const normalizedStart =
      eventStart < monthStart ? monthStart : startOfDay(eventStart);
    const normalizedEnd = eventEnd > monthEnd ? monthEnd : startOfDay(eventEnd);

    const eventDays = eachDayOfInterval({
      start: normalizedStart,
      end: normalizedEnd,
    });

    let position = -1;

    for (let i = 0; i < 3; i++) {
      if (
        eventDays.every((day) => {
          const dayKey = startOfDay(day).toISOString();
          const dayPositions = occupiedPositions[dayKey];
          return dayPositions && !dayPositions[i];
        })
      ) {
        position = i;
        break;
      }
    }

    if (position !== -1) {
      eventDays.forEach((day) => {
        const dayKey = startOfDay(day).toISOString();
        occupiedPositions[dayKey][position] = true;
      });
      eventPositions[event.id] = position;
    }
  });

  return eventPositions;
}

export function getMonthCellEvents(
  date: Date,
  events: IEvent[],
  eventPositions: Record<string, number>,
) {
  // Convert date to KST to ensure consistent timezone comparison
  const cellDateKST = parseToKST(date.toISOString());
  const cellYear = cellDateKST.getFullYear();
  const cellMonth = cellDateKST.getMonth();
  const cellDay = cellDateKST.getDate();

  const eventsForDate = events.filter((event) => {
    const eventStart = parseToKST(event.startDate);
    const eventEnd = parseToKST(event.endDate);

    const startYear = eventStart.getFullYear();
    const startMonth = eventStart.getMonth();
    const startDay = eventStart.getDate();

    const endYear = eventEnd.getFullYear();
    const endMonth = eventEnd.getMonth();
    const endDay = eventEnd.getDate();

    const cellDateNum = cellYear * 10000 + cellMonth * 100 + cellDay;
    const startDateNum = startYear * 10000 + startMonth * 100 + startDay;
    const endDateNum = endYear * 10000 + endMonth * 100 + endDay;

    return cellDateNum >= startDateNum && cellDateNum <= endDateNum;
  });

  const result = eventsForDate
    .map((event) => ({
      ...event,
      position: eventPositions[event.id] ?? -1,
      isMultiDay: event.startDate !== event.endDate,
    }))
    .sort((a, b) => {
      if (a.isMultiDay && !b.isMultiDay) return -1;
      if (!a.isMultiDay && b.isMultiDay) return 1;
      return a.position - b.position;
    });

  return result;
}
