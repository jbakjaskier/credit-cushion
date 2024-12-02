import { RezdyProductProductSearchResult } from "@/lib/api/rezdy/models/ProductSearchResult";
import { FareHarbourCompany } from "@/lib/api/fareharbour/models/FareHarbourCompany";
import { FareHarbourItemsResult } from "@/lib/api/fareharbour/models/FareHarbourItem";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { ButtonSpinner } from "@/components/common/ButtonSpinner";

type FormState = {
  mode: "initial" | "error" | "success";
  input?: string;
  errorMessage?: string;
  data?:
    | RezdyProductProductSearchResult
    | {
        company: FareHarbourCompany;
        items: FareHarbourItemsResult;
      };
};

interface SearchInputProps {
  selectedPlatform: string;
  state: FormState;
  isPending: boolean;
}

export function SearchInput({
  selectedPlatform,
  state,
  isPending,
}: SearchInputProps) {
  const placeholder =
    selectedPlatform === "rezdy"
      ? "Search for your experiences on Rezdy"
      : "Short name in FareHarbour";

  return (
    <div className="mt-6">
      <label htmlFor="url" className="sr-only">
        {selectedPlatform === "rezdy"
          ? "Search Term for Rezdy"
          : "Short Name for FareHarbour"}
      </label>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            name="url"
            id="url"
            className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset 
              ${state.mode === "error" ? "ring-red-300" : "ring-gray-300"}
              placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 
              sm:text-sm sm:leading-6`}
            placeholder={placeholder}
            defaultValue={state.input}
            aria-invalid={state.mode === "error"}
            aria-describedby={state.mode === "error" ? "url-error" : undefined}
            disabled={isPending}
          />
          {state.mode === "error" && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <ExclamationCircleIcon
                className="h-5 w-5 text-red-500"
                aria-hidden="true"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center justify-center gap-2 flex-shrink-0 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white 
            shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 
            focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50 
            disabled:cursor-not-allowed min-w-[60px]"
        >
          {isPending ? <ButtonSpinner /> : "Go"}
        </button>
      </div>

      {state.mode === "error" && (
        <p className="mt-2 text-sm text-red-600" id="url-error">
          {state.errorMessage}
        </p>
      )}
    </div>
  );
}
