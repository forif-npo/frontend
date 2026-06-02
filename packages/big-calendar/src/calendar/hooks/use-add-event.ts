import { useState } from "react";
import { useCalendar } from "@big-calendar/calendar/contexts/calendar-context";

import type { IEvent } from "@big-calendar/calendar/interfaces";
import type { TEventColor } from "@big-calendar/calendar/types";

interface AddEventParams {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  color: TEventColor;
  attendees: IEvent["attendees"];
}

export function useAddEvent() {
  const { setLocalEvents, events } = useCalendar();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addEvent = async (params: AddEventParams): Promise<IEvent | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/calendar/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          summary: params.title,
          description: params.description,
          start: params.startDate,
          end: params.endDate,
          color: params.color,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create event");
      }

      const googleEvent = await response.json();

      // Create the local event with the Google event ID
      const newEvent: IEvent = {
        id: Math.max(0, ...events.map((e) => e.id)) + 1,
        googleEventId: googleEvent.id,
        title: params.title,
        description: params.description,
        startDate: params.startDate,
        endDate: params.endDate,
        color: params.color,
        attendees: params.attendees,
        hangoutLink: googleEvent.hangoutLink,
      };

      setLocalEvents((prev) => [...prev, newEvent]);

      return newEvent;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create event";
      setError(message);
      console.error("Failed to add event:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { addEvent, isLoading, error };
}
