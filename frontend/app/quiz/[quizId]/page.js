"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../../components/Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import QuestionCard from "../../../components/QuestionCard";
import api from "../../../services/api";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.quizId;

  const [quiz, setQuiz] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/api/quiz/${quizId}`);
        setQuiz(res.data);
      } catch (err) {
        setError("Unable to load quiz.");
      } finally {
        setLoading(false);
      }
    };
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);

  const handleSelect = (questionId, optionKey) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionKey }));
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentIndex < quiz.questions.length - 1) {
      setCurrentIndex((idx) => idx + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((idx) => idx - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = {
        answers: quiz.questions.map((q) => ({
          question_id: q.question_id,
          selected_answer: answers[q.question_id] || ""
        }))
      };
      const res = await api.post(`/api/quiz/${quiz.quiz_id}/submit`, payload);
      router.push(`/result/${res.data.attempt_id}`);
    } catch (err) {
      setError("Failed to submit quiz. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)]">
          <Navbar />
          <div className="flex min-h-[70vh] items-center justify-center">
            <div className="spinner" />
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!quiz) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)]">
          <Navbar />
          <div className="flex min-h-[70vh] items-center justify-center">
            <p className="text-sm text-red-400">{error || "Quiz not found."}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const progress = ((currentIndex) / quiz.num_questions) * 100;
  const isFirstQuestion = currentIndex === 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)] text-slate-50">
        <Navbar />
        <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col gap-6 px-4 py-8 pb-16">
          <div>
            <h2 className="text-xl font-semibold capitalize text-slate-100">
              {quiz.topic}
            </h2>
            <p className="text-xs text-slate-300 capitalize">
              Difficulty: {quiz.difficulty}
            </p>
          </div>

          <div className="w-full">
            <div className="mb-2 flex items-center justify-between text-xs text-slate-300">
              <span>
                Question {currentIndex + 1} of {quiz.num_questions}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-violet-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <QuestionCard
            question={currentQuestion.question}
            options={currentQuestion.options}
            selected={answers[currentQuestion.question_id]}
            onSelect={(opt) => handleSelect(currentQuestion.question_id, opt)}
          />

          {error && (
            <p className="text-xs text-red-400">{error}</p>
          )}

          <div className="mt-2 flex items-center justify-between pb-8">
            {!isFirstQuestion && (
              <button
                className="btn-secondary text-xs"
                onClick={handlePrev}
              >
                Previous
              </button>
            )}
            {isFirstQuestion && <div />}
            {currentIndex < quiz.questions.length - 1 ? (
              <button
                className="btn-primary text-xs"
                onClick={handleNext}
              >
                Next
              </button>
            ) : (
              <button
                className="btn-primary flex items-center gap-2 text-xs"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting && <span className="spinner" />}
                <span>{submitting ? "Submitting..." : "Submit Quiz"}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

