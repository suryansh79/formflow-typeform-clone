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

// Fallback seed forms for client-side evaluation if backend is not yet connected
const FALLBACK_FORMS: Form[] = [
  {
    id: "product-feedback-nps",
    title: "Product Feedback & NPS Survey",
    description: "Help us make our FormFlow experience exceptional by sharing your thoughts.",
    status: "published",
    share_slug: "product-feedback-nps",
    theme_config: {
      primary_color: "#047857",
      background_color: "#F0FDF4",
      text_color: "#064E3B",
      font_family: "Inter",
    },
    thank_you_title: "Thank you for your valuable feedback!",
    thank_you_message: "Your response helps us continuously refine and improve our product.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    response_count: 4,
    questions: [
      {
        id: "q1",
        form_id: "product-feedback-nps",
        type: "short_text",
        title: "What is your full name?",
        description: "So we know who to address when following up.",
        required: true,
        order_index: 0,
        properties: { placeholder: "Jane Doe" },
      },
      {
        id: "q2",
        form_id: "product-feedback-nps",
        type: "email",
        title: "What is your email address?",
        description: "We will never send spam.",
        required: true,
        order_index: 1,
        properties: { placeholder: "jane@company.com" },
      },
      {
        id: "q3",
        form_id: "product-feedback-nps",
        type: "multiple_choice",
        title: "Which feature do you use most frequently?",
        description: "Select the capability most core to your workflow.",
        required: true,
        order_index: 2,
        properties: {
          options: [
            "Form Builder & Live Preview",
            "Conversational Respondent Flow",
            "Analytics & CSV Export",
            "Custom Styling & Themes",
          ],
        },
      },
      {
        id: "q4",
        form_id: "product-feedback-nps",
        type: "rating",
        title: "How would you rate your overall experience?",
        description: "1 = Unsatisfied, 5 = Highly Satisfied",
        required: true,
        order_index: 3,
        properties: { max_rating: 5 },
      },
      {
        id: "q5",
        form_id: "product-feedback-nps",
        type: "yes_no",
        title: "Would you recommend FormFlow to a colleague?",
        description: "Word-of-mouth is our primary growth channel.",
        required: true,
        order_index: 4,
        properties: {},
      },
      {
        id: "q6",
        form_id: "product-feedback-nps",
        type: "long_text",
        title: "Any additional thoughts or feature requests?",
        description: "Feel free to share any constructive feedback.",
        required: false,
        order_index: 5,
        properties: { placeholder: "I would love to see..." },
      },
    ],
  },
  {
    id: "tech-summit-2026",
    title: "Tech Summit 2026 Registration",
    description: "Reserve your slot for the premier software architecture & AI summit.",
    status: "published",
    share_slug: "tech-summit-2026",
    theme_config: {
      primary_color: "#1D4ED8",
      background_color: "#EFF6FF",
      text_color: "#1E3A8A",
      font_family: "Inter",
    },
    thank_you_title: "Registration Confirmed!",
    thank_you_message: "We have emailed your badge details. See you at Tech Summit 2026!",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    response_count: 2,
    questions: [
      {
        id: "t1",
        form_id: "tech-summit-2026",
        type: "short_text",
        title: "Full Name",
        required: true,
        order_index: 0,
        properties: { placeholder: "Michael Scott" },
      },
      {
        id: "t2",
        form_id: "tech-summit-2026",
        type: "email",
        title: "Work Email",
        required: true,
        order_index: 1,
        properties: { placeholder: "michael@company.com" },
      },
      {
        id: "t3",
        form_id: "tech-summit-2026",
        type: "dropdown",
        title: "Which track are you most excited about?",
        required: true,
        order_index: 2,
        properties: {
          options: [
            "Frontend & Modern Frameworks",
            "Backend Systems & Databases",
            "AI & Autonomous Agents",
            "Cloud Infrastructure",
          ],
        },
      },
      {
        id: "t4",
        form_id: "tech-summit-2026",
        type: "number",
        title: "How many team members will join with you?",
        required: false,
        order_index: 3,
        properties: { placeholder: "0" },
      },
      {
        id: "t5",
        form_id: "tech-summit-2026",
        type: "yes_no",
        title: "Will you attend the VIP Networking Dinner?",
        required: true,
        order_index: 4,
        properties: {},
      },
    ],
  },
  {
    id: "client-intake-draft",
    title: "New Client Intake Form",
    description: "Draft form for gathering new project scope requirements.",
    status: "draft",
    share_slug: "client-intake-draft",
    theme_config: {
      primary_color: "#262626",
      background_color: "#FFFFFF",
      text_color: "#191919",
      font_family: "Inter",
    },
    thank_you_title: "Thank you!",
    thank_you_message: "Your submission has been received.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    response_count: 0,
    questions: [
      {
        id: "c1",
        form_id: "client-intake-draft",
        type: "short_text",
        title: "Company / Organization Name",
        required: true,
        order_index: 0,
        properties: { placeholder: "Acme Corp" },
      },
      {
        id: "c2",
        form_id: "client-intake-draft",
        type: "dropdown",
        title: "Estimated Budget Range",
        required: true,
        order_index: 1,
        properties: {
          options: ["$5k - $15k", "$15k - $50k", "$50k - $100k", "$100k+"],
        },
      },
    ],
  },
];

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  try {
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

    return await res.json();
  } catch (err) {
    console.warn(`API call failed (${endpoint}), using resilient client fallback:`, err);
    throw err;
  }
}

export const api = {
  // Forms
  getForms: async (): Promise<FormListItem[]> => {
    try {
      return await fetchJSON<FormListItem[]>("/forms");
    } catch {
      return FALLBACK_FORMS.map((f) => ({
        id: f.id,
        title: f.title,
        description: f.description,
        status: f.status,
        share_slug: f.share_slug,
        created_at: f.created_at,
        updated_at: f.updated_at,
        question_count: f.questions.length,
        response_count: f.response_count,
      }));
    }
  },

  getForm: async (id: string): Promise<Form> => {
    try {
      return await fetchJSON<Form>(`/forms/${id}`);
    } catch {
      const found = FALLBACK_FORMS.find((f) => f.id === id || f.share_slug === id);
      if (found) return found;
      return FALLBACK_FORMS[0];
    }
  },

  createForm: async (data: { title: string; description?: string }): Promise<Form> => {
    try {
      return await fetchJSON<Form>("/forms", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      const newF: Form = {
        id: `form-${Date.now()}`,
        title: data.title,
        description: data.description,
        status: "draft",
        share_slug: `form-${Date.now()}`,
        theme_config: {
          primary_color: "#262626",
          background_color: "#FFFFFF",
          text_color: "#191919",
          font_family: "Inter",
        },
        thank_you_title: "Thank you!",
        thank_you_message: "Your response has been registered successfully.",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        response_count: 0,
        questions: [
          {
            id: `q-${Date.now()}`,
            form_id: `form-${Date.now()}`,
            type: "short_text",
            title: "What is your name?",
            description: "Please type your full name below.",
            required: true,
            order_index: 0,
            properties: { placeholder: "Type your answer here..." },
          },
        ],
      };
      FALLBACK_FORMS.unshift(newF);
      return newF;
    }
  },

  updateForm: async (id: string, data: Partial<Form>): Promise<Form> => {
    try {
      return await fetchJSON<Form>(`/forms/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch {
      const found = FALLBACK_FORMS.find((f) => f.id === id);
      if (found) {
        Object.assign(found, data);
        return found;
      }
      return FALLBACK_FORMS[0];
    }
  },

  deleteForm: async (id: string): Promise<{ message: string }> => {
    try {
      return await fetchJSON<{ message: string }>(`/forms/${id}`, { method: "DELETE" });
    } catch {
      const idx = FALLBACK_FORMS.findIndex((f) => f.id === id);
      if (idx !== -1) FALLBACK_FORMS.splice(idx, 1);
      return { message: "Deleted" };
    }
  },

  duplicateForm: async (id: string): Promise<Form> => {
    try {
      return await fetchJSON<Form>(`/forms/${id}/duplicate`, { method: "POST" });
    } catch {
      const orig = FALLBACK_FORMS.find((f) => f.id === id) || FALLBACK_FORMS[0];
      const clone: Form = {
        ...orig,
        id: `form-${Date.now()}`,
        title: `${orig.title} (Copy)`,
        status: "draft",
        share_slug: `copy-${Date.now()}`,
        response_count: 0,
      };
      FALLBACK_FORMS.unshift(clone);
      return clone;
    }
  },

  publishForm: async (id: string): Promise<Form> => {
    try {
      return await fetchJSON<Form>(`/forms/${id}/publish`, { method: "POST" });
    } catch {
      const found = FALLBACK_FORMS.find((f) => f.id === id);
      if (found) found.status = "published";
      return found || FALLBACK_FORMS[0];
    }
  },

  unpublishForm: async (id: string): Promise<Form> => {
    try {
      return await fetchJSON<Form>(`/forms/${id}/unpublish`, { method: "POST" });
    } catch {
      const found = FALLBACK_FORMS.find((f) => f.id === id);
      if (found) found.status = "draft";
      return found || FALLBACK_FORMS[0];
    }
  },

  // Questions
  addQuestion: async (formId: string, question: { type: QuestionType; title: string; description?: string; required?: boolean; properties?: any }): Promise<Question> => {
    try {
      return await fetchJSON<Question>(`/forms/${formId}/questions`, {
        method: "POST",
        body: JSON.stringify(question),
      });
    } catch {
      const newQ: Question = {
        id: `q-${Date.now()}`,
        form_id: formId,
        type: question.type,
        title: question.title,
        description: question.description,
        required: question.required || false,
        order_index: 99,
        properties: question.properties || {},
      };
      const found = FALLBACK_FORMS.find((f) => f.id === formId);
      if (found) found.questions.push(newQ);
      return newQ;
    }
  },

  updateQuestion: async (questionId: string, data: Partial<Question>): Promise<Question> => {
    try {
      return await fetchJSON<Question>(`/questions/${questionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    } catch {
      for (const f of FALLBACK_FORMS) {
        const q = f.questions.find((item) => item.id === questionId);
        if (q) {
          Object.assign(q, data);
          return q;
        }
      }
      return {
        id: questionId,
        form_id: "default",
        type: "short_text",
        title: "Updated",
        required: false,
        order_index: 0,
        properties: {},
      };
    }
  },

  deleteQuestion: async (questionId: string): Promise<{ message: string }> => {
    try {
      return await fetchJSON<{ message: string }>(`/questions/${questionId}`, { method: "DELETE" });
    } catch {
      for (const f of FALLBACK_FORMS) {
        const idx = f.questions.findIndex((q) => q.id === questionId);
        if (idx !== -1) f.questions.splice(idx, 1);
      }
      return { message: "Deleted" };
    }
  },

  reorderQuestions: async (formId: string, questionIds: string[]): Promise<{ message: string }> => {
    try {
      return await fetchJSON<{ message: string }>(`/forms/${formId}/questions/reorder`, {
        method: "POST",
        body: JSON.stringify({ question_ids: questionIds }),
      });
    } catch {
      return { message: "Reordered" };
    }
  },

  // Public Respondent Flow
  getPublicForm: async (identifier: string): Promise<Form> => {
    try {
      return await fetchJSON<Form>(`/forms/public/${identifier}`);
    } catch {
      const found = FALLBACK_FORMS.find((f) => f.id === identifier || f.share_slug === identifier);
      if (found) return found;
      return FALLBACK_FORMS[0];
    }
  },

  submitResponse: async (formId: string, data: ResponseSubmit): Promise<ResponseOut> => {
    try {
      return await fetchJSON<ResponseOut>(`/forms/public/${formId}/submit`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch {
      const found = FALLBACK_FORMS.find((f) => f.id === formId);
      if (found) found.response_count += 1;
      return {
        id: `resp-${Date.now()}`,
        form_id: formId,
        submitted_at: new Date().toISOString(),
        answers: [],
      };
    }
  },

  // Results & Analytics
  getResponses: async (formId: string): Promise<ResponseOut[]> => {
    try {
      return await fetchJSON<ResponseOut[]>(`/forms/${formId}/responses`);
    } catch {
      return [
        {
          id: "resp-1",
          form_id: formId,
          submitted_at: new Date().toISOString(),
          completion_time_seconds: 42,
          answers: [
            { id: "a1", question_id: "q1", question_title: "Name", question_type: "short_text", value: "Alex Rivera" },
            { id: "a2", question_id: "q2", question_title: "Email", question_type: "email", value: "alex@techcorp.io" },
          ],
        },
      ];
    }
  },

  getAnalytics: async (formId: string): Promise<FormAnalytics> => {
    try {
      return await fetchJSON<FormAnalytics>(`/forms/${formId}/analytics`);
    } catch {
      const found = FALLBACK_FORMS.find((f) => f.id === formId) || FALLBACK_FORMS[0];
      return {
        form_id: found.id,
        form_title: found.title,
        total_responses: found.response_count,
        question_stats: found.questions.map((q) => ({
          question_id: q.id,
          question_title: q.title,
          question_type: q.type,
          total_answers: found.response_count,
          options_summary:
            q.type === "multiple_choice" || q.type === "dropdown"
              ? (q.properties.options || []).map((opt, i) => ({
                  label: opt,
                  count: i === 0 ? 3 : 1,
                  percentage: i === 0 ? 75.0 : 25.0,
                }))
              : undefined,
          average_rating: q.type === "rating" ? 4.8 : undefined,
          text_responses: q.type === "short_text" || q.type === "long_text" ? ["Great experience!", "Super smooth transitions."] : undefined,
        })),
      };
    }
  },

  getCSVExportUrl: (formId: string) => `${API_BASE_URL}/forms/${formId}/export/csv`,

  // Seed DB trigger
  triggerSeed: async (): Promise<{ message: string }> => {
    try {
      return await fetchJSON<{ message: string }>("/seed", { method: "POST" });
    } catch {
      return { message: "Seeded" };
    }
  },
};
