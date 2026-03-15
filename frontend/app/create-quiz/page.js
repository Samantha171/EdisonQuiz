"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import api from "../../services/api";

const inputClasses =
  "w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500";

export default function CreateQuizPage() {
  const router = useRouter();
  const [mode, setMode] = useState("topic"); // "topic" | "pdf"
  const [topic, setTopic] = useState("");
  const [file, setFile] = useState(null);
  const [difficulty, setDifficulty] = useState("easy");
  const [numQuestions, setNumQuestions] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let res;
      if (mode === "topic") {
        res = await api.post("/api/quiz/generate", {
          topic,
          difficulty,
          num_questions: Number(numQuestions),
        });
      } else {
        if (!file) {
          setError("Please select a PDF file.");
          setLoading(false);
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          setError("File too large. Maximum size is 10MB.");
          setLoading(false);
          return;
        }

        const formData = new FormData();
        formData.append("pdf", file);
        formData.append("difficulty", difficulty);
        formData.append("num_questions", numQuestions);

        res = await api.post("/api/quiz/generate-from-pdf", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const { quiz_id } = res.data;
      router.push(`/quiz/${quiz_id}`);
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        "Failed to generate quiz. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)] text-slate-50">
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 py-14">

          <div className="mx-auto max-w-xl">
            <div className="overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/60 p-10 shadow-xl shadow-violet-900/50 backdrop-blur">
              <div className="mb-6 flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <h2 className="text-lg font-semibold text-slate-100">
                    Build Your Quiz
                  </h2>
                  <p className="mt-0.5 text-sm text-slate-300">
                    {mode === "topic"
                      ? "AI will generate questions instantly based on your topic."
                      : "Upload a PDF and AI will generate questions from the content."}
                  </p>
                </div>
              </div>

              {/* Mode Tabs */}
              <div className="mb-8 flex gap-2 rounded-2xl bg-slate-900/50 p-1.5 border border-slate-800/50">
                <button
                  type="button"
                  onClick={() => setMode("topic")}
                  className={`flex-1 rounded-xl py-2 text-xs font-medium transition-all ${mode === "topic"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                >
                  Topic Based
                </button>
                <button
                  type="button"
                  onClick={() => setMode("pdf")}
                  className={`flex-1 rounded-xl py-2 text-xs font-medium transition-all ${mode === "pdf"
                    ? "bg-violet-600 text-white shadow-lg shadow-violet-600/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                    }`}
                >
                  Upload PDF
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === "topic" ? (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-300">
                      Topic
                    </label>
                    <input
                      className={inputClasses}
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="Ask me anything — I'll make it a quiz."
                      required
                    />
                  </div>
                ) : (
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-300">
                      Upload Study Material
                    </label>
                    <label className="group relative flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-slate-600 bg-slate-900 px-4 py-5 text-center transition hover:border-violet-500 hover:bg-violet-500/5">
                      <input
                        type="file"
                        accept="application/pdf,.txt"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="hidden"
                        required
                      />
                      {file ? (
                        <>
                          <p className="text-sm font-medium text-violet-300">{file.name}</p>
                          <p className="text-xs text-slate-500">Click to change file</p>
                        </>
                      ) : (
                        <>
                          <p className="text-sm font-medium text-slate-200">
                            Click to upload your notes or study material
                          </p>
                          <p className="text-xs text-slate-500">
                            PDF or TXT · Max 50 pages · Max 10MB
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                )}

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Difficulty
                  </label>
                  <select
                    className={`${inputClasses} cursor-pointer appearance-none bg-[length:1rem_1rem] bg-[right_0.5rem_center] bg-no-repeat pr-9`}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    }}
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Number of questions (5–20)
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={20}
                    className={inputClasses}
                    value={numQuestions}
                    onChange={(e) => setNumQuestions(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <p className="text-xs text-red-400">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-violet-500/30"
                >
                  {loading && <span className="spinner" />}
                  <span>
                    {loading
                      ? (mode === "topic" ? "Generating quiz..." : "Analyzing PDF and generating quiz...")
                      : "Build My Quiz"}
                  </span>
                </button>

              </form>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
