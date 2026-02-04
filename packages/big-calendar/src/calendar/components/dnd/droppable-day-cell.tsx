"use client";

import { differenceInMilliseconds } from "date-fns";
import { useDrop } from "react-dnd";

import { useUpdateEvent } from "@big-calendar/calendar/hooks/use-update-event";

import { ItemTypes } from "@big-calendar/calendar/components/dnd/draggable-event";
import { cn } from "@big-calendar/lib/utils";

import type { ICalendarCell, IEvent } from "@big-calendar/calendar/interfaces";
import { parseToKST } from "@big-calendar/lib/date";

interface DroppableDayCellProps {
  cell: ICalendarCell;
  children: React.ReactNode;
}

export function DroppableDayCell({ cell, children }: DroppableDayCellProps) {
  const { updateEvent } = useUpdateEvent();

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: ItemTypes.EVENT,
      drop: (item: { event: IEvent }) => {
        const droppedEvent = item.event;

        const eventStartDate = parseToKST(droppedEvent.startDate);
        const eventEndDate = parseToKST(droppedEvent.endDate);

        const eventDurationMs = differenceInMilliseconds(
          eventEndDate,
          eventStartDate,
        );

        const newStartDate = new Date(cell.date);
        newStartDate.setHours(
          eventStartDate.getHours(),
          eventStartDate.getMinutes(),
          eventStartDate.getSeconds(),
          eventStartDate.getMilliseconds(),
        );
        const newEndDate = new Date(newStartDate.getTime() + eventDurationMs);

        updateEvent({
          ...droppedEvent,
          startDate: newStartDate.toISOString(),
          endDate: newEndDate.toISOString(),
        });

        return { moved: true };
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [cell.date, updateEvent],
  );

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={cn(isOver && canDrop && "bg-accent/50")}
    >
      {children}
    </div>
  );
}
