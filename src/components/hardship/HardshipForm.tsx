"use client";

import { createCustomerHardship } from "@/app/(marketing)/hardship/actions";
import { useActionState, useEffect, useState } from "react";
import { PhotoIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import ProgressLoader from "../common/ProgressLoader";

export type HardshipFormErrorDetail = {
  fullLegalName?: string;
  emailAddress?: string;
  phoneNumber?: string;
  circumstanceReason?: string;
  circumstanceExplanation?: string;
  idealArrangement?: string;
  supportingDocument?: string;
};

export type HardshipFormState =
  | {
      mode: "error";
      errorDetails: HardshipFormErrorDetail;
    }
  | {
      mode: "initial";
    } | {
      mode: "emailSentToRepresentative" //TODO: THis state needs a UI
    } | {
      mode: "contractVariatedSuccessfully" //can look into improving the UI
    };


//TODO: emailSentToRepresentative and contractVariatedSuccessfully should be implemented
export default function HardshipForm() {
  const [state, formAction, isPending] = useActionState(
    createCustomerHardship,
    {
      mode: "initial",
    }
  );

  useEffect(() => {
    if (fileSelected !== null) {
      setFileSelected(null);
    }
  }, [state]);

  const [fileSelected, setFileSelected] = useState<File | null>(null);

  return state.mode === "contractVariatedSuccessfully" ? (
    <div className="mt-4 w-full max-w-2xl">
      <CheckCircleIcon width={50} height={50} stroke="green" />
      <h1 className="text-2xl text-gray-900">Thank you</h1>
      <p className="text-sm text-gray-900">
        {`Congratulations 🎉. We've successfully variated your contract. You should be recieving the variation of contract in your inbox to sign`}
      </p>
    </div>
  ) : (
    <form className="mt-4 w-full max-w-2xl" action={formAction}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <h2 className="text-base font-semibold leading-7 text-gray-900">
            Tell us about your hardship
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-600">
            {`Please use this form to tell us more about the financial hardship that you're going through`}
          </p>

          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="fullLegalName"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Full Legal Name
                <span className="block text-gray-500 text-sm">
                  Please enter your full legal name including your first and
                  last name
                </span>
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="fullLegalName"
                    id="fullLegalName"
                    autoComplete="fullLegalName"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 ml-4 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {state.mode === "error" &&
                state.errorDetails.fullLegalName !== undefined && (
                  <p className="text-sm mt-2 font-medium text-red-500">
                    {state.errorDetails.fullLegalName}
                  </p>
                )}
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="customerEmail"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email Address
                <span className="block text-gray-500 text-sm">
                  Please enter the email you used with your financial provider
                </span>
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="email"
                    name="customerEmail"
                    id="customerEmail"
                    autoComplete="customerEmail"
                    placeholder="username@example.com"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 ml-4 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {state.mode === "error" &&
                state.errorDetails.emailAddress !== undefined && (
                  <p className="text-sm mt-2 font-medium text-red-500">
                    {state.errorDetails.emailAddress}
                  </p>
                )}
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Phone Number
                <span className="block text-gray-500 text-sm">
                  Please enter the phone number you used with your financial
                  provider. Enter it including the international code. Example:
                  +61665468978
                </span>
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="phoneNumber"
                    id="phoneNumber"
                    autoComplete="phoneNumber"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 ml-4 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              {state.mode === "error" &&
                state.errorDetails.phoneNumber !== undefined && (
                  <p className="text-sm mt-2 font-medium text-red-500">
                    {state.errorDetails.phoneNumber}
                  </p>
                )}
            </div>

            <div className="sm:col-span-3">
              <label
                htmlFor="circumstanceReason"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                How has your circumstances changed ?
              </label>
              <div className="mt-2">
                <select
                  id="circumstanceReason"
                  name="circumstanceReason"
                  autoComplete="circumstanceReason"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                >
                  <option value={`incomeReduced`}>My Income Has Reduced</option>
                  <option value={`expenseRaised`}>
                    My Expenses Have Raised
                  </option>
                </select>
              </div>
              {state.mode === "error" &&
                state.errorDetails.circumstanceReason !== undefined && (
                  <p className="text-sm mt-2 font-medium text-red-500">
                    {state.errorDetails.circumstanceReason}
                  </p>
                )}
            </div>

            <div className="col-span-full">
              <label
                htmlFor="circumstanceExplanation"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Tell us a bit more about your circumstance
                <span className="block text-gray-500 text-sm">
                  Please tell us a little bit more about how your circumstances
                  have changed. Use as much detail as possible
                </span>
              </label>
              <div className="mt-2">
                <textarea
                  id="circumstanceExplanation"
                  name="circumstanceExplanation"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              {state.mode === "error" &&
                state.errorDetails.circumstanceExplanation !== undefined && (
                  <p className="text-sm mt-2 font-medium text-red-500">
                    {state.errorDetails.circumstanceExplanation}
                  </p>
                )}
            </div>

            <div className="col-span-full">
              <label
                htmlFor="idealArrangement"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                What would be your ideal arrangement
                <span className="block text-gray-500 text-sm">
                  {`Let us know what your ideal arrangement be ? Give us details
                  like the amount you're wanting to variate, and the period
                  you're wanting to variate it for. Entering this does not mean
                  your contract is altered. The original agreement still stands.`}
                </span>
              </label>
              <div className="mt-2">
                <textarea
                  id="idealArrangement"
                  name="idealArrangement"
                  rows={3}
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={""}
                />
              </div>
              {state.mode === "error" &&
                state.errorDetails.idealArrangement !== undefined && (
                  <p className="text-sm mt-2 font-medium text-red-500">
                    {state.errorDetails.idealArrangement}
                  </p>
                )}
            </div>

            <div className="col-span-full">
              <label
                htmlFor="supporting-documents"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Supporting Documents
                <span className="block text-gray-500 text-sm">
                  Please add any documents that may support your case. Like
                  current bank statements or job redudancy letter. If you have
                  multiple documents, please merge them into one document and
                  upload the merged document here
                </span>
              </label>
              <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                <div className="text-center">
                  <PhotoIcon
                    className="mx-auto h-12 w-12 text-gray-300"
                    aria-hidden="true"
                  />
                  <div className="mt-4 flex text-sm leading-6 text-gray-600">
                    <label
                      htmlFor="supporting-documents"
                      className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="supporting-documents"
                        name="supporting-documents"
                        type="file"
                        accept=".pdf"
                        className="sr-only"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          const fileList = event.target?.files;
                          if (fileList) {
                            const file = fileList[0];
                            // Validate file type and size
                            if (
                              file.type === "application/pdf" &&
                              file.size <= 4 * 1024 * 1024
                            ) {
                              setFileSelected(file);
                            }
                          }
                        }}
                      />
                    </label>
                    <p className="pl-1">to support your case</p>
                  </div>
                  <p className="text-xs leading-5 text-center text-gray-600">
                    {`Make sure it's in PDF format and below 4MB`}
                  </p>
                </div>
              </div>
              {fileSelected !== null && (
                <p className="mt-4 text-sm text-gray-900">{`Selected File : ${fileSelected.name}`}</p>
              )}
              {state.mode === "error" &&
                state.errorDetails.supportingDocument !== undefined && (
                  <p className="text-sm mt-2 font-medium text-red-500">
                    {state.errorDetails.supportingDocument}
                  </p>
                )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        {isPending ? (
          <ProgressLoader />
        ) : (
          <button
            type="submit"
            className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Submit
          </button>
        )}
      </div>
    </form>
  );
}
