"use client";

import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

interface ReviewStepProps {
  pdfUrl: string | null;
  analysis: any;
  onBack: () => void;
  onNext: () => void;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  pdfUrl,
  analysis,
  onBack,
  onNext,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      {pdfUrl && (
        <div
          className="border rounded-md overflow-hidden"
          style={{ height: "500px" }}
        >
          {/* TODO: Implement PDF Viewer */}
          <iframe src={pdfUrl} width="100%" height="100%" title="PDF Viewer" />
        </div>
      )}
      {analysis && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Analysis Results</h3>
          <pre className="mt-2 p-4 bg-gray-100 rounded-md overflow-auto">
            {JSON.stringify(analysis, null, 2)}
          </pre>
        </div>
      )}
      <div className="mt-6 flex justify-between">
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
        <Button
          onClick={onNext}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};
