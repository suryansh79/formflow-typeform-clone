"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { ResponseOut, Question } from "@/lib/types";
import { Calendar, Clock, CheckCircle2 } from "lucide-react";

interface ResponseDetailModalProps {
  response: ResponseOut | null;
  questions: Question[];
  onClose: () => void;
}

export const ResponseDetailModal: React.FC<ResponseDetailModalProps> = ({
  response,
  questions,
  onClose,
}) => {
  if (!response) return null;

  const ansMap = new Map(response.answers.map((a) => [a.question_id, a.value]));
  const submittedDate = new Date(response.submitted_at).toLocaleString();

  return (
    <Modal isOpen={!!response} onClose={onClose} title="Individual Submission Details">
      <div className="space-y-6">
        {/* Metadata Header */}
        <div className="p-4 bg-zinc-50 dark:bg-zinc-800/80 rounded-xl border border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{submittedDate}</span>
          </div>
          {response.completion_time_seconds && (
            <div className="flex items-center gap-1 font-mono font-bold">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Time: {response.completion_time_seconds}s</span>
            </div>
          )}
        </div>

        {/* Answers List */}
        <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
          {questions.map((q, idx) => {
            const val = ansMap.get(q.id);
            const displayVal =
              val !== undefined && val !== null
                ? typeof val === "object"
                  ? JSON.stringify(val)
                  : String(val)
                : "No response provided";

            return (
              <div
                key={q.id}
                className="p-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1.5"
              >
                <div className="text-xs font-bold text-zinc-400">
                  Question {idx + 1}
                </div>
                <div className="text-sm font-bold text-zinc-900 dark:text-white">
                  {q.title}
                </div>
                <div className="text-sm font-semibold text-blue-600 dark:text-blue-400 pt-1">
                  {displayVal}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
