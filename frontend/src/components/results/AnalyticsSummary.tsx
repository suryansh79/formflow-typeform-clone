"use client";

import React from "react";
import { FormAnalytics } from "@/lib/types";
import { BarChart3, Star, CheckSquare, MessageSquare, HelpCircle } from "lucide-react";

interface AnalyticsSummaryProps {
  analytics: FormAnalytics | null;
}

export const AnalyticsSummary: React.FC<AnalyticsSummaryProps> = ({ analytics }) => {
  if (!analytics || analytics.question_stats.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
        <BarChart3 className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
        <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No Responses Yet</h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
          Share your form link with respondents to begin collecting data and view summary analytics here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {analytics.question_stats.map((stat, idx) => (
        <div
          key={stat.question_id}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4"
        >
          {/* Question Header */}
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs font-mono font-bold">
                {idx + 1}
              </span>
              <div>
                <h3 className="text-base font-bold text-zinc-900 dark:text-white">
                  {stat.question_title}
                </h3>
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider capitalize">
                  {stat.question_type.replace("_", " ")} • {stat.total_answers}{" "}
                  {stat.total_answers === 1 ? "answer" : "answers"}
                </span>
              </div>
            </div>

            {stat.average_rating !== undefined && stat.average_rating !== null && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                Avg Rating: {stat.average_rating} / 5
              </div>
            )}
          </div>

          {/* Option Summary Progress Bars */}
          {stat.options_summary && stat.options_summary.length > 0 && (
            <div className="space-y-3 pt-2">
              {stat.options_summary.map((opt) => (
                <div key={opt.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    <span>{opt.label}</span>
                    <span className="font-mono text-zinc-500">
                      {opt.count} ({opt.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{ width: `${opt.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Text Responses List */}
          {stat.text_responses && stat.text_responses.length > 0 && (
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                Latest Written Responses ({stat.text_responses.length})
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {stat.text_responses.map((txt, i) => (
                  <div
                    key={i}
                    className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl text-xs text-zinc-800 dark:text-zinc-200 border border-zinc-100 dark:border-zinc-800"
                  >
                    "{txt}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
