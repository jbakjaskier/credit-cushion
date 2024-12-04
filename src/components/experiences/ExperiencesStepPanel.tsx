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
  const pathname = usePathname() || "";

  const addingExperienceSteps: StepDefinition[] = [
    {
      displayId: "01",
      name: "Waiver",
      description: "Review your waiver generated with AI",
      status: pathname.includes("waiver") ? "current" : pathname.includes("publish") ? "complete" :  "upcoming",
    },
    {
      displayId: "02",
      name: "Publish",
      description: "Publish your waiver on DocuSign",
      status: pathname.includes("publish") ? "current" : "upcoming",
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
