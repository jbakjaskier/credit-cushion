"use client";

import { useEffect, useState, Suspense } from "react";
import {
  generateWaiverSections,
  generateWaiverContent,
} from "@/lib/api/waiver/WaiverGenerator";
import { WaiverTemplate } from "@/components/waiver/WaiverTemplate";
import { PDFViewer } from "@/components/pdf/PDFViewer";
import { Experience } from "@/lib/db/models/Experience";
import { WaiverSection } from "@/lib/types/waiver";
import { PageLoader } from "@/components/common/PageLoader";
import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { useParams } from "next/navigation";
import { WaiverErrorBoundary } from "@/components/waiver/WaiverErrorBoundary";

async function fetchExperience(experienceId: string): Promise<Experience> {
  const response = await fetch(`/api/experiences/${experienceId}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `Failed to fetch experience: ${response.statusText}`
    );
  }

  return response.json();
}

function WaiverContent({ experienceId }: { experienceId: string }) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [waiverSections, setWaiverSections] = useState<WaiverSection[] | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadExperienceAndGenerateWaiver() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch experience details
        const experienceData = await fetchExperience(experienceId);
        if (!isMounted) return;
        setExperience(experienceData);

        // Generate waiver sections
        let sections;
        try {
          sections = await generateWaiverSections(experienceData);
        } catch (err) {
          console.error("Error generating waiver sections:", err);
          throw new Error("Failed to generate waiver sections");
        }
        if (!isMounted) return;

        // Generate waiver content
        let waiverContent;
        try {
          waiverContent = await generateWaiverContent(experienceData, sections);
        } catch (err) {
          console.error("Error generating waiver content:", err);
          throw new Error("Failed to generate waiver content");
        }
        if (!isMounted) return;

        setWaiverSections(waiverContent);
      } catch (err) {
        if (!isMounted) return;
        console.error("Error in waiver generation:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadExperienceAndGenerateWaiver();

    return () => {
      isMounted = false;
    };
  }, [experienceId]);

  if (isLoading) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  if (!experience || !waiverSections) {
    return <PageLoader />;
  }

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h2 className="mt-6 text-base font-semibold leading-6 text-gray-900">
          Waiver for {experience.experienceTitle}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          This is a preview of the waiver document that will be presented to
          participants. The waiver outlines important terms, conditions, and
          liability releases. Please review it carefully to ensure all necessary
          information is included and accurately represented.
        </p>
      </div>

      <PDFViewer>
        <WaiverTemplate experience={experience} sections={waiverSections} />
      </PDFViewer>
    </div>
  );
}

export default function CreateWaiverPage() {
  const params = useParams<{ experienceId: string }>();

  // Handle loading state while params are being resolved
  if (!params) {
    return <PageLoader />;
  }

  const experienceId = params.experienceId;

  // Handle missing experienceId case
  if (!experienceId) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">Experience ID is required</p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <WaiverErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <WaiverContent experienceId={experienceId} />
        </Suspense>
      </WaiverErrorBoundary>
    </ErrorBoundary>
  );
}
