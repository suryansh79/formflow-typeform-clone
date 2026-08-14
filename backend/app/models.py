import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class Form(Base):
    __tablename__ = "forms"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False, default="Untitled Form")
    description = Column(Text, nullable=True)
    status = Column(String(20), nullable=False, default="draft")  # "draft" or "published"
    share_slug = Column(String(100), unique=True, index=True, nullable=False, default=generate_uuid)
    theme_config = Column(Text, nullable=True, default='{"primary_color":"#262626","background_color":"#FFFFFF","text_color":"#191919","font_family":"Inter"}')
    thank_you_title = Column(String(255), nullable=False, default="Thank you!")
    thank_you_message = Column(Text, nullable=False, default="Your response has been registered successfully.")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    questions = relationship("Question", back_populates="form", cascade="all, delete-orphan", order_by="Question.order_index")
    responses = relationship("Response", back_populates="form", cascade="all, delete-orphan")


class Question(Base):
    __tablename__ = "questions"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    form_id = Column(String(36), ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(50), nullable=False)  # short_text, long_text, multiple_choice, dropdown, email, number, yes_no, rating
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    required = Column(Boolean, default=False)
    order_index = Column(Integer, nullable=False, default=0)
    properties = Column(Text, nullable=True, default="{}")  # JSON string
    logic_rules = Column(Text, nullable=True, default="[]")  # JSON string

    form = relationship("Form", back_populates="questions")
    answers = relationship("Answer", back_populates="question", cascade="all, delete-orphan")


class Response(Base):
    __tablename__ = "responses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    form_id = Column(String(36), ForeignKey("forms.id", ondelete="CASCADE"), nullable=False)
    submitted_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    completion_time_seconds = Column(Integer, nullable=True)
    user_agent = Column(String(255), nullable=True)

    form = relationship("Form", back_populates="responses")
    answers = relationship("Answer", back_populates="response", cascade="all, delete-orphan")


class Answer(Base):
    __tablename__ = "answers"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    response_id = Column(String(36), ForeignKey("responses.id", ondelete="CASCADE"), nullable=False)
    question_id = Column(String(36), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    value = Column(Text, nullable=True)  # Stored as JSON string or raw text

    response = relationship("Response", back_populates="answers")
    question = relationship("Question", back_populates="answers")
