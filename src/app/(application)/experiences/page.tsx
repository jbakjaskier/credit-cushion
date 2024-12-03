"use server";

import { ExperiencesForm } from "@/components/experiences/ExperiencesForm";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";

export default async function ExperiencesPage() {
  return (
    <div className="mx-auto max-w-lg">
      <ErrorBoundary>
        <div>
          <div className="text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M34 40h10v-4a6 6 0 00-10.712-3.714M34 40H14m20 0v-4a9.971 9.971 0 00-.712-3.714M14 40H4v-4a6 6 0 0110.713-3.714M14 40v-4c0-1.313.253-2.566.713-3.714m0 0A10.003 10.003 0 0124 26c4.21 0 7.813 2.602 9.288 6.286M30 14a6 6 0 11-12 0 6 6 0 0112 0zm12 6a4 4 0 11-8 0 4 4 0 018 0zm-28 0a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <h2 className="mt-2 text-base font-semibold leading-6 text-gray-900">
              Add Experiences
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {`You haven't added any experiences to your profile yet. Please add an experience you provide from Rezdy or GetYourGuide or FareHarbour`}
            </p>
          </div>
          <ExperiencesForm />
        </div>
      </ErrorBoundary>
    </div>
  );
}
