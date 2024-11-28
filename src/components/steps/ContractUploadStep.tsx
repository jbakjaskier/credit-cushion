"use client";

import { motion } from "framer-motion";
import { Upload, FileText } from "lucide-react";
import Button from "@/components/ui/Button";

interface ContractUploadStepProps {
  file: File | null;
  setFile: (file: File | null) => void;
  onBack: () => void;
  onNext: () => void;
  onGenerate: () => void;
  isLoading: boolean;
}

export const ContractUploadStep: React.FC<ContractUploadStepProps> = ({
  file,
  setFile,
  onBack,
  onNext,
  onGenerate,
  isLoading,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Upload Existing Waiver or Generate New One
          </h3>
          <p className="mt-1 text-sm text-gray-600">
            You can either upload an existing waiver or let our system generate
            a new one for you.
          </p>
        </div>

        <div className="border-2 border-gray-300 border-dashed rounded-md p-6">
          <div className="flex justify-center">
            <div className="space-y-1 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                >
                  <span>Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="sr-only"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PDF up to 10MB</p>
            </div>
          </div>
        </div>

        {file && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <FileText className="h-5 w-5" />
            <span>{file.name}</span>
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-md">
          <h4 className="text-sm font-medium text-gray-900">
            Our Intelligent System Analysis
          </h4>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Analyzes existing waivers against activity-specific risks</li>
            <li>Checks legal compliance requirements</li>
            <li>Compares against industry best practices</li>
            <li>Considers regional regulations</li>
          </ul>
          <h4 className="mt-4 text-sm font-medium text-gray-900">
            Validation Reports Include
          </h4>
          <ul className="mt-2 text-sm text-gray-600 list-disc list-inside space-y-1">
            <li>Areas of sufficient coverage</li>
            <li>Potential gaps in liability protection</li>
            <li>Suggested improvements</li>
            <li>Compliance recommendations</li>
          </ul>
        </div>

        <div className="flex justify-between items-center">
          <Button onClick={onBack} variant="secondary">
            Back
          </Button>
          <div className="space-x-4">
            <Button
              onClick={onNext}
              disabled={!file || isLoading}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-60"
            >
              {isLoading ? "Analyzing..." : "Analyze Uploaded Waiver"}
            </Button>
            <Button
              onClick={onGenerate}
              disabled={isLoading}
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? "Generating..." : "Generate New Waiver"}
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
