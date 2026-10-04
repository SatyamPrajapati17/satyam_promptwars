"use client";

import React from "react";
import clsx from "clsx";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string | number;
  width?: string | number;
}

export function Skeleton({
  height = "2rem",
  width = "100%",
  className,
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        "bg-gray-200 border-2 border-black/30 shadow-[2px_2px_0_rgba(0,0,0,0.15)] relative overflow-hidden",
        className
      )}
      style={{
        height,
        width,
        backgroundImage:
          "repeating-linear-gradient(45deg, #f3f4f6, #f3f4f6 10px, #e5e7eb 10px, #e5e7eb 20px)",
        ...style,
      }}
      {...props}
    />
  );
}

