"use client";

import { validateExperienceForm } from "@/app/(application)/experiences/(addExperiences)/actions";
import { UrlValidationResult } from "@/app/(application)/experiences/(addExperiences)/types";
import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { PlatformSelector } from "@/components/experiences/PlatformSelector";
import { SearchInput } from "@/components/experiences/SearchInput";
import { ExperiencesList } from "@/components/experiences/ExperiencesList";
import { PageLoader } from "../common/PageLoader";
import upsertExperienceInDatabase from "@/lib/db/repo/dbRepo";



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

  const [isSelectedExperienceLoading, setIsSelectedExperienceLoading] = useState<boolean>(false);

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
          onExperienceSelect={async (selectedExperience) => {
            //Add the item to the database. 
            setIsSelectedExperienceLoading(true)
            const mutationResult = await upsertExperienceInDatabase(selectedExperience)
            if(mutationResult.isSuccessful) {
              router.push(`/experiences/create-waiver/${mutationResult._id}`);
            } else {
              
            }
            
          }}
        />
      )}

      {
        isSelectedExperienceLoading && <PageLoader />
      }
    </>
  );
}
