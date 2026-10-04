"use client";

import React from "react";
import Link from "next/link";

export function Logo({
  size = "md",
  href = "/",
}: {
  size?: "sm" | "md" | "lg";
  href?: string;
}) {
  const circleSize =
    size === "sm" ? "w-6 h-6" : size === "lg" ? "w-10 h-10" : "w-8 h-8";
  const fontSize =
    size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";

  const content = (
    <div className="inline-flex items-center gap-3 select-none group">
      <div className="relative flex items-center">
        <div
          className={`${circleSize} rounded-full bg-[#FFE600] border-[3px] border-black shadow-[2px_2px_0_#000] relative z-0 transition-transform group-hover:-translate-x-0.5`}
        />
        <div
          className={`${circleSize} rounded-full bg-[#E10600] border-[3px] border-black shadow-[2px_2px_0_#000] -ml-3 relative z-10 opacity-90 transition-transform group-hover:translate-x-0.5`}
        />
      </div>
      <span
        className={`font-black tracking-tight uppercase ${fontSize}`}
        style={{ fontFamily: "var(--font-archivo-black), var(--font-poppins), sans-serif" }}
      >
        THE UNBIAS
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
