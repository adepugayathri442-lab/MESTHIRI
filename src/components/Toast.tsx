"use client";

import React from "react";
import { CheckCircle2, Info, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  title: string;
  description: string;
  type?: "success" | "info" | "warning";
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto bg-[#172321] text-white p-4 rounded-xl shadow-2xl border border-[#C5A66B]/40 flex items-start justify-between gap-3 animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-start gap-2.5">
            {t.type === "info" ? (
              <Info className="w-5 h-5 text-[#C5A66B] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#C5A66B] shrink-0 mt-0.5" />
            )}
            <div>
              <h5 className="text-xs font-bold text-[#FAF7F0]">{t.title}</h5>
              <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">
                {t.description}
              </p>
            </div>
          </div>
          <button
            onClick={() => onDismiss(t.id)}
            className="text-stone-400 hover:text-white p-0.5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
