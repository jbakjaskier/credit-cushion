"use client";

import { motion } from "framer-motion";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface ProviderUrlStepProps {
  url: string;
  setUrl: (url: string) => void;
  onNext: () => void;
}

export const ProviderUrlStep: React.FC<ProviderUrlStepProps> = ({
  url,
  setUrl,
  onNext,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        label="Experience Provider URL"
        type="url"
        placeholder="https://rezdy.com/supplier/..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="text-gray-500"
        required
      />
      <p className="mt-2 text-sm text-gray-500">
        Enter the URL from your experience provider (Rezdy, GetYourGuide, etc.)
      </p>
      <div className="mt-6 flex justify-end">
        <Button
          onClick={onNext}
          disabled={!url.trim()}
          className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Next
        </Button>
      </div>
    </motion.div>
  );
};
