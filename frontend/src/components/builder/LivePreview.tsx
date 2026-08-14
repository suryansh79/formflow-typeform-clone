"use client";

import React, { useState } from "react";
import { Question, ThemeConfig } from "@/lib/types";
import { QuestionCard } from "@/components/respondent/QuestionCard";
import { Eye, Smartphone, Monitor } from "lucide-react";

interface LivePreviewProps {
  questions: Question[];
  activeQuestionId: string | null;
  theme?: ThemeConfig;
}

export const LivePreview: React.FC<LivePreviewProps> = ({
  questions,
  activeQuestionId,
  theme,
}) => {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const activeIndex = questions.findIndex((q) => q.id === activeQuestionId);
  const currentIdx = activeIndex !== -1 ? activeIndex : 0;
  const currentQ = questions[currentIdx];

  const primaryColor = theme?.primary_color || "#2563eb";
  const bgColor = theme?.background_color || "#ffffff";

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-100 dark:bg-zinc-950 border-l border-zinc-200 dark:border-zinc-800 overflow-hidden">
      {/* Header controls for Live Preview */}
      <div className="px-4 py-3 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 dark:text-zinc-400">
          <Eye className="w-4 h-4 text-blue-600" />
          <span>Interactive Live Preview</span>
        </div>

        <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-800 p-1 rounded-lg">
          <button
            onClick={() => setDevice("desktop")}
            className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
              device === "desktop"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <Monitor className="w-3.5 h-3.5" /> Desktop
          </button>
          <button
            onClick={() => setDevice("mobile")}
            className={`p-1.5 rounded-md text-xs font-semibold flex items-center gap-1 transition ${
              device === "mobile"
                ? "bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm"
                : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" /> Mobile
          </button>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 flex items-center justify-center p-4 md:p-8 overflow-y-auto">
        <div
          className={`w-full transition-all duration-300 shadow-2xl rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 flex flex-col justify-center min-h-[500px] ${
            device === "mobile" ? "max-w-sm h-[640px]" : "max-w-2xl h-full max-h-[600px]"
          }`}
          style={{ backgroundColor: bgColor }}
        >
          {currentQ ? (
            <QuestionCard
              question={currentQ}
              index={currentIdx}
              totalQuestions={questions.length}
              value={answers[currentQ.id]}
              onChange={(val) =>
                setAnswers((prev) => ({ ...prev, [currentQ.id]: val }))
              }
              onNext={() => {}}
              theme={theme}
            />
          ) : (
            <div className="text-center p-8 text-xs text-zinc-400">
              No questions to preview. Add questions in the builder.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
