export interface StudyStepIndicatorItem {
  number: number;
  title: string;
  description: string;
}

interface StudyStepIndicatorProps {
  steps: readonly StudyStepIndicatorItem[];
}

export function StudyStepIndicator({ steps }: StudyStepIndicatorProps) {
  return (
    <div className="border-border-gray bg-surface-white flex w-full flex-col rounded-[12px] border p-8">
      {steps.map((step, index) => (
        <div key={step.number}>
          <div className="flex gap-4">
            <div className="flex shrink-0 flex-col items-start px-2">
              <div className="bg-secondary-70 flex h-6 w-6 items-center justify-center rounded-[4px]">
                <span className="text-[15px] font-bold leading-[1.5] text-white">
                  {step.number}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex flex-1 items-center justify-center self-stretch">
                  <div className="bg-border-secondary-light h-full w-px" />
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col gap-1">
              <p className="text-text-secondary text-[17px] font-bold leading-[1.5]">
                {step.title}
              </p>
              <p className="text-text-subtle text-[17px] leading-[1.5]">
                {step.description}
              </p>
            </div>
          </div>

          {index < steps.length - 1 && (
            <div className="flex h-8 w-10 items-center justify-center px-2">
              <div className="bg-border-secondary-light h-full w-px" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
