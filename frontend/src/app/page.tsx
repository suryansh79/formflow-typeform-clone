"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FormListItem } from "@/lib/types";
import { FormCard } from "@/components/dashboard/FormCard";
import { CreateFormModal } from "@/components/dashboard/CreateFormModal";
import { Toast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import {
  Plus,
  Layers,
  CheckCircle2,
  FileText,
  BarChart3,
  Copy,
  ExternalLink,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [forms, setForms] = useState<FormListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [shareForm, setShareForm] = useState<FormListItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadForms = async () => {
    try {
      setLoading(true);
      const data = await api.getForms();
      setForms(data);
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to load forms from backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadForms();
  }, []);

  const handleCreateForm = async (title: string, description: string) => {
    const newForm = await api.createForm({ title, description });
    setToastMessage("Form created successfully!");
    window.location.href = `/builder/${newForm.id}`;
  };

  const handlePublishToggle = async (id: string, currentStatus: string) => {
    try {
      if (currentStatus === "published") {
        await api.unpublishForm(id);
        setToastMessage("Form saved as draft.");
      } else {
        await api.publishForm(id);
        setToastMessage("Form published! Public share link is now active.");
      }
      loadForms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      await api.duplicateForm(id);
      setToastMessage("Form duplicated successfully.");
      loadForms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    try {
      await api.deleteForm(id);
      setToastMessage("Form deleted.");
      loadForms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTriggerSeed = async () => {
    try {
      await api.triggerSeed();
      setToastMessage("Database seeded with sample forms!");
      loadForms();
    } catch (err) {
      console.error(err);
    }
  };

  const shareUrl = shareForm
    ? `${window.location.origin}/f/${shareForm.share_slug || shareForm.id}`
    : "";

  const totalForms = forms.length;
  const publishedForms = forms.filter((f) => f.status === "published").length;
  const totalResponses = forms.reduce((acc, f) => acc + f.response_count, 0);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-16">
      {/* Top Header Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-extrabold text-lg shadow-sm">
              F
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight">FormFlow</h1>
              <span className="text-[11px] font-semibold text-zinc-400 block -mt-0.5">
                Conversational Form Platform
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTriggerSeed}
              title="Seed sample forms"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-xl hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Re-seed Data
            </button>

            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex items-center gap-2 px-4.5 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition shadow-md"
            >
              <Plus className="w-4 h-4" /> Create Form
            </button>
          </div>
        </div>
      </header>

      {/* Dashboard Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Total Forms
              </span>
              <span className="text-2xl font-extrabold">{totalForms}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Published Forms
              </span>
              <span className="text-2xl font-extrabold">{publishedForms}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Total Submissions
              </span>
              <span className="text-2xl font-extrabold">{totalResponses}</span>
            </div>
          </div>
        </div>

        {/* Form List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">Your Workspace Forms</h2>
            <span className="text-xs text-zinc-400 font-semibold">
              Showing {forms.length} forms
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse"
                />
              ))}
            </div>
          ) : forms.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8">
              <FileText className="w-12 h-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-3" />
              <h3 className="text-base font-bold">No forms created yet</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mt-1 mb-4">
                Get started by creating your first interactive conversational form.
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition shadow-md"
              >
                <Plus className="w-4 h-4" /> Create First Form
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {forms.map((f) => (
                <FormCard
                  key={f.id}
                  form={f}
                  onPublishToggle={handlePublishToggle}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onShare={(form) => setShareForm(form)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Form Modal */}
      <CreateFormModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateForm}
      />

      {/* Share Link Modal */}
      {shareForm && (
        <Modal
          isOpen={!!shareForm}
          onClose={() => setShareForm(null)}
          title="Shareable Public Link"
        >
          <div className="space-y-4">
            <p className="text-xs text-zinc-500">
              Anyone with this link can fill out your form with the full 1-question-at-a-time conversational experience. No login required.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg text-xs font-mono text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  setToastMessage("Public link copied to clipboard!");
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition flex items-center gap-1.5 shrink-0"
              >
                <Copy className="w-3.5 h-3.5" /> Copy
              </button>
            </div>

            <div className="pt-2 flex justify-end">
              <a
                href={`/f/${shareForm.share_slug || shareForm.id}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Open in new tab <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}
    </div>
  );
}
