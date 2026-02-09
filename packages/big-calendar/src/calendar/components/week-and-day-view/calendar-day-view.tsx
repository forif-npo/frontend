import { areIntervalsOverlapping } from "date-fns";
import { Calendar, Clock, User } from "lucide-react";

import { formatDate, parseToKST } from "@big-calendar/lib/date";

import { useCalendar } from "@big-calendar/calendar/contexts/calendar-context";

import { ScrollArea } from "@big-calendar/components/ui/scroll-area";
import { SingleCalendar } from "@big-calendar/components/ui/single-calendar";

import { AddEventDialog } from "@big-calendar/calendar/components/dialogs/add-event-dialog";
import { DroppableTimeBlock } from "@big-calendar/calendar/components/dnd/droppable-time-block";
import { CalendarTimeline } from "@big-calendar/calendar/components/week-and-day-view/calendar-time-line";
import { DayViewMultiDayEventsRow } from "@big-calendar/calendar/components/week-and-day-view/day-view-multi-day-events-row";
import { EventBlock } from "@big-calendar/calendar/components/week-and-day-view/event-block";

import {
  getCurrentEvents,
  getEventBlockStyle,
  getVisibleHours,
  groupEvents,
  isWorkingHour,
} from "@big-calendar/calendar/helpers";
import { cn } from "@big-calendar/lib/utils";

import type { IEvent } from "@big-calendar/calendar/interfaces";

interface IProps {
  singleDayEvents: IEvent[];
  multiDayEvents: IEvent[];
}

export function CalendarDayView({ singleDayEvents, multiDayEvents }: IProps) {
  const { selectedDate, setSelectedDate, visibleHours, workingHours } =
    useCalendar();

  const { hours, earliestEventHour, latestEventHour } = getVisibleHours(
    visibleHours,
    singleDayEvents,
  );

  const currentEvents = getCurrentEvents(singleDayEvents);

  const dayEvents = singleDayEvents.filter((event) => {
    const eventDate = parseToKST(event.startDate);
    return (
      eventDate.getDate() === selectedDate.getDate() &&
      eventDate.getMonth() === selectedDate.getMonth() &&
      eventDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  const groupedEvents = groupEvents(dayEvents);

  return (
    <div className="flex">
      <div className="flex flex-1 flex-col">
        <div>
          <DayViewMultiDayEventsRow
            selectedDate={selectedDate}
            multiDayEvents={multiDayEvents}
          />

          {/* Day header */}
          <div className="relative z-20 flex border-b">
            <div className="w-18"></div>
            <span className="text-muted-foreground flex-1 border-l py-2 text-center text-xs font-medium">
              {formatDate(selectedDate, "EEE")}{" "}
              <span className="text-foreground font-semibold">
                {formatDate(selectedDate, "d")}
              </span>
            </span>
          </div>
        </div>

        <ScrollArea className="h-[800px]" type="always">
          <div className="flex">
            {/* Hours column */}
            <div className="w-18 relative">
              {hours.map((hour, index) => (
                <div key={hour} className="relative" style={{ height: "96px" }}>
                  <div className="absolute -top-3 right-2 flex h-6 items-center">
                    {index !== 0 && (
                      <span className="text-muted-foreground text-xs">
                        {formatDate(
                          new Date().setHours(hour, 0, 0, 0),
                          "a hh시",
                        )}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Day grid */}
            <div className="relative flex-1 border-l">
              <div className="relative">
                {hours.map((hour, index) => {
                  const isDisabled = !isWorkingHour(
                    selectedDate,
                    hour,
                    workingHours,
                  );

                  return (
                    <div
                      key={hour}
                      className={cn(
                        "relative",
                        isDisabled && "bg-calendar-disabled-hour",
                      )}
                      style={{ height: "96px" }}
                    >
                      {index !== 0 && (
                        <div className="pointer-events-none absolute inset-x-0 top-0 border-b"></div>
                      )}

                      <DroppableTimeBlock
                        date={selectedDate}
                        hour={hour}
                        minute={0}
                      >
                        <AddEventDialog
                          startDate={selectedDate}
                          startTime={{ hour, minute: 0 }}
                        >
                          <div className="hover:bg-accent absolute inset-x-0 top-0 h-[24px] cursor-pointer transition-colors" />
                        </AddEventDialog>
                      </DroppableTimeBlock>

                      <DroppableTimeBlock
                        date={selectedDate}
                        hour={hour}
                        minute={15}
                      >
                        <AddEventDialog
                          startDate={selectedDate}
                          startTime={{ hour, minute: 15 }}
                        >
                          <div className="hover:bg-accent absolute inset-x-0 top-[24px] h-[24px] cursor-pointer transition-colors" />
                        </AddEventDialog>
                      </DroppableTimeBlock>

                      <div className="pointer-events-none absolute inset-x-0 top-1/2 border-b border-dashed"></div>

                      <DroppableTimeBlock
                        date={selectedDate}
                        hour={hour}
                        minute={30}
                      >
                        <AddEventDialog
                          startDate={selectedDate}
                          startTime={{ hour, minute: 30 }}
                        >
                          <div className="hover:bg-accent absolute inset-x-0 top-[48px] h-[24px] cursor-pointer transition-colors" />
                        </AddEventDialog>
                      </DroppableTimeBlock>

                      <DroppableTimeBlock
                        date={selectedDate}
                        hour={hour}
                        minute={45}
                      >
                        <AddEventDialog
                          startDate={selectedDate}
                          startTime={{ hour, minute: 45 }}
                        >
                          <div className="hover:bg-accent absolute inset-x-0 top-[72px] h-[24px] cursor-pointer transition-colors" />
                        </AddEventDialog>
                      </DroppableTimeBlock>
                    </div>
                  );
                })}

                {groupedEvents.map((group, groupIndex) =>
                  group.map((event) => {
                    let style = getEventBlockStyle(
                      event,
                      selectedDate,
                      groupIndex,
                      groupedEvents.length,
                      { from: earliestEventHour, to: latestEventHour },
                    );
                    const hasOverlap = groupedEvents.some(
                      (otherGroup, otherIndex) =>
                        otherIndex !== groupIndex &&
                        otherGroup.some((otherEvent) =>
                          areIntervalsOverlapping(
                            {
                              start: parseToKST(event.startDate),
                              end: parseToKST(event.endDate),
                            },
                            {
                              start: parseToKST(otherEvent.startDate),
                              end: parseToKST(otherEvent.endDate),
                            },
                          ),
                        ),
                    );

                    if (!hasOverlap)
                      style = { ...style, width: "100%", left: "0%" };

                    return (
                      <div
                        key={event.id}
                        className="absolute p-1"
                        style={style}
                      >
                        <EventBlock event={event} />
                      </div>
                    );
                  }),
                )}
              </div>

              <CalendarTimeline
                firstVisibleHour={earliestEventHour}
                lastVisibleHour={latestEventHour}
              />
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="hidden w-64 divide-y border-l md:block">
        <SingleCalendar
          className="mx-auto w-fit"
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          initialFocus
        />

        <div className="flex-1 space-y-3">
          {currentEvents.length > 0 ? (
            <div className="flex items-start gap-2 px-4 pt-4">
              <span className="relative mt-[5px] flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-green-600"></span>
              </span>

              <p className="text-foreground text-sm font-semibold">진행 중</p>
            </div>
          ) : (
            <p className="text-muted-foreground p-4 text-center text-sm italic">
              일정이 없습니다
            </p>
          )}

          {currentEvents.length > 0 && (
            <ScrollArea className="h-[422px] px-4" type="always">
              <div className="space-y-6 pb-4">
                {currentEvents.map((event) => {
                  return (
                    <div key={event.id} className="space-y-1.5">
                      <p className="line-clamp-2 text-sm font-semibold">
                        {event.title}
                      </p>

                      {event.attendees.length > 0 && (
                        <div className="text-muted-foreground flex items-center gap-1.5">
                          <User className="size-3.5" />
                          <span className="text-sm">
                            {event.attendees.map((a) => a.name).join(", ")}
                          </span>
                        </div>
                      )}

                      <div className="text-muted-foreground flex items-center gap-1.5">
                        <Calendar className="size-3.5" />
                        <span className="text-sm">
                          {formatDate(new Date(), "yyyy년 M월 d일")}
                        </span>
                      </div>

                      <div className="text-muted-foreground flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        <span className="text-sm">
                          {formatDate(parseToKST(event.startDate), "a h:mm")} -{" "}
                          {formatDate(parseToKST(event.endDate), "a h:mm")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}
        </div>
      </div>
    </div>
  );
}
