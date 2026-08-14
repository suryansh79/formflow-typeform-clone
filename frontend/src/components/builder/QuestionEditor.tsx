"use client";

import React from "react";
import { Question, QuestionType } from "@/lib/types";
import { QUESTION_TYPES, getQuestionIcon } from "./QuestionList";
import { Plus, Trash2, Settings2, Sparkles, Check } from "lucide-react";

interface QuestionEditorProps {
  question: Question | null;
  onUpdate: (updated: Partial<Question>) => void;
}

export const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  onUpdate,
}) => {
  if (!question) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-zinc-950 text-zinc-500">
        <Settings2 className="w-12 h-12 stroke-[1.5] mb-3 text-zinc-700" />
        <p className="text-sm font-medium">Select a question from the sidebar to edit settings</p>
      </div>
    );
  }

  const Icon = getQuestionIcon(question.type);
  const options: string[] = question.properties?.options || ["Option 1", "Option 2"];

  const handleOptionChange = (index: number, val: string) => {
    const nextOptions = [...options];
    nextOptions[index] = val;
    onUpdate({
      properties: { ...question.properties, options: nextOptions },
    });
  };

  const handleAddOption = () => {
    const nextOptions = [...options, `Option ${options.length + 1}`];
    onUpdate({
      properties: { ...question.properties, options: nextOptions },
    });
  };

  const handleDeleteOption = (index: number) => {
    if (options.length <= 1) return;
    const nextOptions = options.filter((_, i) => i !== index);
    onUpdate({
      properties: { ...question.properties, options: nextOptions },
    });
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-zinc-950 text-white">
      <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
        {/* Header with Type selector */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded-xl">
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                Question #{question.order_index + 1}
              </span>
              <span className="text-sm font-bold text-white capitalize">
                {question.type.replace("_", " ")}
              </span>
            </div>
          </div>

          <select
            value={question.type}
            onChange={(e) => onUpdate({ type: e.target.value as QuestionType })}
            className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-bold text-zinc-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {QUESTION_TYPES.map((qt) => (
              <option key={qt.type} value={qt.type}>
                {qt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Question Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Question Title *
          </label>
          <input
            type="text"
            value={question.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Type your question prompt here..."
            className="w-full px-4 py-3 bg-zinc-800/80 border border-zinc-700 rounded-2xl text-base text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold placeholder-zinc-500"
          />
        </div>

        {/* Description / Help text */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
            Description / Help Text (Optional)
          </label>
          <textarea
            rows={2}
            value={question.description || ""}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Add sub-text or guidance for respondents..."
            className="w-full px-4 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-2xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none placeholder-zinc-500"
          />
        </div>

        {/* Type-Specific Properties */}
        {(question.type === "multiple_choice" || question.type === "dropdown") && (
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
              Answer Choices ({options.length})
            </label>
            <div className="space-y-2.5">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 w-5 text-right">
                    {String.fromCharCode(65 + idx)}.
                  </span>
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={`Choice ${idx + 1}`}
                    className="flex-1 px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={() => handleDeleteOption(idx)}
                    disabled={options.length <= 1}
                    className="p-2 text-zinc-500 hover:text-red-400 disabled:opacity-30 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddOption}
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-800 text-zinc-200 text-xs font-bold rounded-xl hover:bg-zinc-700 border border-zinc-700 transition mt-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add Choice
            </button>
          </div>
        )}

        {question.type === "rating" && (
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-2">
              Maximum Stars
            </label>
            <div className="flex gap-2">
              {[3, 5, 7, 10].map((starNum) => (
                <button
                  key={starNum}
                  onClick={() =>
                    onUpdate({
                      properties: { ...question.properties, max_rating: starNum },
                    })
                  }
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                    (question.properties?.max_rating || 5) === starNum
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-md"
                      : "bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                  }`}
                >
                  {starNum} Stars
                </button>
              ))}
            </div>
          </div>
        )}

        {(question.type === "short_text" || question.type === "email" || question.type === "number") && (
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
              Input Placeholder
            </label>
            <input
              type="text"
              value={question.properties?.placeholder || ""}
              onChange={(e) =>
                onUpdate({
                  properties: { ...question.properties, placeholder: e.target.value },
                })
              }
              placeholder="e.g. Type your answer here..."
              className="w-full px-3.5 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none"
            />
          </div>
        )}

        {/* Required Toggle */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-white block">
              Required Question
            </span>
            <span className="text-[11px] text-zinc-500 block">
              Respondents cannot skip this question
            </span>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={question.required}
              onChange={(e) => onUpdate({ required: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-600 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
