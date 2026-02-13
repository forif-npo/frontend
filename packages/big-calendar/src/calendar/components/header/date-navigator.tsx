import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";

import { formatDate } from "@big-calendar/lib/date";

import { useCalendar } from "@big-calendar/calendar/contexts/calendar-context";

import { Badge } from "@big-calendar/components/ui/badge";
import { Button } from "@big-calendar/components/ui/button";

import {
  getEventsCount,
  navigateDate,
  rangeText,
} from "@big-calendar/calendar/helpers";

import type { IEvent } from "@big-calendar/calendar/interfaces";
import type { TCalendarView } from "@big-calendar/calendar/types";

interface IProps {
  view: TCalendarView;
  events: IEvent[];
}

export function DateNavigator({ view, events }: IProps) {
  const { selectedDate, setSelectedDate } = useCalendar();

  const month = formatDate(selectedDate, "MMMM");
  const year = selectedDate.getFullYear();

  const eventCount = useMemo(
    () => getEventsCount(events, selectedDate, view),
    [events, selectedDate, view],
  );

  const handlePrevious = () =>
    setSelectedDate(navigateDate(selectedDate, view, "previous"));
  const handleNext = () =>
    setSelectedDate(navigateDate(selectedDate, view, "next"));

  return (
    <div className="space-y-0.5">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold">
          {month} {year}
        </span>
        <Badge variant="outline" className="px-1.5">
          {eventCount}개의 일정
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          className="size-6.5 [&_svg]:size-4.5 px-0"
          onClick={handlePrevious}
        >
          <ChevronLeft />
        </Button>

        <p className="text-muted-foreground text-sm">
          {rangeText(view, selectedDate)}
        </p>

        <Button
          variant="outline"
          className="size-6.5 [&_svg]:size-4.5 px-0"
          onClick={handleNext}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
