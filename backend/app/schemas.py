from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from datetime import datetime

# Question Schemas
class QuestionBase(BaseModel):
    type: str  # short_text, long_text, multiple_choice, dropdown, email, number, yes_no, rating
    title: str
    description: Optional[str] = None
    required: Optional[bool] = False
    properties: Optional[Dict[str, Any]] = {}
    logic_rules: Optional[List[Dict[str, Any]]] = []

class QuestionCreate(QuestionBase):
    order_index: Optional[int] = 0

class QuestionUpdate(BaseModel):
    type: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    required: Optional[bool] = None
    order_index: Optional[int] = None
    properties: Optional[Dict[str, Any]] = None
    logic_rules: Optional[List[Dict[str, Any]]] = None

class QuestionReorder(BaseModel):
    question_ids: List[str]

class QuestionOut(QuestionBase):
    id: str
    form_id: str
    order_index: int

    class Config:
        from_attributes = True

# Theme Schema
class ThemeConfig(BaseModel):
    primary_color: str = "#262626"
    background_color: str = "#FFFFFF"
    text_color: str = "#191919"
    font_family: str = "Inter"
    border_radius: str = "8px"

# Form Schemas
class FormBase(BaseModel):
    title: str
    description: Optional[str] = None

class FormCreate(FormBase):
    theme_config: Optional[Dict[str, Any]] = None
    thank_you_title: Optional[str] = "Thank you!"
    thank_you_message: Optional[str] = "Your response has been registered successfully."

class FormUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    theme_config: Optional[Dict[str, Any]] = None
    thank_you_title: Optional[str] = None
    thank_you_message: Optional[str] = None

class FormOut(FormBase):
    id: str
    status: str
    share_slug: str
    theme_config: Dict[str, Any]
    thank_you_title: str
    thank_you_message: str
    created_at: datetime
    updated_at: datetime
    questions: List[QuestionOut] = []
    response_count: int = 0

    class Config:
        from_attributes = True

class FormListOut(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    status: str
    share_slug: str
    created_at: datetime
    updated_at: datetime
    question_count: int = 0
    response_count: int = 0

    class Config:
        from_attributes = True

# Response Schemas
class AnswerSubmit(BaseModel):
    question_id: str
    value: Any

class ResponseSubmit(BaseModel):
    answers: List[AnswerSubmit]
    completion_time_seconds: Optional[int] = None
    user_agent: Optional[str] = None

class AnswerOut(BaseModel):
    id: str
    question_id: str
    question_title: Optional[str] = None
    question_type: Optional[str] = None
    value: Any

    class Config:
        from_attributes = True

class ResponseOut(BaseModel):
    id: str
    form_id: str
    submitted_at: datetime
    completion_time_seconds: Optional[int] = None
    user_agent: Optional[str] = None
    answers: List[AnswerOut] = []

    class Config:
        from_attributes = True

# Analytics / Stats Schemas
class QuestionStatOption(BaseModel):
    label: str
    count: int
    percentage: float

class QuestionSummaryStat(BaseModel):
    question_id: str
    question_title: str
    question_type: str
    total_answers: int
    options_summary: Optional[List[QuestionStatOption]] = None
    average_rating: Optional[float] = None
    text_responses: Optional[List[str]] = None

class FormAnalyticsOut(BaseModel):
    form_id: str
    form_title: str
    total_responses: int
    question_stats: List[QuestionSummaryStat]
