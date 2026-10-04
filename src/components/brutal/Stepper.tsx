"use client";

import React from "react";
import clsx from "clsx";

export interface StepperProps {
  currentStep: number;
  totalSteps?: number;
  steps?: string[];
  onStepClick?: (step: number) => void;
  className?: string;
}

export function Stepper({
  currentStep,
  totalSteps = 5,
  steps = ["FRAME", "OPTIONS", "REASONS", "IMPACT", "TIMELINE"],
  onStepClick,
  className,
}: StepperProps) {
  return (
    <div className={clsx("w-full select-none", className)}>
      <div className="grid grid-cols-5 gap-2 sm:gap-3">
        {steps.slice(0, totalSteps).map((name, index) => {
          const stepNum = index + 1;
          const isCurrent = stepNum === currentStep;
          const isCompleted = stepNum < currentStep;

          return (
            <button
              key={name}
              type="button"
              disabled={!onStepClick || stepNum > currentStep}
              onClick={() => onStepClick && onStepClick(stepNum)}
              className={clsx(
                "p-2 sm:p-3 text-left border-[3px] border-black transition-all flex flex-col justify-between min-h-[64px]",
                isCurrent &&
                  "bg-black text-[#FFE600] shadow-[4px_4px_0_#000] -translate-y-0.5",
                isCompleted &&
                  "bg-[#FFE600] text-black shadow-[2px_2px_0_#000] hover:bg-yellow-300 cursor-pointer",
                !isCurrent &&
                  !isCompleted &&
                  "bg-white text-gray-500 opacity-80 cursor-not-allowed"
              )}
            >
              <div className="font-mono text-xs font-bold flex items-center justify-between">
                <span>0{stepNum}</span>
                {isCompleted && <span>✓</span>}
              </div>
              <div
                className="text-xs sm:text-sm font-black tracking-tight uppercase truncate"
                style={{ fontFamily: "var(--font-archivo-black)" }}
              >
                {name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
