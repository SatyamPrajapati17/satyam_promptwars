"use client";

import React, { useEffect, useState } from "react";
import { WifiOff } from "lucide-react";

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="bg-black text-[#FFE600] border-b-[3px] border-black px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 select-none z-50 sticky top-0">
      <WifiOff className="w-4 h-4 text-[#E10600]" />
      <span>YOU ARE CURRENTLY OFFLINE — CHANGES WILL SYNC ON RECONNECT</span>
    </div>
  );
}

