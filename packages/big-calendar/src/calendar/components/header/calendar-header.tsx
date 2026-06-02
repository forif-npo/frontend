"use client";

import {
  Columns,
  Grid3x3,
  List,
  Plus,
  Grid2x2,
  CalendarRange,
} from "lucide-react";

import { useCalendar } from "@big-calendar/calendar/contexts/calendar-context";

import { Button } from "@big-calendar/components/ui/button";

import { UserSelect } from "@big-calendar/calendar/components/header/user-select";
import { TodayButton } from "@big-calendar/calendar/components/header/today-button";
import { DateNavigator } from "@big-calendar/calendar/components/header/date-navigator";
import { AddEventDialog } from "@big-calendar/calendar/components/dialogs/add-event-dialog";

import type { IEvent } from "@big-calendar/calendar/interfaces";
import type { TCalendarView } from "@big-calendar/calendar/types";

interface IProps {
  events: IEvent[];
}

export function CalendarHeader({ events }: IProps) {
  const { view, setView } = useCalendar();

  const viewButtons: {
    view: TCalendarView;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { view: "day", icon: <List strokeWidth={1.8} />, label: "일별 보기" },
    { view: "week", icon: <Columns strokeWidth={1.8} />, label: "주별 보기" },
    { view: "month", icon: <Grid2x2 strokeWidth={1.8} />, label: "월별 보기" },
    { view: "year", icon: <Grid3x3 strokeWidth={1.8} />, label: "연별 보기" },
    {
      view: "agenda",
      icon: <CalendarRange strokeWidth={1.8} />,
      label: "일정 목록",
    },
  ];

  return (
    <div className="flex flex-col gap-4 border-b p-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <TodayButton />
        <DateNavigator view={view} events={events} />
      </div>

      <div className="flex flex-col items-center gap-1.5 sm:flex-row sm:justify-between">
        <div className="flex w-full items-center gap-1.5">
          <div className="inline-flex">
            {viewButtons.map((btn, index) => (
              <Button
                key={btn.view}
                aria-label={btn.label}
                size="icon"
                variant={view === btn.view ? "default" : "outline"}
                className={`[&_svg]:size-5 ${
                  index === 0
                    ? "rounded-r-none"
                    : index === viewButtons.length - 1
                      ? "-ml-px rounded-l-none"
                      : "-ml-px rounded-none"
                }`}
                onClick={() => setView(btn.view)}
              >
                {btn.icon}
              </Button>
            ))}
          </div>

          <UserSelect />
        </div>

        <AddEventDialog>
          <Button className="w-full sm:w-auto">
            <Plus />
            일정 추가
          </Button>
        </AddEventDialog>
      </div>
    </div>
  );
}
