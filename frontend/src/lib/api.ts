import {
  Form,
  FormListItem,
  Question,
  ResponseOut,
  FormAnalytics,
  ResponseSubmit,
  QuestionType,
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error (${res.status}): ${errorText}`);
  }

  return res.json();
}

export const api = {
  // Forms
  getForms: () => fetchJSON<FormListItem[]>("/forms"),
  
  getForm: (id: string) => fetchJSON<Form>(`/forms/${id}`),

  createForm: (data: { title: string; description?: string }) =>
    fetchJSON<Form>("/forms", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  updateForm: (id: string, data: Partial<Form>) =>
    fetchJSON<Form>(`/forms/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteForm: (id: string) =>
    fetchJSON<{ message: string }>(`/forms/${id}`, {
      method: "DELETE",
    }),

  duplicateForm: (id: string) =>
    fetchJSON<Form>(`/forms/${id}/duplicate`, {
      method: "POST",
    }),

  publishForm: (id: string) =>
    fetchJSON<Form>(`/forms/${id}/publish`, {
      method: "POST",
    }),

  unpublishForm: (id: string) =>
    fetchJSON<Form>(`/forms/${id}/unpublish`, {
      method: "POST",
    }),

  // Questions
  addQuestion: (formId: string, question: { type: QuestionType; title: string; description?: string; required?: boolean; properties?: any }) =>
    fetchJSON<Question>(`/forms/${formId}/questions`, {
      method: "POST",
      body: JSON.stringify(question),
    }),

  updateQuestion: (questionId: string, data: Partial<Question>) =>
    fetchJSON<Question>(`/questions/${questionId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  deleteQuestion: (questionId: string) =>
    fetchJSON<{ message: string }>(`/questions/${questionId}`, {
      method: "DELETE",
    }),

  reorderQuestions: (formId: string, questionIds: string[]) =>
    fetchJSON<{ message: string }>(`/forms/${formId}/questions/reorder`, {
      method: "POST",
      body: JSON.stringify({ question_ids: questionIds }),
    }),

  // Public Respondent Flow
  getPublicForm: (identifier: string) => fetchJSON<Form>(`/forms/public/${identifier}`),

  submitResponse: (formId: string, data: ResponseSubmit) =>
    fetchJSON<ResponseOut>(`/forms/public/${formId}/submit`, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  // Results & Analytics
  getResponses: (formId: string) => fetchJSON<ResponseOut[]>(`/forms/${formId}/responses`),

  getAnalytics: (formId: string) => fetchJSON<FormAnalytics>(`/forms/${formId}/analytics`),

  getCSVExportUrl: (formId: string) => `${API_BASE_URL}/forms/${formId}/export/csv`,

  // Seed DB trigger
  triggerSeed: () => fetchJSON<{ message: string }>("/seed", { method: "POST" }),
};
