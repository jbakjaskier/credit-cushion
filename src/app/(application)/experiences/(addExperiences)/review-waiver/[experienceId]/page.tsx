"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Experience } from "@/lib/db/models/Experience";
import { WaiverEditor } from "@/components/waiver/WaiverEditor";
import { PageLoader } from "@/components/common/PageLoader";
import WaiverErrorBoundary from "@/components/waiver/WaiverErrorBoundary";

async function fetchExperience(experienceId: string): Promise<Experience> {
  const response = await fetch(`/api/experiences/${experienceId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch experience");
  }
  return response.json();
}

function ReviewWaiverContent({ experienceId }: { experienceId: string }) {
  const [experience, setExperience] = useState<Experience | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExperience() {
      try {
        const data = await fetchExperience(experienceId);
        setExperience(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load experience"
        );
      } finally {
        setIsLoading(false);
      }
    }

    loadExperience();
  }, [experienceId]);

  if (isLoading) return <PageLoader />;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!experience) return <div>No experience found</div>;

  return (
    <div className="space-y-8">
      <div className="prose max-w-none">
        <h2 className="mt-6 text-base font-semibold leading-6 text-gray-900">
          Review Waiver for {experience.experienceTitle}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Review and edit the waiver document. You can modify the content
          directly using the editor.
        </p>
      </div>
      <WaiverEditor experience={experience} />
    </div>
  );
}

export default function ReviewWaiverPage() {
  const params = useParams<{ experienceId: string }>();

  if (!params?.experienceId) {
    return <div>Missing experience ID</div>;
  }

  return (
    <WaiverErrorBoundary>
      <ReviewWaiverContent experienceId={params.experienceId} />
    </WaiverErrorBoundary>
  );
}
