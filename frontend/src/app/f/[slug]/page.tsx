"use client";

import React, { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { Form, Question, ResponseSubmit } from "@/lib/types";
import { WelcomeScreen } from "@/components/respondent/WelcomeScreen";
import { QuestionCard } from "@/components/respondent/QuestionCard";
import { ProgressBar } from "@/components/respondent/ProgressBar";
import { ThankYou } from "@/components/respondent/ThankYou";
import { AnimatePresence, motion } from "framer-motion";

export default function PublicFormSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [form, setForm] = useState<Form | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [error, setError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [slideDirection, setSlideDirection] = useState<"up" | "down">("up");

  useEffect(() => {
    const fetchForm = async () => {
      try {
        setLoading(true);
        const data = await api.getPublicForm(slug);
        setForm(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [slug]);

  const questions = form?.questions || [];
  const currentQ = questions[currentIndex] || null;

  // Global Keyboard Navigation Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted || isSubmitted || !currentQ) return;

      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === "INPUT" || activeElement.tagName === "TEXTAREA");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        handlePrev();
      } else if (!isInputFocused) {
        // Choice shortcuts (A, B, C, D...)
        if (currentQ.type === "multiple_choice") {
          const charCode = e.key.toUpperCase().charCodeAt(0);
          if (charCode >= 65 && charCode <= 90) {
            const idx = charCode - 65;
            const options = currentQ.properties?.options || [];
            if (idx < options.length) {
              e.preventDefault();
              setAnswers((prev) => ({ ...prev, [currentQ.id]: options[idx] }));
              setTimeout(() => handleNext(), 200);
            }
          }
        }
        // Yes/No shortcuts (Y / N)
        else if (currentQ.type === "yes_no") {
          if (e.key.toLowerCase() === "y") {
            e.preventDefault();
            setAnswers((prev) => ({ ...prev, [currentQ.id]: "Yes" }));
            setTimeout(() => handleNext(), 200);
          } else if (e.key.toLowerCase() === "n") {
            e.preventDefault();
            setAnswers((prev) => ({ ...prev, [currentQ.id]: "No" }));
            setTimeout(() => handleNext(), 200);
          }
        }
        // Rating shortcuts (1-5)
        else if (currentQ.type === "rating") {
          const num = parseInt(e.key, 10);
          const maxRating = currentQ.properties?.max_rating || 5;
          if (!isNaN(num) && num >= 1 && num <= maxRating) {
            e.preventDefault();
            setAnswers((prev) => ({ ...prev, [currentQ.id]: num }));
            setTimeout(() => handleNext(), 200);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasStarted, currentIndex, currentQ, answers, isSubmitted]);

  const validateCurrentQuestion = (): boolean => {
    if (!currentQ) return true;
    setError(null);

    const val = answers[currentQ.id];

    // Required check
    if (currentQ.required) {
      if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
        setError("This question requires an answer.");
        return false;
      }
    }

    // Format check for email
    if (currentQ.type === "email" && val) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(String(val))) {
        setError("Please enter a valid email address.");
        return false;
      }
    }

    // Format check for number
    if (currentQ.type === "number" && val !== undefined && val !== "") {
      if (isNaN(Number(val))) {
        setError("Please enter a valid number.");
        return false;
      }
    }

    return true;
  };

  const handleNext = async () => {
    if (!validateCurrentQuestion()) return;

    if (currentIndex < questions.length - 1) {
      setSlideDirection("up");
      setCurrentIndex((prev) => prev + 1);
    } else {
      await handleSubmitResponse();
    }
  };

  const handlePrev = () => {
    setError(null);
    if (currentIndex > 0) {
      setSlideDirection("down");
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmitResponse = async () => {
    if (!form) return;
    setIsSubmitting(true);
    try {
      const completionTime = Math.round((Date.now() - startTime) / 1000);
      const answerPayload = Object.entries(answers).map(([qId, val]) => ({
        question_id: qId,
        value: val,
      }));

      const payload: ResponseSubmit = {
        answers: answerPayload,
        completion_time_seconds: completionTime,
        user_agent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
      };

      await api.submitResponse(form.id, payload);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to submit response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
            Loading FormFlow...
          </p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-zinc-50 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">Form Not Found</h1>
        <p className="text-xs text-zinc-500 mt-2">
          The form you are looking for does not exist or has been removed.
        </p>
      </div>
    );
  }

  if (form.status !== "published") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-zinc-50 dark:bg-zinc-950">
        <h1 className="text-2xl font-bold text-zinc-800 dark:text-zinc-200">Form Not Live</h1>
        <p className="text-xs text-zinc-500 mt-2 max-w-sm">
          This form is currently in draft mode and not accepting public responses.
        </p>
      </div>
    );
  }

  const theme = form.theme_config || {};
  const bgColor = theme.background_color || "#FFFFFF";

  if (isSubmitted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
        <ThankYou
          title={form.thank_you_title}
          message={form.thank_you_message}
          theme={theme}
          onReset={() => {
            setAnswers({});
            setCurrentIndex(0);
            setHasStarted(false);
            setIsSubmitted(false);
          }}
        />
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: bgColor }}>
        <WelcomeScreen
          title={form.title}
          description={form.description}
          questionCount={questions.length}
          onStart={() => setHasStarted(true)}
          theme={theme}
        />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-between relative overflow-hidden transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="flex-1 flex items-center justify-center relative w-full pb-20">
        <AnimatePresence mode="wait">
          {currentQ && (
            <motion.div
              key={currentQ.id}
              initial={{
                opacity: 0,
                y: slideDirection === "up" ? 40 : -40,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: slideDirection === "up" ? -40 : 40,
              }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="w-full"
            >
              <QuestionCard
                question={currentQ}
                index={currentIndex}
                totalQuestions={questions.length}
                value={answers[currentQ.id]}
                onChange={(val) => {
                  setError(null);
                  setAnswers((prev) => ({ ...prev, [currentQ.id]: val }));
                }}
                onNext={handleNext}
                error={error}
                theme={theme}
                isSubmitting={isSubmitting}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <ProgressBar
        currentIndex={currentIndex}
        totalQuestions={questions.length}
        onPrev={handlePrev}
        onNext={handleNext}
        primaryColor={theme.primary_color}
      />
    </div>
  );
}
