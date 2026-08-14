"use client";

import React, { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { Form, ResponseOut, FormAnalytics } from "@/lib/types";
import { AnalyticsSummary } from "@/components/results/AnalyticsSummary";
import { ResponsesTable } from "@/components/results/ResponsesTable";
import { ResponseDetailModal } from "@/components/results/ResponseDetailModal";
import { Toast } from "@/components/ui/Toast";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  BarChart3,
  ListFilter,
  Layers,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function FormResultsPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const { formId } = use(params);

  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<ResponseOut[]>([]);
  const [analytics, setAnalytics] = useState<FormAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"analytics" | "responses">("analytics");
  const [selectedResponse, setSelectedResponse] = useState<ResponseOut | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [formData, respData, analyticsData] = await Promise.all([
        api.getForm(formId),
        api.getResponses(formId),
        api.getAnalytics(formId),
      ]);
      setForm(formData);
      setResponses(respData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error(err);
      setToastMessage("Failed to load response data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [formId]);

  if (loading || !form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-semibold text-zinc-500">Loading Results...</p>
        </div>
      </div>
    );
  }

  const csvUrl = api.getCSVExportUrl(form.id);

  // Compute average completion time
  const times = responses
    .map((r) => r.completion_time_seconds)
    .filter((t): t is number => typeof t === "number");
  const avgTime =
    times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 pb-16">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-base font-bold tracking-tight">{form.title}</h1>
              <span className="text-xs text-zinc-400 font-semibold block -mt-0.5">
                Responses & Analytics Dashboard
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/builder/${form.id}`}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
            >
              Back to Builder
            </Link>

            <a
              href={csvUrl}
              download
              className="flex items-center gap-1.5 px-4 py-2 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold rounded-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 transition shadow-sm"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-6 pt-8 space-y-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Total Submissions
              </span>
              <span className="text-2xl font-extrabold">{responses.length}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Avg. Completion Time
              </span>
              <span className="text-2xl font-extrabold">
                {avgTime > 0 ? `${avgTime}s` : "N/A"}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-xl">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Completion Rate
              </span>
              <span className="text-2xl font-extrabold">100%</span>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Content */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-2">
            <button
              onClick={() => setActiveTab("analytics")}
              className={`flex items-center gap-2 pb-2 px-3 text-sm font-bold border-b-2 transition ${
                activeTab === "analytics"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Question Summary
            </button>
            <button
              onClick={() => setActiveTab("responses")}
              className={`flex items-center gap-2 pb-2 px-3 text-sm font-bold border-b-2 transition ${
                activeTab === "responses"
                  ? "border-blue-600 text-blue-600 dark:text-blue-400"
                  : "border-transparent text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <ListFilter className="w-4 h-4" /> All Submissions ({responses.length})
            </button>
          </div>

          {activeTab === "analytics" ? (
            <AnalyticsSummary analytics={analytics} />
          ) : (
            <ResponsesTable
              responses={responses}
              questions={form.questions}
              onSelectResponse={(resp) => setSelectedResponse(resp)}
            />
          )}
        </div>
      </main>

      {/* Response Detail Modal */}
      <ResponseDetailModal
        response={selectedResponse}
        questions={form.questions}
        onClose={() => setSelectedResponse(null)}
      />

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
    </div>
  );
}
