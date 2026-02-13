"use client";

import { Calendar, Clock, Text, User, Video } from "lucide-react";
import { useState } from "react";

import { formatDate, parseToKST } from "@big-calendar/lib/date";

import { EditEventDialog } from "@big-calendar/calendar/components/dialogs/edit-event-dialog";
import { useDeleteEvent } from "@big-calendar/calendar/hooks/use-delete-event";
import { Button } from "@big-calendar/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@big-calendar/components/ui/dialog";

import type { IEvent } from "@big-calendar/calendar/interfaces";

interface IProps {
  event: IEvent;
  children: React.ReactNode;
}

export function EventDetailsDialog({ event, children }: IProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { deleteEvent, isLoading: isDeleting } = useDeleteEvent();

  const startDate = parseToKST(event.startDate);
  const endDate = parseToKST(event.endDate);

  const handleDelete = async () => {
    const success = await deleteEvent(event);
    if (success) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{event.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex items-start gap-2">
              <User className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">참여자</p>
                <p className="text-muted-foreground text-sm">
                  {event.attendees.map((a) => a.name).join(", ")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Calendar className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">시작일</p>
                <p className="text-muted-foreground text-sm">
                  {formatDate(startDate, "yyyy년 M월 d일 a h:mm")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Clock className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">종료일</p>
                <p className="text-muted-foreground text-sm">
                  {formatDate(endDate, "yyyy년 M월 d일 a h:mm")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2">
              <Text className="mt-1 size-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">설명</p>
                <p className="text-muted-foreground text-sm">
                  {event.description}
                </p>
              </div>
            </div>

            {event.hangoutLink && (
              <div className="flex items-start gap-2">
                <Video className="mt-1 size-4 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Google Meet</p>
                  <a
                    href={event.hangoutLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                  >
                    {event.hangoutLink}
                  </a>
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <EditEventDialog event={event}>
              <Button type="button" variant="outline">
                Edit
              </Button>
            </EditEventDialog>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
