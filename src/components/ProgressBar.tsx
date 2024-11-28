"use client";

import React from "react";
import { motion } from "framer-motion";
import { stepIcons } from "./icons/StepIcons";

interface Step {
  id: number;
  name: string;
  icon: keyof typeof stepIcons;
  description: string;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
}) => {
  return (
    <div className="relative mb-12">
      {/* Curved progress line */}
      <div className="absolute top-6 left-0 w-full">
        <svg
          className="w-full"
          height="4"
          fill="none"
          viewBox="0 0 100 4"
          preserveAspectRatio="none"
        >
          <path
            d="M0 2 Q 25 4, 50 2 T 100 2"
            stroke="#E5E7EB"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
          <motion.path
            d="M0 2 Q 25 4, 50 2 T 100 2"
            stroke="#4f46e5"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: currentStep / (steps.length - 1) }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </svg>
      </div>

      {/* Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const Icon = stepIcons[step.icon];
          const isActive = index <= currentStep;

          return (
            <motion.div
              key={step.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div
                className={`relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                  isActive
                    ? "border-primary-600 bg-primary-600 text-white"
                    : "border-gray-300 bg-white text-gray-500"
                }`}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="h-6 w-6" />
              </motion.div>
              <div className="mt-2 text-center">
                <div className="text-sm font-medium text-gray-900">
                  {step.name}
                </div>
                <div className="text-xs text-gray-500 hidden md:block">
                  {step.description}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
