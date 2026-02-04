"use client";

import { differenceInMilliseconds } from "date-fns";
import { useDrop } from "react-dnd";

import { useUpdateEvent } from "@big-calendar/calendar/hooks/use-update-event";

import { ItemTypes } from "@big-calendar/calendar/components/dnd/draggable-event";
import { cn } from "@big-calendar/lib/utils";

import type { IEvent } from "@big-calendar/calendar/interfaces";
import { parseToKST } from "@big-calendar/lib/date";

interface DroppableTimeBlockProps {
  date: Date;
  hour: number;
  minute: number;
  children: React.ReactNode;
}

export function DroppableTimeBlock({
  date,
  hour,
  minute,
  children,
}: DroppableTimeBlockProps) {
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

        const newStartDate = new Date(date);
        newStartDate.setHours(hour, minute, 0, 0);
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
    [date, hour, minute, updateEvent],
  );

  return (
    <div
      ref={drop as unknown as React.RefObject<HTMLDivElement>}
      className={cn("h-[24px]", isOver && canDrop && "bg-accent/50")}
    >
      {children}
    </div>
  );
}
