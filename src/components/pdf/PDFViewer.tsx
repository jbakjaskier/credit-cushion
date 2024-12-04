"use client";

import { useEffect, useState } from "react";
import { Experience } from "@/lib/db/models/Experience";
import { useRouter } from "next/navigation";
import Button from "@/components/common/Button";

interface PDFViewerProps {
  experience: Experience;
}

export function PDFViewer({ experience }: PDFViewerProps) {
  const router = useRouter();
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generatePDF() {
      try {
        setIsGenerating(true);
        setError(null);

        const response = await fetch("/api/waiver/generate-pdf", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ experience }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to generate PDF");
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
      } catch (err) {
        console.error("Error generating PDF:", err);
        setError("Failed to generate PDF preview");
      } finally {
        setIsGenerating(false);
      }
    }

    generatePDF();

    // Cleanup function to revoke the object URL
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [experience]);

  const handleReviewClick = () => {
    if (pdfUrl) {
      router.push(`/experiences/review-waiver/${experience.experienceId}`);
    }
  };

  return (
    <div className="space-y-4">
      {isGenerating && (
        <div className="flex items-center justify-center py-12 bg-gray-100 rounded-lg border border-gray-300">
          <span className="ml-2 text-lg font-medium text-gray-700">
            Generating PDF preview...
          </span>
        </div>
      )}

      {error && <div className="text-center text-red-600 py-4">{error}</div>}

      {!isGenerating && !error && pdfUrl && (
        <>
          <iframe
            src={pdfUrl}
            className="w-full h-[800px] border border-gray-200 rounded-lg"
            title="Waiver PDF Preview"
          />
          <div className="flex justify-end">
            <Button onClick={handleReviewClick}>Review Waiver</Button>
          </div>
        </>
      )}
    </div>
  );
}
