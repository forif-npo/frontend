import { TextInput } from "@ui/components/client";

interface StudyUserInfoFieldProps {
  id: string;
  label: string;
  value: string;
}

export function StudyUserInfoField({
  id,
  label,
  value,
}: StudyUserInfoFieldProps) {
  return (
    <div className="flex flex-col gap-6">
      <h3 className="text-text-basic text-[19px] font-bold leading-[1.5]">
        {label}
      </h3>
      <TextInput id={id} length="full" value={value} readOnly disabled />
    </div>
  );
}
