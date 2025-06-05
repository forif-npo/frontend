import { SignUpValues } from "@core/schemas";
import { UseFormSetValue } from "react-hook-form";

export const autoHyphenPhoneNumber = (
  e: React.ChangeEvent<HTMLInputElement>,
  setValue: UseFormSetValue<SignUpValues>,
) => {
  const rawPhone = e.target.value.replace(/-/g, "");
  let formattedPhone = "";

  if (rawPhone.length < 4) {
    formattedPhone = rawPhone;
  } else if (rawPhone.length < 8) {
    formattedPhone = `${rawPhone.slice(0, 3)}-${rawPhone.slice(3)}`;
  } else if (rawPhone.length < 11) {
    formattedPhone = `${rawPhone.slice(0, 3)}-${rawPhone.slice(
      3,
      7,
    )}-${rawPhone.slice(7)}`;
  } else {
    formattedPhone = `${rawPhone.slice(0, 3)}-${rawPhone.slice(
      3,
      7,
    )}-${rawPhone.slice(7, 11)}`;
  }

  const displayPhone = formattedPhone.length > 0 ? formattedPhone : "";
  setValue("phone_number", displayPhone);
};
