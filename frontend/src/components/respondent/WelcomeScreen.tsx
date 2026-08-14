"use client";

import React, { useEffect } from "react";
import { ThemeConfig } from "@/lib/types";
import { Clock, Play, Sparkles } from "lucide-react";

interface WelcomeScreenProps {
  title: string;
  description?: string;
  questionCount: number;
  onStart: () => void;
  theme?: ThemeConfig;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  title,
  description,
  questionCount,
  onStart,
  theme,
}) => {
  const primaryColor = theme?.primary_color || "#262626";
  const textColor = theme?.text_color || "#191919";

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        onStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onStart]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95">
      <div className="max-w-xl w-full space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <Clock className="w-3.5 h-3.5" /> Takes 1 min • {questionCount} questions
        </div>

        <h1
          className="text-4xl md:text-5xl font-black tracking-tight leading-tight"
          style={{ color: textColor }}
        >
          {title || "Welcome to this form"}
        </h1>

        {description && (
          <p className="text-lg md:text-xl text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
            {description}
          </p>
        )}

        <div className="pt-6 flex flex-col items-center gap-3">
          <button
            onClick={onStart}
            style={{ backgroundColor: primaryColor }}
            className="typeform-btn-primary flex items-center gap-2.5 px-8 py-4 text-white text-lg font-bold rounded-2xl shadow-xl hover:opacity-95 active:scale-98 transition"
          >
            Start <Play className="w-5 h-5 fill-white" />
          </button>

          <span className="text-xs text-zinc-400 font-mono">
            press <strong className="font-bold text-zinc-700 dark:text-zinc-300">Enter ↵</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
