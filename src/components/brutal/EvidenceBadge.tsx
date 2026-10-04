"use client";

import React from "react";
import clsx from "clsx";

export type EvidenceStatus = "known" | "assumed" | "unknown" | "needs_verification";

export interface EvidenceBadgeProps {
  status: EvidenceStatus;
  size?: "sm" | "md";
  className?: string;
}

export function EvidenceBadge({
  status,
  size = "md",
  className,
}: EvidenceBadgeProps) {
  const configs: Record<
    EvidenceStatus,
    { label: string; bg: string; text: string }
  > = {
    known: {
      label: "KNOWN",
      bg: "bg-[#6EE7A8]",
      text: "text-black",
    },
    assumed: {
      label: "ASSUMED",
      bg: "bg-[#FF9F1C]",
      text: "text-black",
    },
    unknown: {
      label: "UNKNOWN",
      bg: "bg-[#E5E5E5]",
      text: "text-black",
    },
    needs_verification: {
      label: "NEEDS VERIFICATION",
      bg: "bg-[#7DD3FC]",
      text: "text-black",
    },
  };

  const current = configs[status] || configs.unknown;

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2.5 py-1",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center font-mono font-bold uppercase tracking-wider border-2 border-black shadow-[2px_2px_0_#000] select-none",
        current.bg,
        current.text,
        sizeClasses[size],
        className
      )}
    >
      {current.label}
    </span>
  );
}

