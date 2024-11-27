"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Button from "@/components/ui/Button";

interface DocuSignStepProps {
  onBack: () => void;
  onConnect: () => void;
  isLoading: boolean;
}

export const DocuSignStep: React.FC<DocuSignStepProps> = ({
  onBack,
  onConnect,
  isLoading,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center">
        <Lock className="mx-auto h-12 w-12 text-primary-600" />
        <h3 className="mt-2 text-lg font-medium text-gray-600">
          Sign in with DocuSign
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Connect your DocuSign account to start processing documents
        </p>
      </div>
      <div className="mt-6">
        <Button
          onClick={onConnect}
          className="w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={isLoading}
        >
          {isLoading ? "Connecting..." : "Connect DocuSign Account"}
        </Button>
      </div>
      <div className="mt-6 flex justify-start">
        <Button onClick={onBack} variant="secondary">
          Back
        </Button>
      </div>
    </motion.div>
  );
};
