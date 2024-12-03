"use client";

import { useEffect, useRef, useState } from "react";
import html2pdf from "html2pdf.js";
import { ButtonSpinner } from "../common/ButtonSpinner";

interface PDFViewerProps {
  children: React.ReactNode;
}

export function PDFViewer({ children }: PDFViewerProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const pdfRef = useRef<HTMLIFrameElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function generatePDF() {
      if (!contentRef.current || !pdfRef.current) return;

      try {
        setIsGenerating(true);
        setError(null);

        const opt = {
          margin: 1,
          filename: "waiver.pdf",
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
        };

        const pdfAsString = await html2pdf()
          .set(opt)
          .from(contentRef.current)
          .output("datauristring");

        if (pdfRef.current) {
          pdfRef.current.src = pdfAsString;
        }
      } catch (err) {
        console.error("Error generating PDF:", err);
        setError("Failed to generate PDF preview");
      } finally {
        setIsGenerating(false);
      }
    }

    generatePDF();
  }, [children]);

  return (
    <div className="space-y-4">
      <div className="hidden">
        <div ref={contentRef}>{children}</div>
      </div>

      {isGenerating && (
        <div className="flex items-center justify-center py-12">
          <ButtonSpinner />
          <span className="ml-2">Generating PDF preview...</span>
        </div>
      )}

      {error && <div className="text-center text-red-600 py-4">{error}</div>}

      {!isGenerating && !error && (
        <iframe
          ref={pdfRef}
          className="w-full h-[800px] border border-gray-200 rounded-lg"
          title="Waiver PDF Preview"
        />
      )}
    </div>
  );
}
