import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useDisclosure } from "@/hooks/use-disclosure";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SingleCalendar } from "@/components/ui/single-calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

// ================================== //

type TProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onSelect" | "value"
> & {
  onSelect: (value: Date | undefined) => void;
  value?: Date | undefined;
  placeholder: string;
  /** date-fns format 문자열 (예: "PPP", "yyyy. MM. dd.") */
  labelVariant?: string;
  /** 시간을 선택하면 날짜와 함께 표시·저장할 수 있는 선택 입력을 노출합니다. */
  time?: string;
  onTimeChange?: (value: string) => void;
};

function SingleDayPicker({
  id,
  onSelect,
  className,
  placeholder,
  labelVariant = "PPP",
  time,
  onTimeChange,
  value,
  disabled,
  ...props
}: TProps) {
  const { isOpen, onClose, onToggle } = useDisclosure();

  const handleSelect = (date: Date | undefined) => {
    onSelect(date);
    if (!onTimeChange) onClose();
  };

  return (
    <Popover open={isOpen} onOpenChange={onToggle} modal>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          className={cn(
            "group relative h-9 w-full justify-start whitespace-nowrap px-3 py-2 font-normal hover:bg-inherit",
            className,
          )}
          {...props}
          disabled={disabled}
        >
          {value && <span>{format(value, labelVariant, { locale: ko })}</span>}
          {!value && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        align="center"
        className={cn("w-fit p-0", onTimeChange && "w-72 p-2")}
      >
        <SingleCalendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          initialFocus
        />
        {onTimeChange && (
          <div className="mt-2 border-t px-1 pt-3">
            <label
              htmlFor={id ? `${id}-time` : undefined}
              className="text-sm font-medium"
            >
              시간{" "}
              <span className="text-muted-foreground font-normal">(선택)</span>
            </label>
            <Input
              id={id ? `${id}-time` : undefined}
              type="time"
              value={time ?? ""}
              disabled={disabled || !value}
              onChange={(event) => onTimeChange(event.target.value)}
              className="mt-2"
            />
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

// ================================== //

export { SingleDayPicker };
