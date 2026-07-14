import { type FocusEvent, useCallback } from "react";
import type {
  FieldPath,
  FieldValues,
  PathValue,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { normalizeShortDateInput } from "@/utils/dateInput";

export function useDateInput<TFieldValues extends FieldValues>({
  register,
  setValue,
}: {
  register: UseFormRegister<TFieldValues>;
  setValue: UseFormSetValue<TFieldValues>;
}) {
  const registerShortDateInput = useCallback(
    <TName extends FieldPath<TFieldValues>>(name: TName) => {
      const field = register(name, {
        setValueAs: normalizeShortDateInput,
      });

      return {
        ...field,
        onBlur: (event: FocusEvent<HTMLInputElement>) => {
          const normalizedValue = normalizeShortDateInput(event.target.value);

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

  return { registerShortDateInput };
}
