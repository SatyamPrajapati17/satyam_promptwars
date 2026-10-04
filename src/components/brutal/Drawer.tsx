"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function Drawer({ isOpen, onClose, title, children }: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <div className="fixed inset-0 pointer-events-none flex flex-col md:flex-row justify-end items-end md:items-stretch">
            <motion.div
              initial={{ y: "100%", x: 0 }}
              animate={{ y: 0, x: 0 }}
              exit={{ y: "100%", x: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="pointer-events-auto w-full md:w-[440px] max-h-[85vh] md:max-h-full h-auto md:h-full bg-white border-t-[4px] md:border-t-0 md:border-l-[4px] border-black shadow-[-8px_0_0_#000] flex flex-col z-10"
            >
              <div className="p-4 md:p-6 border-b-2 border-black flex items-center justify-between bg-yellow-50">
                {title && (
                  <h3
                    className="text-lg font-black uppercase tracking-tight"
                    style={{ fontFamily: "var(--font-archivo-black)" }}
                  >
                    {title}
                  </h3>
                )}
                <button
                  onClick={onClose}
                  className="p-1.5 border-2 border-black bg-white hover:bg-[#FFE600] active:translate-x-0.5 active:translate-y-0.5"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5 stroke-[2.5]" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
