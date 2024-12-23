"use client";

import { useState } from "react";
import {
  rejectHardship,
  approveHardship,
} from "@/app/(application)/loans/[loanId]/hardship/action/actions";

export default function HardshipActions({ loanId }: { loanId: string }) {
  const [selectedAction, setSelectedAction] = useState<
    "accept" | "reject" | null
  >(null);

  return (
    <div>
      <div className="px-4 py-3 sm:px-0">
        <div>
          <div className="flex gap-x-6">
            <div className="flex items-center">
              <input
                id="accept-radio"
                name="action-choice"
                type="radio"
                checked={selectedAction === "accept"}
                onChange={() => setSelectedAction("accept")}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="accept-radio"
                className="ml-2 block text-sm font-medium leading-6 text-gray-900"
              >
                Accept Hardship
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="reject-radio"
                name="action-choice"
                type="radio"
                checked={selectedAction === "reject"}
                onChange={() => setSelectedAction("reject")}
                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
              />
              <label
                htmlFor="reject-radio"
                className="ml-2 block text-sm font-medium leading-6 text-gray-900"
              >
                Reject Hardship
              </label>
            </div>
          </div>

          {selectedAction === "reject" && (
            <form action={rejectHardship} className="mt-4">
              <input type="hidden" name="loanId" value={loanId} />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="rejectionNotes"
                  className="block text-sm font-medium text-gray-700"
                >
                  Rejection Notes
                </label>
                <textarea
                  id="rejectionNotes"
                  name="rejectionNotes"
                  rows={4}
                  required
                  placeholder="Please provide detailed notes explaining why the hardship request is being rejected..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-red-500 focus:ring-red-500 sm:text-sm"
                />
                <div className="mt-2">
                  <button
                    type="submit"
                    className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </div>
            </form>
          )}

          {selectedAction === "accept" && (
            <form action={approveHardship} className="mt-4">
              <input type="hidden" name="loanId" value={loanId} />
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="contractContent"
                  className="block text-sm font-medium text-gray-700"
                >
                  Variation of Contract Content
                </label>
                <textarea
                  id="contractContent"
                  name="contractContent"
                  rows={8}
                  required
                  placeholder="Enter the contract variation details. This will be used to generate the formal variation document..."
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
                <div className="mt-2">
                  <button
                    type="submit"
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Generate Variation Contract
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
