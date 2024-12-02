"use client";

import { validateExperienceForm } from "@/app/(application)/experiences/(addExperiences)/actions";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { PlatformSelector } from "@/components/experiences/PlatformSelector";
import { SearchInput } from "@/components/experiences/SearchInput";
import { ExperiencesList } from "@/components/experiences/ExperiencesList";

export function ExperiencesForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(validateExperienceForm, {
    mode: "initial",
  });
  const [selectedPlatform, setSelectedPlatform] = useState<string>("rezdy");

  if (isPending) {
    return (
      <div className="py-12 flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-500">Searching for experiences...</p>
      </div>
    );
  }

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
