import { type FocusEvent, useCallback } from "react";
import type {
  FieldPath,
  FieldValues,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

type TimeInputValue = string | number | null | undefined;

function isValidTime(hour: number, minute: number) {
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
}

function formatTime(hour: number, minute: number) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function normalizeTimeInput(value: TimeInputValue) {
  const rawValue = String(value ?? "").trim();

  if (!rawValue) return "";

  if (rawValue.includes(":")) {
    const [rawHour, rawMinute] = rawValue.split(":");

    if (
      rawHour &&
      rawMinute &&
      /^\d{1,2}$/.test(rawHour) &&
      /^\d{1,2}$/.test(rawMinute)
    ) {
      const hour = Number(rawHour);
      const minute = Number(rawMinute);

      if (isValidTime(hour, minute)) return formatTime(hour, minute);
    }

    return rawValue;
  }

  const numbers = rawValue.replace(/\D/g, "");

  if (!numbers || numbers.length > 4) return rawValue;

  const hourText = numbers.length <= 2 ? numbers : numbers.slice(0, -2);
  const minuteText = numbers.length <= 2 ? "00" : numbers.slice(-2);
  const hour = Number(hourText);
  const minute = Number(minuteText);

  if (!isValidTime(hour, minute)) return rawValue;

  return formatTime(hour, minute);
}

export function useTimeInput<TFieldValues extends FieldValues>({
  register,
  setValue,
}: {
  register: UseFormRegister<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
}) {
  const registerTimeInput = useCallback(
    <TName extends FieldPath<TFieldValues>>(name: TName) => {
      const field = register(name, {
        setValueAs: normalizeTimeInput,
      });

      return {
        ...field,
        onBlur: (event: FocusEvent<HTMLInputElement>) => {
          const normalizedValue = normalizeTimeInput(event.target.value);

          if (normalizedValue !== event.target.value) {
            event.target.value = normalizedValue;
            setValue(name, normalizedValue as PathValue<TFieldValues, TName>, {
              shouldDirty: true,
              shouldValidate: true,
            });
          }

          field.onBlur(event);
        },
      };
    },
    [register, setValue],
  );

  return { registerTimeInput };
}
