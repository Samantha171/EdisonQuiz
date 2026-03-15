"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle } from "lucide-react";
import Navbar from "../../../components/Navbar";
import ProtectedRoute from "../../../components/ProtectedRoute";
import api from "../../../services/api";

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const attemptId = params.attemptId;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/api/attempt/${attemptId}`);
        setResult(res.data);
      } catch (err) {
        setError("Unable to load result.");
      } finally {
        setLoading(false);
      }
    };
    if (attemptId) {
      fetchResult();
    }
  }, [attemptId]);

  const handleRetakeSame = () => {
    if (result) router.push(`/quiz/${result.quiz_id}`);
  };

  const handleBackDashboard = () => {
    router.push("/dashboard");
  };

  const getScoreColor = (score, total) => {
    const pct = (score / total) * 100;
    if (pct >= 80) return "text-green-400";
    if (pct >= 50) return "text-yellow-400";
    return "text-red-400";
  };

  const getAccuracy = (score, total) => Math.round((score / total) * 100);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)] text-slate-50">
          <Navbar />
          <div className="flex min-h-[70vh] items-center justify-center flex-col gap-3">
            <div className="spinner" />
            <p className="text-sm text-slate-300">Analyzing your answers...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!result) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)] text-slate-50">
          <Navbar />
          <div className="flex min-h-[70vh] items-center justify-center">
            <p className="text-sm text-red-400">{error || "Result not found."}</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const accuracy = getAccuracy(result.score, result.num_questions);
  const scoreColor = getScoreColor(result.score, result.num_questions);

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full overflow-y-auto scrollbar-hide bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)] text-slate-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-10">
          <div className="space-y-6">

            {/* Score Summary Card */}
            <div className="rounded-3xl border border-slate-800 bg-slate-950/60 p-6 shadow-xl shadow-violet-900/50 backdrop-blur">
              <p className="mb-4 text-sm font-medium text-slate-400 uppercase tracking-wider">
                 Quiz Completed
              </p>
              <p className={`text-3xl font-bold ${scoreColor}`}>
                {result.score} / {result.num_questions}
              </p>
              <p className="mt-1 text-sm text-slate-300">
                Accuracy: <span className={scoreColor}>{accuracy}%</span>
              </p>
              <div className="mt-4 flex gap-6 text-sm text-slate-400">
                <p>Topic: <span className="text-slate-200 capitalize">{result.topic}</span></p>
                <p>Difficulty: <span className="text-slate-200 capitalize">{result.difficulty}</span></p>
              </div>
            </div>

            {/* Answer Review */}
            <div className="space-y-6">
              {result.answers.map((ans, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-lg backdrop-blur"
                >
                  <p className="mb-3 font-semibold text-slate-200">
                    Q{idx + 1}. {ans.question}
                  </p>

                  {ans.is_correct ? (
                    <div className="pl-4 flex items-center gap-2 text-sm text-green-400">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>Your answer: {ans.selected_answer || "Not answered"}</span>
                    </div>
                  ) : (
                    <div className="space-y-1 pl-4">
                      <div className="flex items-center gap-2 text-sm text-red-400">
                        <XCircle className="h-4 w-4 shrink-0" />
                        <span>Your answer: {ans.selected_answer || "Not answered"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-green-400">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>Correct answer: {ans.correct_answer}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Buttons */}
            <div className="flex flex-wrap gap-3 pt-2 pb-10">
              <button
                onClick={handleRetakeSame}
                className="btn-primary text-xs hover:scale-[1.02] transition"
              >
                 Retry Same Quiz
              </button>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}