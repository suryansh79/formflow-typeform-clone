export type QuestionType =
  | "short_text"
  | "long_text"
  | "multiple_choice"
  | "dropdown"
  | "email"
  | "number"
  | "yes_no"
  | "rating";

export interface QuestionProperties {
  options?: string[];
  min_rating?: number;
  max_rating?: number;
  rating_shape?: "star" | "number" | "heart";
  placeholder?: string;
  button_text?: string;
}

export interface LogicRule {
  condition: "equals" | "not_equals" | "contains";
  value: string;
  jump_to_question_id: string;
}

export interface Question {
  id: string;
  form_id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  order_index: number;
  properties: QuestionProperties;
  logic_rules?: LogicRule[];
}

export interface ThemeConfig {
  primary_color: string;
  background_color: string;
  text_color: string;
  font_family: string;
  border_radius?: string;
}

export interface Form {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "published";
  share_slug: string;
  theme_config: ThemeConfig;
  thank_you_title: string;
  thank_you_message: string;
  created_at: string;
  updated_at: string;
  questions: Question[];
  response_count: number;
}

export interface FormListItem {
  id: string;
  title: string;
  description?: string;
  status: "draft" | "published";
  share_slug: string;
  created_at: string;
  updated_at: string;
  question_count: number;
  response_count: number;
}

export interface AnswerSubmit {
  question_id: string;
  value: any;
}

export interface ResponseSubmit {
  answers: AnswerSubmit[];
  completion_time_seconds?: number;
  user_agent?: string;
}

export interface AnswerOut {
  id: string;
  question_id: string;
  question_title?: string;
  question_type?: string;
  value: any;
}

export interface ResponseOut {
  id: string;
  form_id: string;
  submitted_at: string;
  completion_time_seconds?: number;
  user_agent?: string;
  answers: AnswerOut[];
}

export interface QuestionStatOption {
  label: string;
  count: number;
  percentage: number;
}

export interface QuestionSummaryStat {
  question_id: string;
  question_title: string;
  question_type: string;
  total_answers: number;
  options_summary?: QuestionStatOption[];
  average_rating?: number;
  text_responses?: string[];
}

export interface FormAnalytics {
  form_id: string;
  form_title: string;
  total_responses: number;
  question_stats: QuestionSummaryStat[];
}
