"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function QuizCard({ title, description, href, icon: Icon }) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-3xl border border-slate-800/80 bg-slate-950/60 p-6 shadow-xl shadow-violet-900/20 backdrop-blur transition-all hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-900/40 cursor-pointer space-y-3"
    >
      {Icon && (
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/20 text-violet-300">
          <Icon className="h-5 w-5" />
        </span>
      )}
      <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
      <p className="text-sm text-slate-300 flex-1">{description}</p>
      <span className="inline-flex items-center text-sm font-medium text-violet-400 group-hover:text-violet-300">
        <span>Go</span>
        <ChevronRight className="h-4 w-4" />
      </span>
    </Link>
  );
}

