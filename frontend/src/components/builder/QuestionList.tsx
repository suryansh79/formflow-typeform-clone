"use client";

import React, { useState } from "react";
import { Question, QuestionType } from "@/lib/types";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import {
  GripVertical,
  Plus,
  Type,
  AlignLeft,
  CheckSquare,
  ChevronDown,
  Mail,
  Hash,
  ToggleLeft,
  Star,
  Trash2,
  Search,
  Sparkles,
} from "lucide-react";

interface QuestionListProps {
  questions: Question[];
  activeQuestionId: string | null;
  onSelectQuestion: (id: string) => void;
  onAddQuestion: (type: QuestionType) => void;
  onDeleteQuestion: (id: string) => void;
  onReorderQuestions: (newQuestions: Question[]) => void;
}

export const QUESTION_TYPES: { type: QuestionType; label: string; icon: any; desc: string; category: string }[] = [
  { type: "short_text", label: "Short Text", icon: Type, desc: "Single line text response", category: "Text Inputs" },
  { type: "long_text", label: "Long Text", icon: AlignLeft, desc: "Multi-line paragraph text", category: "Text Inputs" },
  { type: "multiple_choice", label: "Multiple Choice", icon: CheckSquare, desc: "Select one option from a list", category: "Choices" },
  { type: "dropdown", label: "Dropdown", icon: ChevronDown, desc: "Select from a dropdown menu", category: "Choices" },
  { type: "email", label: "Email", icon: Mail, desc: "Valid email address format", category: "Contact Info" },
  { type: "number", label: "Number", icon: Hash, desc: "Numeric value input", category: "Ratings & Numbers" },
  { type: "yes_no", label: "Yes / No", icon: ToggleLeft, desc: "Simple boolean choice", category: "Choices" },
  { type: "rating", label: "Rating", icon: Star, desc: "Star rating scale", category: "Ratings & Numbers" },
];

export const getQuestionIcon = (type: QuestionType) => {
  const found = QUESTION_TYPES.find((q) => q.type === type);
  return found ? found.icon : Type;
};

export const QuestionList: React.FC<QuestionListProps> = ({
  questions,
  activeQuestionId,
  onSelectQuestion,
  onAddQuestion,
  onDeleteQuestion,
  onReorderQuestions,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    const updated = items.map((q, idx) => ({ ...q, order_index: idx }));
    onReorderQuestions(updated);
  };

  const filteredTypes = QUESTION_TYPES.filter(
    (qt) =>
      qt.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      qt.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-zinc-900 text-zinc-100 border-r border-zinc-800 w-80 shrink-0">
      {/* Header & Add Button */}
      <div className="p-4 border-b border-zinc-800/80 flex items-center justify-between">
        <h2 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">
          Questions ({questions.length})
        </h2>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-zinc-900 text-xs font-bold rounded-xl hover:bg-zinc-100 transition shadow-sm"
        >
          <Plus className="w-3.5 h-3.5" /> Add Question
        </button>
      </div>

      {/* Drag & Drop Question List */}
      <div className="flex-1 overflow-y-auto p-3">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="questions-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="space-y-2"
              >
                {questions.map((q, index) => {
                  const Icon = getQuestionIcon(q.type);
                  const isActive = q.id === activeQuestionId;

                  return (
                    <Draggable key={q.id} draggableId={q.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          onClick={() => onSelectQuestion(q.id)}
                          className={`group relative flex items-center gap-2.5 p-3 rounded-xl border text-sm transition-all cursor-pointer ${
                            snapshot.isDragging
                              ? "shadow-2xl border-white bg-zinc-800"
                              : isActive
                              ? "border-emerald-500 bg-emerald-950/40 text-white font-semibold"
                              : "border-zinc-800/80 hover:border-zinc-700 bg-zinc-900/60 text-zinc-300"
                          }`}
                        >
                          <div
                            {...provided.dragHandleProps}
                            className="text-zinc-600 hover:text-zinc-300 cursor-grab active:cursor-grabbing p-0.5"
                          >
                            <GripVertical className="w-4 h-4" />
                          </div>

                          <span className="text-xs font-mono font-bold text-emerald-400 shrink-0 w-4">
                            {index + 1}
                          </span>

                          <div className="p-1.5 rounded-lg bg-zinc-800 text-zinc-300 shrink-0">
                            <Icon className="w-3.5 h-3.5" />
                          </div>

                          <span className="flex-1 truncate text-xs font-medium">
                            {q.title || "Untitled Question"}
                          </span>

                          {q.required && (
                            <span className="text-red-400 font-bold text-xs" title="Required">
                              *
                            </span>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteQuestion(q.id);
                            }}
                            title="Delete question"
                            className="opacity-0 group-hover:opacity-100 p-1 text-zinc-500 hover:text-red-400 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {questions.length === 0 && (
          <div className="text-center py-12 text-xs text-zinc-500">
            No questions yet. Click "+ Add Question" to get started.
          </div>
        )}
      </div>

      {/* Typeform Style Add Question Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-400" /> Select Question Type
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-xs text-zinc-400 hover:text-white"
              >
                Close ✕
              </button>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Search question types..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
                {filteredTypes.map((qt) => {
                  const Icon = qt.icon;
                  return (
                    <button
                      key={qt.type}
                      onClick={() => {
                        onAddQuestion(qt.type);
                        setShowAddModal(false);
                        setSearchTerm("");
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-xl border border-zinc-800/80 hover:border-emerald-500/50 bg-zinc-800/50 hover:bg-zinc-800 transition text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-700/60 rounded-lg text-emerald-400">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">{qt.label}</div>
                          <div className="text-[11px] text-zinc-400">{qt.desc}</div>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase font-bold text-zinc-500 px-2 py-0.5 bg-zinc-800 rounded">
                        {qt.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
