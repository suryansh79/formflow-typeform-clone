"use client";

import React, { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { Form, Question, QuestionType, ThemeConfig } from "@/lib/types";
import { QuestionList } from "@/components/builder/QuestionList";
import { QuestionEditor } from "@/components/builder/QuestionEditor";
import { LivePreview } from "@/components/builder/LivePreview";
import { ThemeEditor } from "@/components/builder/ThemeEditor";
import { Toast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  BarChart3,
  Palette,
  Edit3,
} from "lucide-react";

export default function FormBuilderPage({ params }: { params: Promise<{ formId: string }> }) {
  const { formId } = use(params);

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"builder" | "theme">("builder");
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);

  const loadForm = async () => {
    try {
      setLoading(true);
      const data = await api.getForm(formId);
      setForm(data);
      if (data.questions.length > 0 && !activeQuestionId) {
        setActiveQuestionId(data.questions[0].id);
      }
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to load form detail.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForm();
  }, [formId]);

  const handleUpdateTitle = async (newTitle: string) => {
    if (!form) return;
    setForm({ ...form, title: newTitle });
    await api.updateForm(form.id, { title: newTitle });
  };

  const handlePublishToggle = async () => {
    if (!form) return;
    try {
      if (form.status === "published") {
        const updated = await api.unpublishForm(form.id);
        setForm(updated);
        setToastMessage("Form saved as draft.");
      } else {
        const updated = await api.publishForm(form.id);
        setForm(updated);
        setToastMessage("Form published! Link is active.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddQuestion = async (type: QuestionType) => {
    if (!form) return;
    try {
      const defaultTitleMap: Record<QuestionType, string> = {
        short_text: "What is your full name?",
        long_text: "Please share any additional details...",
        multiple_choice: "Which option do you prefer?",
        dropdown: "Select your country/region",
        email: "What is your email address?",
        number: "How many items would you like?",
        yes_no: "Do you agree to the terms?",
        rating: "How would you rate our service?",
      };

      const newQ = await api.addQuestion(form.id, {
        type,
        title: defaultTitleMap[type] || "Untitled Question",
        required: false,
        properties: type === "multiple_choice" || type === "dropdown" ? { options: ["Option 1", "Option 2"] } : {},
      });

      setForm((prev) => (prev ? { ...prev, questions: [...prev.questions, newQ] } : null));
      setActiveQuestionId(newQ.id);
      setToastMessage("Question added!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateQuestion = async (updated: Partial<Question>) => {
    if (!activeQuestionId || !form) return;
    setForm((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        questions: prev.questions.map((q) => (q.id === activeQuestionId ? { ...q, ...updated } : q)),
      };
    });
    await api.updateQuestion(activeQuestionId, updated);
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!form) return;
    try {
      await api.deleteQuestion(qId);
      const remaining = form.questions.filter((q) => q.id !== qId);
      setForm({ ...form, questions: remaining });
      if (activeQuestionId === qId) {
        setActiveQuestionId(remaining.length > 0 ? remaining[0].id : null);
      }
      setToastMessage("Question deleted.");
    } catch (err) {
      console.error(err);
    }
  };

  const handleReorderQuestions = async (newQuestions: Question[]) => {
    if (!form) return;
    setForm({ ...form, questions: newQuestions });
    await api.reorderQuestions(
      form.id,
      newQuestions.map((q) => q.id)
    );
  };

  const handleUpdateTheme = async (newTheme: ThemeConfig) => {
    if (!form) return;
    setForm({ ...form, theme_config: newTheme });
    await api.updateForm(form.id, { theme_config: newTheme });
  };

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-zinc-400">Loading FormFlow Studio...</p>
        </div>
      </div>
    );
  }

  const activeQuestion = form.questions.find((q) => q.id === activeQuestionId) || null;
  const isPublished = form.status === "published";
  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/f/${form.share_slug || form.id}`;

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Studio Header Toolbar */}
      <header className="h-14 bg-zinc-900 border-b border-zinc-800 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={form.title}
              onChange={(e) => handleUpdateTitle(e.target.value)}
              className="text-sm font-bold bg-transparent px-2 py-1 rounded hover:bg-zinc-800 focus:bg-zinc-800 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition max-w-xs truncate text-white"
            />
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                isPublished
                  ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                  : "bg-zinc-800 text-zinc-400 border border-zinc-700"
              }`}
            >
              {isPublished ? "Published" : "Draft"}
            </span>
          </div>
        </div>

        {/* Center Studio Nav Tabs */}
        <div className="flex items-center gap-1 bg-zinc-950 p-1 rounded-xl border border-zinc-800">
          <button
            onClick={() => setActiveTab("builder")}
            className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-lg transition ${
              activeTab === "builder"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Content
          </button>
          <button
            onClick={() => setActiveTab("theme")}
            className={`flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold rounded-lg transition ${
              activeTab === "theme"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Design
          </button>
          <Link
            href={`/forms/${form.id}/results`}
            className="flex items-center gap-1.5 px-3.5 py-1 text-xs font-bold text-zinc-400 hover:text-white transition"
          >
            <BarChart3 className="w-3.5 h-3.5" /> Results ({form.response_count})
          </Link>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {isPublished && (
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-950/80 text-blue-300 border border-blue-800 text-xs font-bold rounded-xl hover:bg-blue-900 transition"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Share Link
            </button>
          )}

          <button
            onClick={handlePublishToggle}
            className={`flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold rounded-xl transition shadow-md ${
              isPublished
                ? "bg-zinc-800 text-zinc-200 hover:bg-zinc-700 border border-zinc-700"
                : "bg-emerald-600 text-white hover:bg-emerald-500 font-extrabold"
            }`}
          >
            {isPublished ? "Unpublish" : "Publish Form"}
          </button>
        </div>
      </header>

      {/* Studio Content Layout */}
      <div className="flex-1 flex overflow-hidden">
        {activeTab === "builder" ? (
          <>
            <QuestionList
              questions={form.questions}
              activeQuestionId={activeQuestionId}
              onSelectQuestion={(id) => setActiveQuestionId(id)}
              onAddQuestion={handleAddQuestion}
              onDeleteQuestion={handleDeleteQuestion}
              onReorderQuestions={handleReorderQuestions}
            />

            <QuestionEditor
              question={activeQuestion}
              onUpdate={handleUpdateQuestion}
            />

            <LivePreview
              questions={form.questions}
              activeQuestionId={activeQuestionId}
              theme={form.theme_config}
            />
          </>
        ) : (
          <div className="flex-1 overflow-y-auto bg-zinc-950 text-white">
            <ThemeEditor theme={form.theme_config} onChange={handleUpdateTheme} />
          </div>
        )}
      </div>

      {/* Share Modal */}
      {isShareOpen && (
        <Modal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} title="Shareable Public Link">
          <div className="space-y-4">
            <p className="text-xs text-zinc-400">
              Share this link with respondents for the full conversational respondent experience:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-zinc-800 rounded-xl text-xs font-mono text-white border border-zinc-700"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setToastMessage("Link copied to clipboard!");
                }}
                className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-500 transition"
              >
                Copy
              </button>
            </div>
            <div className="pt-2 flex justify-end">
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1"
              >
                Open respondent view <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
