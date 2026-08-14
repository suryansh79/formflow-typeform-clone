"use client";

import React from "react";
import { ResponseOut, Question } from "@/lib/types";
import { Clock, Eye, FileText } from "lucide-react";

interface ResponsesTableProps {
  responses: ResponseOut[];
  questions: Question[];
  onSelectResponse: (resp: ResponseOut) => void;
}

export const ResponsesTable: React.FC<ResponsesTableProps> = ({
  responses,
  questions,
  onSelectResponse,
}) => {
  if (responses.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
        <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
        <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">No Submissions Recorded</h3>
        <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1">
          When respondents submit your form, their individual responses will appear in this table.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              <th className="py-3 px-4">#</th>
              <th className="py-3 px-4">Submitted At</th>
              <th className="py-3 px-4">Time Spent</th>
              {questions.slice(0, 4).map((q) => (
                <th key={q.id} className="py-3 px-4 min-w-[140px] truncate">
                  {q.title}
                </th>
              ))}
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
            {responses.map((resp, idx) => {
              const ansMap = new Map(resp.answers.map((a) => [a.question_id, a.value]));
              const submittedDate = new Date(resp.submitted_at).toLocaleString();

              return (
                <tr
                  key={resp.id}
                  onClick={() => onSelectResponse(resp)}
                  className="hover:bg-blue-50/50 dark:hover:bg-zinc-800/50 transition cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-bold text-zinc-400">
                    {responses.length - idx}
                  </td>
                  <td className="py-3 px-4 text-zinc-700 dark:text-zinc-300 font-medium">
                    {submittedDate}
                  </td>
                  <td className="py-3 px-4 text-zinc-500 font-mono">
                    {resp.completion_time_seconds
                      ? `${resp.completion_time_seconds}s`
                      : "—"}
                  </td>
                  {questions.slice(0, 4).map((q) => {
                    const val = ansMap.get(q.id);
                    const displayVal =
                      val !== undefined && val !== null
                        ? typeof val === "object"
                          ? JSON.stringify(val)
                          : String(val)
                        : "—";

                    return (
                      <td key={q.id} className="py-3 px-4 text-zinc-800 dark:text-zinc-200 truncate max-w-xs">
                        {displayVal}
                      </td>
                    );
                  })}
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectResponse(resp);
                      }}
                      className="p-1.5 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold inline-flex items-center gap-1 transition"
                    >
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
