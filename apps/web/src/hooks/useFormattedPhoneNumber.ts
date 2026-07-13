import { useMemo } from "react";

type PhoneNumberValue = string | number | null | undefined;

export function formatPhoneNumber(value: PhoneNumberValue) {
  const numbers = String(value ?? "").replace(/\D/g, "");

  if (!numbers) return "";
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;

  return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(
    7,
    11,
  )}`;
}

export function useFormattedPhoneNumber(value: PhoneNumberValue) {
  return useMemo(() => formatPhoneNumber(value), [value]);
}
