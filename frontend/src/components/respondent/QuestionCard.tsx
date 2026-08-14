"use client";

import React, { useEffect, useRef } from "react";
import { Question, ThemeConfig } from "@/lib/types";
import { Check, ChevronRight, Star } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  index: number;
  totalQuestions: number;
  value: any;
  onChange: (val: any) => void;
  onNext: () => void;
  error?: string | null;
  theme?: ThemeConfig;
  isSubmitting?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  index,
  totalQuestions,
  value,
  onChange,
  onNext,
  error,
  theme,
  isSubmitting = false,
}) => {
  const inputRef = useRef<any>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [question.id]);

  const primaryColor = theme?.primary_color || "#262626";
  const textColor = theme?.text_color || "#191919";

  const options: string[] = question.properties?.options || ["Option 1", "Option 2"];
  const maxRating = question.properties?.max_rating || 5;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-8">
      {/* Index Badge & Question Header */}
      <div className="flex items-start gap-3.5 mb-2">
        <span
          className="font-mono text-base md:text-lg font-extrabold flex items-center gap-0.5 shrink-0 mt-1"
          style={{ color: primaryColor }}
        >
          {index + 1}
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </span>
        <div>
          <h1
            className="text-2xl md:text-4xl font-extrabold tracking-tight leading-snug"
            style={{ color: textColor }}
          >
            {question.title || "Untitled Question"}
            {question.required && <span className="text-red-500 ml-1.5">*</span>}
          </h1>
          {question.description && (
            <p className="mt-2.5 text-base md:text-lg text-zinc-500 dark:text-zinc-400 font-normal leading-relaxed">
              {question.description}
            </p>
          )}
        </div>
      </div>

      {/* Answer Input Controls */}
      <div className="mt-8 ml-0 md:ml-9 space-y-4">
        {/* SHORT TEXT & EMAIL & NUMBER */}
        {(question.type === "short_text" ||
          question.type === "email" ||
          question.type === "number") && (
          <div>
            <input
              ref={inputRef}
              type={
                question.type === "email"
                  ? "email"
                  : question.type === "number"
                  ? "number"
                  : "text"
              }
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onNext();
                }
              }}
              placeholder={question.properties?.placeholder || "Type your answer here..."}
              className="w-full px-0 py-3 text-xl md:text-3xl font-medium bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 focus:border-black dark:focus:border-white focus:outline-none transition-colors"
              style={{ color: textColor }}
            />
          </div>
        )}

        {/* LONG TEXT */}
        {question.type === "long_text" && (
          <div>
            <textarea
              ref={inputRef}
              rows={4}
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={question.properties?.placeholder || "Type your response..."}
              className="w-full p-4 text-lg bg-zinc-50 dark:bg-zinc-800/80 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:border-black focus:outline-none transition-all resize-none shadow-inner"
              style={{ color: textColor }}
            />
          </div>
        )}

        {/* MULTIPLE CHOICE */}
        {question.type === "multiple_choice" && (
          <div className="space-y-3">
            {options.map((opt, idx) => {
              const letterKey = String.fromCharCode(65 + idx);
              const isSelected = value === opt;

              return (
                <button
                  key={idx}
                  onClick={() => {
                    onChange(opt);
                    setTimeout(() => onNext(), 200);
                  }}
                  className={`typeform-choice-btn w-full flex items-center justify-between p-4 md:p-4.5 rounded-2xl border-2 text-left transition-all ${
                    isSelected
                      ? "selected border-black dark:border-white bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md scale-[1.01]"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 dark:hover:border-zinc-600 text-zinc-900 dark:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <span
                      className={`typeform-key-box inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold uppercase transition ${
                        isSelected
                          ? "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {letterKey}
                    </span>
                    <span className="text-base md:text-lg font-semibold">
                      {opt}
                    </span>
                  </div>
                  {isSelected && (
                    <Check className="w-5 h-5 text-emerald-400 dark:text-emerald-600 shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* DROPDOWN */}
        {question.type === "dropdown" && (
          <div>
            <select
              value={value ?? ""}
              onChange={(e) => {
                onChange(e.target.value);
                setTimeout(() => onNext(), 200);
              }}
              className="w-full p-4 text-base font-semibold bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 rounded-2xl focus:border-black focus:outline-none transition shadow-sm"
              style={{ color: textColor }}
            >
              <option value="">Select an option...</option>
              {options.map((opt, idx) => (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* YES / NO */}
        {question.type === "yes_no" && (
          <div className="grid grid-cols-2 gap-4">
            {["Yes", "No"].map((opt) => {
              const keyBadge = opt === "Yes" ? "Y" : "N";
              const isSelected = value === opt;

              return (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setTimeout(() => onNext(), 200);
                  }}
                  className={`typeform-choice-btn flex items-center justify-between p-5 rounded-2xl border-2 text-center transition-all ${
                    isSelected
                      ? "selected border-black dark:border-white bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-md scale-[1.02]"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-zinc-400 text-zinc-900 dark:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`typeform-key-box inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-mono font-bold transition ${
                        isSelected
                          ? "bg-white text-zinc-900 dark:bg-zinc-900 dark:text-white"
                          : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                      }`}
                    >
                      {keyBadge}
                    </span>
                    <span className="text-lg font-bold">
                      {opt}
                    </span>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-emerald-400" />}
                </button>
              );
            })}
          </div>
        )}

        {/* RATING */}
        {question.type === "rating" && (
          <div className="flex flex-wrap items-center gap-3">
            {Array.from({ length: maxRating }).map((_, i) => {
              const starValue = i + 1;
              const isSelected = Number(value) >= starValue;

              return (
                <button
                  key={starValue}
                  onClick={() => {
                    onChange(starValue);
                    setTimeout(() => onNext(), 200);
                  }}
                  className={`p-4 rounded-2xl border-2 flex items-center justify-center transition-all transform hover:scale-110 ${
                    isSelected
                      ? "border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-500 shadow-md"
                      : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-300 dark:text-zinc-700 hover:border-amber-300"
                  }`}
                >
                  <Star
                    className={`w-8 h-8 ${
                      isSelected ? "fill-amber-400 text-amber-400" : ""
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Error Badge */}
        {error && (
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-xl text-xs font-semibold animate-shake">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Signature Typeform OK Button */}
        <div className="pt-4 flex items-center gap-3">
          <button
            onClick={onNext}
            disabled={isSubmitting}
            style={{ backgroundColor: primaryColor }}
            className="typeform-ok-btn flex items-center gap-2 px-8 py-3.5 text-white text-base font-extrabold rounded-2xl shadow-xl hover:opacity-95 transition"
          >
            {index === totalQuestions - 1 ? (
              isSubmitting ? (
                "Submitting..."
              ) : (
                "Submit"
              )
            ) : (
              <>
                OK <Check className="w-5 h-5 stroke-[2.5]" />
              </>
            )}
          </button>

          <span className="hidden md:flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
            press <strong className="font-bold text-zinc-800 dark:text-zinc-200">Enter ↵</strong>
          </span>
        </div>
      </div>
    </div>
  );
};
