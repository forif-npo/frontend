"use client";
import { Check, CircleAlert, Info, X } from "lucide-react";
import { useEffect, useState, useSyncExternalStore } from "react";

type ToastKind = "success" | "error" | "info";

interface ToastOptions {
  description?: string;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: number;
  kind: ToastKind;
  title: string;
}

const emptyToasts: readonly ToastItem[] = [];
const listeners = new Set<() => void>();
let toasts: readonly ToastItem[] = emptyToasts;
let nextId = 0;

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function show(kind: ToastKind, title: string, options: ToastOptions = {}) {
  const duplicate = toasts.find(
    (item) =>
      item.kind === kind &&
      item.title === title &&
      item.description === options.description,
  );
  if (duplicate) return duplicate.id;

  const id = ++nextId;
  toasts = [...toasts, { id, kind, title, ...options }].slice(-3);
  emit();
  return id;
}

export const toast = {
  success: (title: string, options?: ToastOptions) =>
    show("success", title, options),
  error: (title: string, options?: ToastOptions) => show("error", title, options),
  info: (title: string, options?: ToastOptions) => show("info", title, options),
  dismiss: (id: number) => {
    toasts = toasts.filter((item) => item.id !== id);
    emit();
  },
  clear: () => {
    toasts = emptyToasts;
    emit();
  },
};

const icons = { success: Check, error: CircleAlert, info: Info };

function ToastCard({ item }: { item: ToastItem }) {
  const [paused, setPaused] = useState(false);
  const Icon = icons[item.kind];

  useEffect(() => {
    if (paused || item.duration === Infinity) return;
    const timer = window.setTimeout(
      () => toast.dismiss(item.id),
      item.duration ?? (item.kind === "error" ? 8000 : 5000),
    );
    return () => window.clearTimeout(timer);
  }, [paused, item.duration, item.id, item.kind]);

  return (
    <div
      role={item.kind === "error" ? "alert" : "status"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setPaused(false);
        }
      }}
      className="pointer-events-auto flex items-center gap-3 rounded-[var(--radius)] border border-border bg-card px-4 py-3 text-card-foreground shadow-lg"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground">
        <Icon aria-hidden="true" className="size-5" strokeWidth={2} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="whitespace-pre-line break-words text-sm font-semibold leading-5">
          {item.title}
        </p>
        {item.description && (
          <p className="mt-0.5 break-words text-[13px] leading-5 text-muted-foreground">
            {item.description}
          </p>
        )}
      </div>
      <button
        type="button"
        aria-label="알림 닫기"
        onClick={() => toast.dismiss(item.id)}
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X aria-hidden="true" className="size-4" />
      </button>
    </div>
  );
}

export function Toast() {
  const items = useSyncExternalStore(subscribe, () => toasts, () => emptyToasts);

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex flex-col gap-2 sm:inset-x-auto sm:bottom-auto sm:right-6 sm:top-6 sm:w-[min(24rem,calc(100vw-3rem))]">
      {items.map((item) => (
        <ToastCard key={item.id} item={item} />
      ))}
    </div>
  );
}
