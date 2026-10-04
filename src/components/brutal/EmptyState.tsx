"use client";

import React from "react";
import { Compass } from "lucide-react";
import { Button } from "./Button";

export interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title = "YOUR REASONING WORKSPACE IS EMPTY",
  description = "Start with one decision you are carrying around. You do not need to know the answer yet.",
  actionLabel = "Inspect Your First Decision",
  onAction,
  actionHref = "/decisions/new",
  secondaryActionLabel,
  onSecondaryAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="bg-white border-[3px] border-black shadow-[6px_6px_0_#000] p-8 sm:p-12 text-center max-w-2xl mx-auto my-8">
      <div className="w-16 h-16 bg-[#FFE600] border-[3px] border-black shadow-[4px_4px_0_#000] mx-auto mb-6 flex items-center justify-center">
        {icon || <Compass className="w-8 h-8 text-black stroke-[2.5]" />}
      </div>
      <h3
        className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-black mb-3"
        style={{ fontFamily: "var(--font-archivo-black)" }}
      >
        {title}
      </h3>
      <p className="text-gray-800 font-medium text-base sm:text-lg max-w-lg mx-auto mb-8">
        {description}
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {actionLabel && (
          <Button
            variant="primary"
            size="lg"
            href={actionHref}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
        {secondaryActionLabel && onSecondaryAction && (
          <Button variant="secondary" size="lg" onClick={onSecondaryAction}>
            {secondaryActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
}

