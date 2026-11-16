"use client";
import { useSyncExternalStore } from "react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";

interface Confirmation {
  title: string;
  description: string;
  confirmLabel: string;
}

interface PendingConfirmation extends Confirmation {
  id: number;
  resolve: (confirmed: boolean) => void;
}

const listeners = new Set<() => void>();
const queue: PendingConfirmation[] = [];
let active: PendingConfirmation | null = null;
let nextId = 0;

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function finish(id: number, confirmed: boolean) {
  if (active?.id !== id) return;
  const completed = active;
  active = queue.shift() ?? null;
  emit();
  completed.resolve(confirmed);
}

export function confirmDialog(confirmation: Confirmation): Promise<boolean> {
  return new Promise((resolve) => {
    const request = { ...confirmation, id: ++nextId, resolve };
    if (active) queue.push(request);
    else {
      active = request;
      emit();
    }
  });
}

export function ConfirmDialog() {
  const request = useSyncExternalStore(
    subscribe,
    () => active,
    () => null,
  );

  return (
    <Dialog
      open={request !== null}
      onOpenChange={(open) => {
        if (!open && request) finish(request.id, false);
      }}
    >
      <DialogContent showCloseButton={false} className="gap-2">
        <DialogHeader>
          <DialogTitle>{request?.title}</DialogTitle>
          <DialogDescription className="whitespace-pre-line">
            {request?.description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => request && finish(request.id, false)}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={() => request && finish(request.id, true)}
          >
            {request?.confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
