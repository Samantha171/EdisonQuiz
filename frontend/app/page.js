"use client";

import Link from "next/link";
import Navbar from "../components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)] text-slate-50">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl flex-col items-center justify-center px-4 py-12">
        <section className="flex w-full flex-col items-center gap-12 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-7 text-center md:text-left">
            <div>
              <h1 className="bg-gradient-to-r from-violet-100 via-sky-100 to-fuchsia-200 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl">
                EdisonQuiz
              </h1>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-300/80 md:text-sm">
                AI-Powered Quiz Platform
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-base text-slate-200/85 md:text-lg">
                Generate personalized quizzes instantly using artificial intelligence.
                Practice smarter, stay motivated, and track your learning progress over time.
              </p>
              <p className="text-sm text-slate-300/85 md:text-base">
                Create and practice quizzes instantly with intelligent question generation.
              </p>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <div className="rounded-full border border-slate-700/70 bg-slate-900/40 px-3 py-1 text-xs text-slate-200/90">
                Instant generation
              </div>
              <div className="rounded-full border border-slate-700/70 bg-slate-900/40 px-3 py-1 text-xs text-slate-200/90">
                Any topic
              </div>
              <div className="rounded-full border border-slate-700/70 bg-slate-900/40 px-3 py-1 text-xs text-slate-200/90">
                Track progress
              </div>
            </div>
          </div>

          <div className="w-full max-w-md">
            <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-xl shadow-violet-900/50">
              <div className="pointer-events-none absolute -top-24 right-0 h-48 w-48 rounded-full bg-violet-600/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-sky-500/30 blur-3xl" />

              <div className="relative space-y-4">
                <div className="flex items-center justify-between">
                  <div className="h-2 w-8 rounded-full bg-slate-700" />
                  <div className="flex gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400/80" />
                    <span className="h-2 w-2 rounded-full bg-amber-400/80" />
                    <span className="h-2 w-2 rounded-full bg-rose-400/80" />
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-800/80 bg-slate-950/80 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-violet-300/80">
                    AI Quiz Preview
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-100">
                    “Which Python keyword is used to define a function?”
                  </p>
                  <ul className="mt-3 space-y-1 text-xs text-slate-300/90">
                    <li>• define</li>
                    <li>• def</li>
                    <li>• function</li>
                    <li>• lambda</li>
                  </ul>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4">
                  <div>
                    <p className="text-xs font-medium text-slate-200">Weekly progress</p>
                    <p className="text-xs text-slate-400">12 quizzes completed</p>
                  </div>
                  <div className="flex h-10 items-end gap-1">
                    <span className="h-3 w-2 rounded bg-violet-500/60" />
                    <span className="h-5 w-2 rounded bg-violet-500/70" />
                    <span className="h-7 w-2 rounded bg-violet-500/80" />
                    <span className="h-9 w-2 rounded bg-violet-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

