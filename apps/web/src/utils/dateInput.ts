type DateInputValue = string | number | null | undefined;

const SHORT_DATE_LENGTH = 6;
const FULL_DATE_LENGTH = 8;

function toShortDateParts(value: DateInputValue) {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) return null;

  const numbers = rawValue.replace(/\D/g, "");

  if (numbers.length === SHORT_DATE_LENGTH) {
    return {
      year: 2000 + Number(numbers.slice(0, 2)),
      month: Number(numbers.slice(2, 4)),
      day: Number(numbers.slice(4, 6)),
    };
  }

  if (numbers.length === FULL_DATE_LENGTH) {
    return {
      year: Number(numbers.slice(0, 4)),
      month: Number(numbers.slice(4, 6)),
      day: Number(numbers.slice(6, 8)),
    };
  }

  return null;
}

function isValidDateParts(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

export function normalizeShortDateInput(value: DateInputValue) {
  const rawValue = String(value ?? "").trim();
  const dateParts = toShortDateParts(rawValue);

  if (!dateParts) return rawValue;

  const { year, month, day } = dateParts;
  if (!isValidDateParts(year, month, day)) return rawValue;

  return `${String(year).slice(2)}${String(month).padStart(2, "0")}${String(
    day,
  ).padStart(2, "0")}`;
}

export function toLocalDateTimeFromDateInput(value: DateInputValue) {
  const normalizedValue = normalizeShortDateInput(value);
  const dateParts = toShortDateParts(normalizedValue);

  if (!dateParts) return null;

  const { year, month, day } = dateParts;
  if (!isValidDateParts(year, month, day)) return null;

  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(
    2,
    "0",
  )}T00:00:00`;
}
