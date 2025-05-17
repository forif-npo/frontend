import { cn } from "../utils/cn";
import { Label } from "./Label";

export type SwitchProps = {
  status: boolean;
  onChange: (checked: boolean) => void;
  size?: "lg" | "md";
  disabled?: boolean;
  label?: string;
  labelPosition?: "left" | "right";
  id: string;
};

export const Switch = ({
  status,
  size = "md",
  disabled = false,
  onChange,
  label,
  labelPosition = "right",
  id,
}: SwitchProps) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!status);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!disabled) {
        onChange(!status);
      }
    }
  };

  const sizeClasses = {
    lg: "w-10 h-6",
    md: "w-8 h-5",
  };

  const toggleClasses = {
    lg: { style: "w-6 h-6", translate: "translate-x-6 border-border-primary" },
    md: { style: "w-5 h-5", translate: "translate-x-5 border-border-primary" },
  };

  const labelSizeClasses = {
    lg: { size: "m" as const, gap: "gap-3" },
    md: { size: "s" as const, gap: "gap-2" },
  }[size];

  const switchComponent = (
    <div
      className={`relative inline-block ${sizeClasses[size]} ${
        disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer"
      }`}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      role="switch"
      aria-checked={status}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
    >
      <input
        id={id}
        type="checkbox"
        className="sr-only"
        checked={status}
        disabled={disabled}
        onChange={handleToggle}
        aria-hidden="true"
      />
      <div
        className={`block rounded-full ${
          status ? "bg-primary-50" : "bg-gray-30"
        } ${sizeClasses[size]}`}
      />
      <div
        className={cn(
          "border-1 border-border-gray absolute -left-1 top-0 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
          toggleClasses[size].style,
          status ? toggleClasses[size].translate : "",
        )}
      />
    </div>
  );

  if (!label) {
    return switchComponent;
  }

  return (
    <div
      className={`flex ${labelSizeClasses.gap} items-center ${
        disabled ? "cursor-not-allowed opacity-50" : ""
      }`}
    >
      {labelPosition === "left" && (
        <Label htmlFor={id} size={labelSizeClasses.size}>
          {label}
        </Label>
      )}
      {switchComponent}
      {labelPosition === "right" && (
        <Label htmlFor={id} size={labelSizeClasses.size}>
          {label}
        </Label>
      )}
    </div>
  );
};
