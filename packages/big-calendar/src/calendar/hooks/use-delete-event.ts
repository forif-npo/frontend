import { useState } from "react";
import { useCalendar } from "@big-calendar/calendar/contexts/calendar-context";

import type { IEvent } from "@big-calendar/calendar/interfaces";

export function useDeleteEvent() {
  const { setLocalEvents } = useCalendar();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteEvent = async (event: IEvent): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // If we have a Google event ID, delete via API
    if (event.googleEventId) {
      try {
        const response = await fetch(
          `/api/calendar/events/${event.googleEventId}`,
          {
            method: "DELETE",
          },
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to delete event");
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to delete event";
        setError(message);
        console.error("Failed to delete event:", err);
        setIsLoading(false);
        return false;
      }
    }

    // Remove from local state
    setLocalEvents((prev) => prev.filter((e) => e.id !== event.id));

    setIsLoading(false);
    return true;
  };

  return { deleteEvent, isLoading, error };
}
