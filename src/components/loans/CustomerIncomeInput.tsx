"use client";

import { saveCustomerIncome } from "@/app/(application)/loans/[loanId]/_customerIncome/action";
import { BanknotesIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";
import { useActionState } from "react";
import ProgressLoader from "../common/ProgressLoader";
import { Money } from "@/lib/db/models/loans";

export type CustomerIncomeInputState =
  | {
      mode: "initial";
      loanId: string;
    }
  | {
      mode: "success";
      loanId: string;
      annualCustomerIncome: Money;
    }
  | {
      mode: "error";
      errorMessage: string;
      loanId: string;
    };

export default function CustomerIncomeInput({ loanId }: { loanId: string }) {
  const [state, formAction, isPending] = useActionState(saveCustomerIncome, {
    mode: "initial",
    loanId: loanId,
  });

  return (
    <form action={formAction}>
      {(state.mode === "initial" || state.mode === "error") && !isPending && (
        <div className="mt-2 flex rounded-md shadow-sm">
          <div className="relative flex flex-grow items-stretch focus-within:z-10">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <BanknotesIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="number"
              name="annualIncome"
              id="annualIncome"
              min="0"
              className="block w-full rounded-none rounded-l-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              placeholder="Annual Income"
            />
          </div>

          <button
            type="submit"
            className="relative -ml-px inline-flex items-center gap-x-1.5 rounded-r-md px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          >
            <DocumentCheckIcon
              className="-ml-0.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Save
          </button>
        </div>
      )}

      {state.mode === "success" && `$${state.annualCustomerIncome.value}`}

      {isPending && <ProgressLoader />}

      {state.mode === "error" && (
        <p className="mt-2 text-red-800">{state.errorMessage}</p>
      )}
    </form>
  );
}
