import type { TEventColor } from "@big-calendar/calendar/types";

export interface IAttendee {
  id: string;
  name: string;
  picturePath: string | null;
}

export interface IEvent {
  id: number;
  googleEventId?: string;
  startDate: string;
  endDate: string;
  title: string;
  color: TEventColor;
  description: string;
  attendees: IAttendee[];
  hangoutLink?: string;
}

export interface ICalendarCell {
  day: number;
  currentMonth: boolean;
  date: Date;
}
