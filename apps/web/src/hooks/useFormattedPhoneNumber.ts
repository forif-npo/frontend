import { useMemo } from "react";
import {
  formatPhoneNumber,
  type PhoneNumberValue,
} from "@core/utils/phone-number";

export { formatPhoneNumber };

export function useFormattedPhoneNumber(value: PhoneNumberValue) {
  return useMemo(() => formatPhoneNumber(value), [value]);
}
