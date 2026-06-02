import { useState } from "react";
import { useCalendar } from "@big-calendar/calendar/contexts/calendar-context";

import type { IEvent } from "@big-calendar/calendar/interfaces";

export function useUpdateEvent() {
  const { setLocalEvents } = useCalendar();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateEvent = async (event: IEvent): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    const newEvent: IEvent = {
      ...event,
      startDate: new Date(event.startDate).toISOString(),
      endDate: new Date(event.endDate).toISOString(),
    };

    // If we have a Google event ID, update via API
    if (event.googleEventId) {
      try {
        const response = await fetch(
          `/api/calendar/events/${event.googleEventId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              summary: event.title,
              description: event.description,
              start: newEvent.startDate,
              end: newEvent.endDate,
              color: event.color,
            }),
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update event");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to update event";
        setError(message);
        console.error("Failed to update event:", err);
        setIsLoading(false);
        return false;
      }
    }

    // Update local state
    setLocalEvents((prev) => {
      const index = prev.findIndex((e) => e.id === event.id);
      if (index === -1) return prev;
      return [...prev.slice(0, index), newEvent, ...prev.slice(index + 1)];
    });

    setIsLoading(false);
    return true;
  };

  return { updateEvent, isLoading, error };
}
