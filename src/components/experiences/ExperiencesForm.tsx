"use client";

import { validateUrl } from "@/app/(application)/experiences/(addExperiences)/actions";
import { useActionState } from "react";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export function ExperiencesForm() {
  const [state, formAction, isPending] = useActionState(validateUrl, {
    isValid: true,
  });

  return (
    <form action={formAction}>
      <div className="mt-6 flex">
        <label htmlFor="url" className="sr-only">
          Experience URL
        </label>

        {state.isValid && (
          <input
            type="url"
            name="url"
            id="url"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter your experience URL"
          />
        )}

        {state.isValid == false && (
          <div className="relative block w-full rounded-md shadow-sm">
            <input
              type="url"
              name="url"
              id="url"
              className=" block w-full rounded-md border-0 py-1.5 pr-10 text-red-900 ring-1 ring-inset ring-red-300 placeholder:text-red-300 focus:ring-2 focus:ring-inset focus:ring-red-500 sm:text-sm sm:leading-6"
              placeholder={state.url}
              defaultValue={state.url}
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
            {`Add`}
          </button>
        )}
      </div>
      {state.isValid == false && <p className="mt-2 ml-1 text-sm text-red-600" id="url-error">{state.errorMessage}</p>}
    </form>
  );
}
