"use client";

import React from "react";
import { ChevronUp, ChevronDown, Sparkles } from "lucide-react";

interface ProgressBarProps {
  currentIndex: number;
  totalQuestions: number;
  onPrev: () => void;
  onNext: () => void;
  primaryColor?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  currentIndex,
  totalQuestions,
  onPrev,
  onNext,
  primaryColor = "#262626",
}) => {
  const percentage = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-zinc-200/80 dark:border-zinc-800/80 px-6 md:px-8 py-3 flex items-center justify-between">
      {/* Progress Bar & Percentage */}
      <div className="flex items-center gap-3.5 flex-1 max-w-xs md:max-w-md">
        <div className="flex-1 h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300 rounded-full shadow-sm"
            style={{ width: `${percentage}%`, backgroundColor: primaryColor }}
          />
        </div>
        <span className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 shrink-0">
          {percentage}%
        </span>
      </div>

      {/* Typeform Branding */}
      <div className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 bg-zinc-100 dark:bg-zinc-800/80 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-300 border border-zinc-200/60 dark:border-zinc-700/60">
        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Powered by Typeform
      </div>

      {/* Chevron Navigation Controls */}
      <div className="flex items-center bg-zinc-100 dark:bg-zinc-800 p-0.5 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <button
          onClick={onPrev}
          disabled={currentIndex === 0}
          title="Previous question (Up arrow)"
          className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg disabled:opacity-30 transition shadow-sm"
        >
          <ChevronUp className="w-4 h-4 stroke-[2.5]" />
        </button>
        <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-700" />
        <button
          onClick={onNext}
          disabled={currentIndex === totalQuestions - 1}
          title="Next question (Down arrow)"
          className="p-2 text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 rounded-lg disabled:opacity-30 transition shadow-sm"
        >
          <ChevronDown className="w-4 h-4 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
