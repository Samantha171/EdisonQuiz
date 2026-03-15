"use client";

import { useEffect, useState } from "react";
import { Sparkles, History, ClipboardList, TrendingUp, Award } from "lucide-react";
import Navbar from "../../components/Navbar";
import ProtectedRoute from "../../components/ProtectedRoute";
import QuizCard from "../../components/QuizCard";
import api from "../../services/api";

export default function DashboardPage() {
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setUsername(localStorage.getItem("username") || "");
    }
  }, []);

  const [stats, setStats] = useState({
    quizzesTaken: 0,
    avgScore: 0,
    bestScore: 0
  });
  
  useEffect(() => {
    // fetch real stats from history
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/history");
        const attempts = res.data;
        if (attempts.length === 0) return;
  
        const total = attempts.length;
        const scores = attempts.map(a => (a.score / a.num_questions) * 100);
        const avg = Math.round(scores.reduce((a, b) => a + b, 0) / total);
        const best = Math.round(Math.max(...scores));
  
        setStats({ quizzesTaken: total, avgScore: avg, bestScore: best });
      } catch (err) {
        console.log("Failed to load stats");
      }
    };
    fetchStats();
  }, []);


  return (
    <ProtectedRoute>
      <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)] text-slate-50">
        <Navbar />
        <div className="mx-auto max-w-5xl px-4 pt-10 py-20">
          <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center">
            <div className="w-full space-y-8">
              <div className="text-center md:text-left">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-100 md:text-3xl">
                  Welcome back, {username || "there"} 👋
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  What would you like to do today?
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-2 text-slate-400">
                    <ClipboardList className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Quizzes Taken</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-slate-100">{stats.quizzesTaken}</p>
                </div>
                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-2 text-slate-400">
                    <TrendingUp className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Avg Score</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-slate-100">{stats.avgScore}%</p>
                </div>
                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 px-4 py-3 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Award className="h-4 w-4" />
                    <span className="text-xs font-medium uppercase tracking-wider">Best Score</span>
                  </div>
                  <p className="mt-1 text-xl font-semibold text-slate-100">{stats.bestScore}%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <QuizCard
                  icon={Sparkles}
                  title="Generate Quiz"
                  description="Create a new AI-generated quiz on any topic and difficulty."
                  href="/create-quiz"
                />
                <QuizCard
                  icon={History}
                  title="Quiz History"
                  description="Review your previous quiz attempts and retake quizzes."
                  href="/history"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}

