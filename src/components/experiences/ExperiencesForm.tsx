"use client";

import { validateExperienceForm } from "@/app/(application)/experiences/(addExperiences)/actions";
import { useActionState, useState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export function ExperiencesForm() {
  const [state, formAction, isPending] = useActionState(validateExperienceForm, {
    mode: "initial",
  });

  const [selectedPlatform, setSelectedPlatform] = useState<string>("rezdy");

  return (
    <form action={formAction}>
      <div className="space-y-12">
        <fieldset>
          <div className="mt-6 space-y-6">
            <div className="flex items-center gap-x-3">
              <input
                id="rezdy-radio"
                name="platform"
                type="radio"
                value={"rezdy"}
                checked={selectedPlatform === "rezdy"}
                onChange={(event) => {
                  setSelectedPlatform(event.target.value);
                }}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="rezdy-radio"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Rezdy
              </label>
            </div>
            <div className="flex items-center gap-x-3">
              <input
                id="fareharbour-radio"
                name="platform"
                type="radio"
                value={"fareharbour"}
                checked={selectedPlatform === "fareharbour"}
                onChange={(event) => {
                  setSelectedPlatform(event.target.value);
                }}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="fareharbour-radio"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                FareHarbour
              </label>
            </div>
          </div>
        </fieldset>
        
      </div>

      <div className="mt-6 flex">
        <label htmlFor="url" className="sr-only">
          {selectedPlatform === "rezdy" ? `Search Term for Rezdy` : `Short Name for FareHarbour`}
        </label>

        {state.mode === "success" || state.mode === "initial" && (
          <input
            type="search"
            name="url"
            id="url"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder={selectedPlatform === "rezdy" ? `Search for your experiences on Rezdy` : `Short name in FareHarbour`}
          />
        )}

        {state.mode === "error" && (
          <div className="relative block w-full rounded-md shadow-sm">
            <input
              type="search"
              name="url"
              id="url"
              className=" block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
              placeholder={state.input}
              defaultValue={state.input}
              aria-invalid="true"
              aria-describedby="url-error"
            />
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          </div>
        )}

        {isPending ? (
          <div
            className=" ml-4 mt-1 flex-shrink-0 animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full dark:text-blue-500"
            role="status"
            aria-label="loading"
          >
            <span className="sr-only">Loading...</span>
          </div>
        ) : (
          <button
            type="submit"
            className="ml-4 flex-shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 self-center"
          >
            {`Go`}
          </button>
        )}
      </div>
      {state.mode === "error" && <p className="mt-2 ml-1 text-sm text-red-600" id="url-error">{state.errorMessage}</p>} 
    </form>
  );
}
//TODO: Add Experience list here