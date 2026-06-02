import { useEffect, useState } from "react";

import { formatDate } from "@big-calendar/lib/date";

interface IProps {
  firstVisibleHour: number;
  lastVisibleHour: number;
}

export function CalendarTimeline({
  firstVisibleHour,
  lastVisibleHour,
}: IProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);

  const getCurrentTimePosition = () => {
    const minutes = currentTime.getHours() * 60 + currentTime.getMinutes();

    const visibleStartMinutes = firstVisibleHour * 60;
    const visibleEndMinutes = lastVisibleHour * 60;
    const visibleRangeMinutes = visibleEndMinutes - visibleStartMinutes;

    return ((minutes - visibleStartMinutes) / visibleRangeMinutes) * 100;
  };

  const formatCurrentTime = () => {
    return formatDate(currentTime, "a h:mm");
  };

  const currentHour = currentTime.getHours();
  if (currentHour < firstVisibleHour || currentHour >= lastVisibleHour)
    return null;

  return (
    <div
      className="border-primary pointer-events-none absolute inset-x-0 z-50 border-t"
      style={{ top: `${getCurrentTimePosition()}%` }}
    >
      <div className="bg-primary absolute left-0 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
      <div className="-left-18 bg-background text-primary absolute flex w-16 -translate-y-1/2 justify-end pr-1 text-xs font-medium">
        {formatCurrentTime()}
      </div>
    </div>
  );
}
