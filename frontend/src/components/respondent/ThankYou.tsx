"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { CheckCircle2, RotateCcw } from "lucide-react";
import { ThemeConfig } from "@/lib/types";

interface ThankYouProps {
  title?: string;
  message?: string;
  theme?: ThemeConfig;
  onReset?: () => void;
}

export const ThankYou: React.FC<ThankYouProps> = ({
  title = "Thank you!",
  message = "Your response has been registered successfully.",
  theme,
  onReset,
}) => {
  useEffect(() => {
    // Trigger confetti explosion on load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const primaryColor = theme?.primary_color || "#2563eb";
  const textColor = theme?.text_color || "#18181b";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95">
      <div className="max-w-md w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg border border-zinc-200 dark:border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div
          className="w-20 h-20 mx-auto rounded-full flex items-center justify-center shadow-lg"
          style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
        >
          <CheckCircle2 className="w-12 h-12" style={{ color: primaryColor }} />
        </div>

        <h1
          className="text-3xl font-extrabold tracking-tight"
          style={{ color: textColor }}
        >
          {title}
        </h1>

        <p className="text-base text-zinc-500 dark:text-zinc-400 font-medium">
          {message}
        </p>

        {onReset && (
          <div className="pt-4">
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-sm font-semibold rounded-xl hover:opacity-90 transition shadow-sm"
            >
              <RotateCcw className="w-4 h-4" /> Submit Another Response
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
