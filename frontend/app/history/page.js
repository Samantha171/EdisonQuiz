"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { History as HistoryIcon, Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import api from "../../services/api";

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: '2-digit',
  minute: '2-digit'
  });
}

function capitalizeTopic(topic) {
  if (!topic || typeof topic !== "string") return topic;
  return topic.charAt(0).toUpperCase() + topic.slice(1).toLowerCase();
}

function getScoreColor(score, total) {
  if (!total) return "text-slate-300";
  const pct = score / total;
  if (pct >= 0.8) return "text-emerald-400 font-medium";
  if (pct >= 0.5) return "text-amber-400";
  return "text-red-400";
}

export default function HistoryPage() {
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/api/history");
        setHistory(res.data);
      } catch (err) {
        setError("Unable to load history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const handleRetakeSame = (quizId) => {
    router.push(`/quiz/${quizId}`);
  };

  const handleRetakeNew = async (item) => {
    try {
      const res = await api.post("/api/quiz/generate", {
        topic: item.topic,
        difficulty: item.difficulty,
        num_questions: item.num_questions,
      });
      router.push(`/quiz/${res.data.quiz_id}`);
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)] text-slate-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-12">
          <h2 className="mb-1 text-2xl font-semibold tracking-tight text-slate-100">
            Quiz History
          </h2>
          <p className="mb-6 text-sm text-slate-300">
            Review your previous attempts and quickly retake quizzes.
          </p>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, idx) => (
                <div
                  key={idx}
                  className="h-14 animate-pulse rounded-xl bg-slate-800/60"
                />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-3xl border border-slate-800/80 bg-slate-950/60 px-8 py-16 text-center shadow-xl shadow-violet-900/20 backdrop-blur">
              <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-300">
                <HistoryIcon className="h-7 w-7" />
              </span>
              <h3 className="text-lg font-semibold text-slate-100">
                No quizzes yet
              </h3>
              <p className="mt-2 max-w-sm text-sm text-slate-300">
                Your attempt history will appear here. Create your first quiz to get started.
              </p>
              <Link
                href="/create-quiz"
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition hover:bg-violet-400 hover:shadow-violet-500/30"
              >
                <Sparkles className="h-4 w-4" />
                Create Quiz
              </Link>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-xl shadow-violet-900/30 backdrop-blur">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/80 bg-slate-900/60">
                      <th className="px-4 py-3 font-medium text-slate-300">
                        Topic
                      </th>
                      <th className="px-4 py-3 font-medium text-slate-300">
                        Difficulty
                      </th>
                      <th className="px-4 py-3 font-medium text-slate-300">
                        Score
                      </th>
                      <th className="px-4 py-3 font-medium text-slate-300">
                        Date
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-slate-300">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item, index) => (
                      <tr
                        key={item.attempt_id}
                        className={`border-b border-slate-800/60 transition hover:bg-slate-800/40 ${
                          index % 2 === 1 ? "bg-slate-900/30" : ""
                        }`}
                      >
                        <td className="px-4 py-3 text-slate-100">
                          {capitalizeTopic(item.topic)}
                        </td>
                        <td className="px-4 py-3 capitalize text-slate-200">
                          {item.difficulty}
                        </td>
                        <td
                          className={`px-4 py-3 ${getScoreColor(
                            item.score,
                            item.num_questions
                          )}`}
                        >
                          {item.score} / {item.num_questions}
                        </td>
                        <td className="px-4 py-3 text-slate-300">
                          {formatDate(item.attempted_at)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex flex-wrap justify-end gap-2">
                            <button
                              onClick={() => router.push(`/result/${item.attempt_id}`)}
                              className="rounded-lg bg-violet-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-violet-400"
                            >
                              Review
                            </button>
                            <button
                              onClick={() => handleRetakeSame(item.quiz_id)}
                              className="rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700/80"
                            >
                              Retake Same
                            </button>
                            <button
                              onClick={() => handleRetakeNew(item)}
                              className= "rounded-lg border border-slate-600 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-700/80"
                            >
                              Retake New
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-4 text-sm text-red-400">{error}</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}

