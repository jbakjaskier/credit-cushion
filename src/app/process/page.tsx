"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ProgressBar";
import { ProviderUrlStep } from "@/components/steps/ProviderUrlStep";
import { ContractUploadStep } from "@/components/steps/ContractUploadStep";
import { ReviewStep } from "@/components/steps/ReviewStep";
import { DocuSignStep } from "@/components/steps/DocuSignStep";

const steps = [
  {
    id: 1,
    name: "Provider URL",
    icon: "provider" as const,
    description: "Enter your experience provider URL",
  },
  {
    id: 2,
    name: "Contract Upload",
    icon: "upload" as const,
    description: "Upload your waiver or contract",
  },
  {
    id: 3,
    name: "Review",
    icon: "review" as const,
    description: "Review and generate waiver",
  },
  {
    id: 4,
    name: "DocuSign",
    icon: "docusign" as const,
    description: "Sign in with DocuSign",
  },
];

export default function Process() {
  const [currentStep, setCurrentStep] = useState(0);
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleNext = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/analyze-pdf", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      setAnalysis(result);
      setPdfUrl(URL.createObjectURL(file));
      handleNext();
    } catch (error) {
      console.error("Error analyzing PDF:", error);
      //TODO: This needs to be removed. This is just a quick fix to go to next step
      handleNext();
    }
    setIsLoading(false);
  };

  const handleGenerateWaiver = async () => {
    setIsLoading(true);
    // TODO: To generate a new waiver
    // try {
    //   const response = await fetch("/api/generate-waiver", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ url }),
    //   });
    //   const result = await response.json();
    //   setPdfUrl(
    //     "/api/generate-pdf?waiver=" + encodeURIComponent(result.waiver)
    //   );
    //   handleNext();
    // } catch (error) {
    //   console.error("Error generating waiver:", error);
    // }
    handleNext();
    setIsLoading(false);
  };

  const handleDocuSignAuth = async () => {
    setIsLoading(true);
    try {
      // Implement DocuSign OAuth flow
      console.log("Initiating DocuSign OAuth...");
    } catch (error) {
      console.error("Error during DocuSign authentication:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      <div className="relative isolate">
        <svg
          className="absolute inset-x-0 top-0 -z-10 h-[64rem] w-full stroke-gray-200 [mask-image:radial-gradient(32rem_32rem_at_center,white,transparent)]"
          aria-hidden="true"
        >
          <defs>
            <pattern
              id="1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84"
              width={200}
              height={200}
              x="50%"
              y={-1}
              patternUnits="userSpaceOnUse"
            >
              <path d="M.5 200V.5H200" fill="none" />
            </pattern>
          </defs>
          <svg x="50%" y={-1} className="overflow-visible fill-gray-50">
            <path
              d="M-200 0h201v201h-201Z M600 0h201v201h-201Z M-400 600h201v201h-201Z M200 800h201v201h-201Z"
              strokeWidth={0}
            />
          </svg>
          <rect
            width="100%"
            height="100%"
            strokeWidth={0}
            fill="url(#1f932ae7-37de-4c0a-a8b0-a6e3b4d44b84)"
          />
        </svg>
        <div
          className="absolute left-1/2 right-0 top-0 -z-10 -ml-24 transform-gpu overflow-hidden blur-3xl lg:ml-24 xl:ml-48"
          aria-hidden="true"
        >
          <div
            className="aspect-[801/1036] w-[50.0625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
            style={{
              clipPath:
                "polygon(63.1% 29.5%, 100% 17.1%, 76.6% 3%, 48.4% 0%, 44.6% 4.7%, 54.5% 25.3%, 59.8% 49%, 55.2% 57.8%, 44.4% 57.2%, 27.8% 47.9%, 35.1% 81.5%, 0% 97.7%, 39.2% 100%, 35.2% 81.4%, 97.2% 52.8%, 63.1% 29.5%)",
            }}
          />
        </div>
        <div className="mx-auto max-w-7xl px-6 pb-32 pt-36 sm:pt-60 lg:px-8 lg:pt-32">
          <div className="mx-auto max-w-2xl gap-x-14 lg:mx-0 lg:flex lg:max-w-none lg:items-center">
            <div className="w-full max-w-xl lg:shrink-0 xl:max-w-2xl">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Generate Your Waiver
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Follow the steps below to generate and send your waiver to your
                customer
              </p>
            </div>
          </div>

          <div className="mt-16 sm:mt-24">
            <Card className="mt-8">
              <CardContent>
                <ProgressBar steps={steps} currentStep={currentStep} />

                <AnimatePresence mode="wait">
                  {currentStep === 0 && (
                    <ProviderUrlStep
                      key="provider-url"
                      url={url}
                      setUrl={setUrl}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 1 && (
                    <ContractUploadStep
                      key="contract-upload"
                      file={file}
                      setFile={setFile}
                      onBack={handleBack}
                      onNext={() => handleFileUpload(file!)}
                      onGenerate={handleGenerateWaiver}
                      isLoading={isLoading}
                    />
                  )}

                  {currentStep === 2 && (
                    <ReviewStep
                      key="review"
                      pdfUrl={pdfUrl}
                      analysis={analysis}
                      onBack={handleBack}
                      onNext={handleNext}
                    />
                  )}

                  {currentStep === 3 && (
                    <DocuSignStep
                      key="docusign"
                      onBack={handleBack}
                      onConnect={handleDocuSignAuth}
                      isLoading={isLoading}
                    />
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
