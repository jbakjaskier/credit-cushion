"use client";

import { usePathname } from "next/navigation";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { PageLoader } from "@/components/common/PageLoader";
import { StepItem } from "./steps/StepItem";
import { StepDefinition } from "./types";
import { Suspense } from "react";

export default function ExperiencesStepPanel() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <StepPanelContent />
      </Suspense>
    </ErrorBoundary>
  );
}

function StepPanelContent() {
  const pathname = usePathname();

  const addingExperienceSteps: StepDefinition[] = [
    {
      displayId: "01",
      name: "Create",
      description: "Create Waiver for your experience",
      status: pathname.includes("create-waiver") ? "current" : "upcoming",
    },
    {
      displayId: "02",
      name: "Review",
      description: "Review your waiver",
      status: "upcoming",
    },
    {
      displayId: "03",
      name: "Publish",
      description: "Publish your waiver on DocuSign",
      status: "upcoming",
    },
  ];

  return (
    <div className="lg:border-b lg:border-t lg:border-gray-200">
      <nav
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 cursor-default"
        aria-label="Progress"
      >
        <ol
          role="list"
          className="overflow-hidden rounded-md lg:flex lg:rounded-none lg:border-l lg:border-r lg:border-gray-200"
        >
          {addingExperienceSteps.map((step, stepIdx) => (
            <StepItem
              key={step.displayId}
              step={step}
              stepIdx={stepIdx}
              totalSteps={addingExperienceSteps.length}
            />
          ))}
        </ol>
      </nav>
    </div>
  );
}
