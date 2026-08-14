"use client";

import React from "react";
import Link from "next/link";
import { FormListItem } from "@/lib/types";
import {
  FileText,
  BarChart3,
  ExternalLink,
  Copy,
  Trash2,
  Globe,
  Lock,
  Edit3,
} from "lucide-react";

interface FormCardProps {
  form: FormListItem;
  onPublishToggle: (id: string, currentStatus: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (form: FormListItem) => void;
}

export const FormCard: React.FC<FormCardProps> = ({
  form,
  onPublishToggle,
  onDuplicate,
  onDelete,
  onShare,
}) => {
  const isPublished = form.status === "published";

  return (
    <div className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 hover:shadow-xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* Status Badge & Actions Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              isPublished
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700"
            }`}
          >
            {isPublished ? (
              <>
                <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Published
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-zinc-500" />
                Draft
              </>
            )}
          </span>

          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
            <button
              onClick={() => onDuplicate(form.id)}
              title="Duplicate form"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(form.id)}
              title="Delete form"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Title & Description */}
        <Link href={`/builder/${form.id}`}>
          <h3 className="text-xl font-bold text-zinc-900 dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition line-clamp-1 mb-1.5">
            {form.title}
          </h3>
        </Link>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 min-h-[34px] leading-relaxed">
          {form.description || "No description provided."}
        </p>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800/80">
        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          <span className="flex items-center gap-1.5 font-medium">
            <FileText className="w-4 h-4 text-zinc-400" />
            {form.question_count} {form.question_count === 1 ? "question" : "questions"}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <BarChart3 className="w-4 h-4 text-zinc-400" />
            <strong className="text-zinc-900 dark:text-white font-bold">
              {form.response_count}
            </strong>{" "}
            {form.response_count === 1 ? "response" : "responses"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
          <Link
            href={`/builder/${form.id}`}
            className="flex items-center justify-center gap-1 py-2.5 px-3 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition shadow-sm font-bold"
          >
            <Edit3 className="w-3.5 h-3.5" /> Builder
          </Link>

          <Link
            href={`/forms/${form.id}/results`}
            className="flex items-center justify-center gap-1 py-2.5 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition font-semibold"
          >
            Results
          </Link>

          {isPublished ? (
            <button
              onClick={() => onShare(form)}
              className="flex items-center justify-center gap-1 py-2.5 px-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Share
            </button>
          ) : (
            <button
              onClick={() => onPublishToggle(form.id, form.status)}
              className="flex items-center justify-center gap-1 py-2.5 px-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition font-semibold"
            >
              Publish
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
