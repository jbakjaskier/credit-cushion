"use client";

import { validateExperienceForm } from "@/app/(application)/experiences/(addExperiences)/actions";
import { UrlValidationResult } from "@/app/(application)/experiences/(addExperiences)/types";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { PlatformSelector } from "@/components/experiences/PlatformSelector";
import { SearchInput } from "@/components/experiences/SearchInput";
import { ExperiencesList } from "@/components/experiences/ExperiencesList";

const INITIAL_STATE: UrlValidationResult = {
  mode: "initial",
};

export function ExperiencesForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    validateExperienceForm,
    INITIAL_STATE
  );
  const [selectedPlatform, setSelectedPlatform] = useState("rezdy");

  return (
    <>
      <form action={formAction} className="space-y-6">
        <PlatformSelector
          selectedPlatform={selectedPlatform}
          onPlatformChange={setSelectedPlatform}
        />
        <SearchInput
          selectedPlatform={selectedPlatform}
          state={state}
          isPending={isPending}
        />
      </form>

      {state.mode === "success" && (
        <ExperiencesList
          data={state.data}
          onExperienceSelect={(experienceId) => {
            router.push(`/experiences/create-waiver/${experienceId}`);
          }}
        />
      )}
    </>
  );
}
