import { Label } from "./Label";

export type SwitchProps = {
  id: string;
  name?: string;
  value?: string;
  defaultChecked?: boolean;
  size?: "lg" | "md";
  disabled?: boolean;
  label?: string;
  labelPosition?: "left" | "right";
  className?: string;
};

// Uncontrolled server-safe switch using a checkbox + peer styling.
export const Switch = ({
  id,
  name,
  value = "on",
  defaultChecked = false,
  size = "md",
  disabled = false,
  label,
  labelPosition = "right",
  className = "",
}: SwitchProps) => {
  const sizeConf = {
    lg: { track: "w-10 h-6", knob: "w-6 h-6", translate: "translate-x-6" },
    md: { track: "w-8 h-5", knob: "w-5 h-5", translate: "translate-x-5" },
  }[size];

  const switchCore = (
    <span className={`relative inline-flex ${className}`}>
      <input
        id={id}
        name={name}
        value={value}
        type="checkbox"
        defaultChecked={defaultChecked}
        disabled={disabled}
        className="peer sr-only"
        role="switch"
        aria-disabled={disabled}
      />
      <span
        aria-hidden="true"
        className={`rounded-full transition-colors duration-200 ${sizeConf.track} ${disabled ? "cursor-not-allowed" : "cursor-pointer"} bg-gray-30 peer-checked:bg-primary-50 peer-disabled:opacity-50`}
      />
      <span
        aria-hidden="true"
        className={`border-border-gray absolute left-0 top-0 -translate-x-1 transform rounded-full border bg-white transition-transform duration-200 ease-in-out ${sizeConf.knob} peer-checked:${sizeConf.translate} peer-disabled:opacity-75`}
      />
    </span>
  );

  if (!label) return switchCore;

  const sizeLabel = size === "lg" ? "m" : ("s" as const);
  const gap = size === "lg" ? "gap-3" : "gap-2";

  return (
    <span
      className={`inline-flex items-center ${gap} ${disabled ? "opacity-50" : ""}`}
    >
      {labelPosition === "left" && (
        <Label
          htmlFor={id}
          size={sizeLabel}
          className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
        >
          {label}
        </Label>
      )}
      {switchCore}
      {labelPosition === "right" && (
        <Label
          htmlFor={id}
          size={sizeLabel}
          className={disabled ? "cursor-not-allowed" : "cursor-pointer"}
        >
          {label}
        </Label>
      )}
    </span>
  );
};
