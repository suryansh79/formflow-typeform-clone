"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose: () => void;
  duration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = "success",
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColor =
    type === "success"
      ? "bg-zinc-900 text-white border-zinc-700"
      : type === "error"
      ? "bg-red-900 text-white border-red-700"
      : "bg-blue-900 text-white border-blue-700";

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl text-sm font-medium transition-all transform animate-in slide-in-from-bottom-5 ${bgColor}`}
    >
      {type === "success" && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
      {type === "error" && <AlertCircle className="w-4 h-4 text-red-400" />}
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:opacity-70 text-zinc-400 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
