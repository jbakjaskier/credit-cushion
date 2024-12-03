import { classNames } from "@/lib/classUtils";
import { CheckIcon } from "@heroicons/react/24/solid";
import { StepDefinition } from "../types";
import { StepSeparator } from "./StepSeparator";

interface StepItemProps {
  step: StepDefinition;
  stepIdx: number;
  totalSteps: number;
}

export function StepItem({ step, stepIdx, totalSteps }: StepItemProps) {
  return (
    <li key={step.displayId} className="relative overflow-hidden lg:flex-1">
      <div
        className={classNames(
          stepIdx === 0 ? "rounded-t-md border-b-0" : "",
          stepIdx === totalSteps - 1 ? "rounded-b-md border-t-0" : "",
          "overflow-hidden border border-gray-200 lg:border-0"
        )}
      >
        {step.status === "complete" ? (
          <CompletedStep step={step} stepIdx={stepIdx} />
        ) : step.status === "current" ? (
          <CurrentStep step={step} stepIdx={stepIdx} />
        ) : (
          <UpcomingStep step={step} stepIdx={stepIdx} />
        )}

        {stepIdx !== 0 && <StepSeparator />}
      </div>
    </li>
  );
}

function CompletedStep({
  step,
  stepIdx,
}: {
  step: StepDefinition;
  stepIdx: number;
}) {
  return (
    <p className="group">
      <StepIndicator />
      <StepContent step={step} stepIdx={stepIdx}>
        <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
      </StepContent>
    </p>
  );
}

function CurrentStep({
  step,
  stepIdx,
}: {
  step: StepDefinition;
  stepIdx: number;
}) {
  return (
    <p aria-current="step">
      <CurrentStepIndicator />
      <StepContent step={step} stepIdx={stepIdx} isCurrent>
        <span className="text-indigo-600">{step.displayId}</span>
      </StepContent>
    </p>
  );
}

function UpcomingStep({
  step,
  stepIdx,
}: {
  step: StepDefinition;
  stepIdx: number;
}) {
  return (
    <p className="group">
      <StepIndicator />
      <StepContent step={step} stepIdx={stepIdx}>
        <span className="text-gray-500">{step.displayId}</span>
      </StepContent>
    </p>
  );
}

function StepIndicator({ isCurrent = false }) {
  return (
    <span
      className={classNames(
        "absolute left-0 top-0 h-full w-1",
        isCurrent ? "bg-indigo-600" : "bg-transparent group-hover:bg-gray-200",
        "lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
      )}
      aria-hidden="true"
    />
  );
}

function CurrentStepIndicator() {
  return (
    <span
      className="absolute left-0 top-0 h-full w-1 bg-indigo-600 lg:bottom-0 lg:top-auto lg:h-1 lg:w-full"
      aria-hidden="true"
    />
  );
}

interface StepContentProps {
  step: StepDefinition;
  stepIdx: number;
  children: React.ReactNode;
  isCurrent?: boolean;
}

function StepContent({
  step,
  stepIdx,
  children,
  isCurrent = false,
}: StepContentProps) {
  return (
    <span
      className={classNames(
        stepIdx !== 0 ? "lg:pl-9" : "",
        "flex items-start px-6 py-5 text-sm font-medium"
      )}
    >
      <span className="flex-shrink-0">
        <span
          className={classNames(
            "flex h-10 w-10 items-center justify-center rounded-full",
            isCurrent
              ? "border-2 border-indigo-600"
              : step.status === "complete"
              ? "bg-indigo-600"
              : "border-2 border-gray-300"
          )}
        >
          {children}
        </span>
      </span>
      <span className="ml-4 mt-0.5 flex min-w-0 flex-col">
        <span
          className={classNames(
            "text-sm font-medium",
            isCurrent
              ? "text-indigo-600"
              : step.status === "complete"
              ? "text-gray-950"
              : "text-gray-500"
          )}
        >
          {step.name}
        </span>
        <span className="text-sm font-medium text-gray-500">
          {step.description}
        </span>
      </span>
    </span>
  );
}
