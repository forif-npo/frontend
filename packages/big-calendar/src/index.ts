// Types
export type {
  TCalendarView,
  TEventColor,
  TBadgeVariant,
  TWorkingHours,
  TVisibleHours,
} from "./calendar/types";

// Interfaces
export type { IAttendee, IEvent, ICalendarCell } from "./calendar/interfaces";

// Context
export { CalendarProvider, useCalendar } from "./calendar/contexts/calendar-context";

// Main Components
export { ClientContainer as Calendar } from "./calendar/components/client-container";

// View Components
export { CalendarDayView } from "./calendar/components/week-and-day-view/calendar-day-view";
export { CalendarWeekView } from "./calendar/components/week-and-day-view/calendar-week-view";
export { CalendarMonthView } from "./calendar/components/month-view/calendar-month-view";
export { CalendarYearView } from "./calendar/components/year-view/calendar-year-view";
export { CalendarAgendaView } from "./calendar/components/agenda-view/calendar-agenda-view";

// Header Components
export { CalendarHeader } from "./calendar/components/header/calendar-header";
export { DateNavigator } from "./calendar/components/header/date-navigator";
export { TodayButton } from "./calendar/components/header/today-button";
export { UserSelect } from "./calendar/components/header/user-select";

// Dialog Components
export { AddEventDialog } from "./calendar/components/dialogs/add-event-dialog";
export { EditEventDialog } from "./calendar/components/dialogs/edit-event-dialog";
export { EventDetailsDialog } from "./calendar/components/dialogs/event-details-dialog";

// DnD Components
export { DndProviderWrapper } from "./calendar/components/dnd/dnd-provider";

// Helpers
export * from "./calendar/helpers";

// Hooks
export { useAddEvent } from "./calendar/hooks/use-add-event";
export { useUpdateEvent } from "./calendar/hooks/use-update-event";
export { useDeleteEvent } from "./calendar/hooks/use-delete-event";

// Schemas
export * from "./calendar/schemas";

// Mocks
export { USERS_MOCK, CALENDAR_ITEMS_MOCK } from "./calendar/mocks";
