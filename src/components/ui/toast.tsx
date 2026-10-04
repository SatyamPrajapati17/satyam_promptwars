"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type?: ToastType;
}

interface ToastContextType {
  toast: (item: Omit<ToastItem, "id">) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ title, message, type = "info" }: Omit<ToastItem, "id">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prev) => [...prev, { id, title, message, type }]);

      setTimeout(() => {
        removeToast(id);
      }, 4500);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ toast, removeToast }}>
      {children}
      <aside
        aria-label="Notifications"
        aria-live="polite"
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto bg-white border-[3px] border-black shadow-[4px_4px_0_#000] p-4 flex items-start gap-3"
            >
              <div className="shrink-0 mt-0.5">
                {t.type === "success" && (
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                )}
                {t.type === "error" && (
                  <AlertTriangle className="w-5 h-5 text-[#E10600]" />
                )}
                {t.type === "warning" && (
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                )}
                {t.type === "info" && <Info className="w-5 h-5 text-sky-600" />}
              </div>
              <div className="flex-1 min-w-0">
                {t.title && (
                  <h4 className="font-bold text-sm uppercase tracking-wide">
                    {t.title}
                  </h4>
                )}
                <p className="text-sm font-medium text-gray-800 break-words">
                  {t.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-black hover:bg-yellow-200 p-1 border border-transparent hover:border-black transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </aside>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
