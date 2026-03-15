"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrainCircuit } from "lucide-react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAuthenticated(!!token);
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
    };
  }, [pathname]);

  const handleLogout = () => {
    if (!confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    router.push("/");
  };

  if (!mounted) return null;

  return (
    <header className="w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-600/20 text-violet-300">
            <BrainCircuit className="h-5 w-5" />
          </span>
          <span className="bg-gradient-to-r from-violet-200 to-sky-200 bg-clip-text text-lg font-semibold text-transparent">
            EdisonQuiz
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {pathname !== "/dashboard" && (
                <Link
                  href="/dashboard"
                  className="text-base text-slate-200 transition hover:text-white"
                >
                  Dashboard
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="rounded-full border border-slate-600 px-4 py-1.5 text-base font-medium text-slate-100 transition hover:border-slate-400 hover:bg-slate-900"
              >
                Logout
              </button>
            </>
          ) : (
            <div className="flex rounded-full border border-slate-700 bg-slate-900/60 p-1 text-base">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className={`px-5 py-2 rounded-full font-medium transition ${pathname === "/login"
                    ? "bg-violet-500 text-white shadow-sm"
                    : "text-slate-200 hover:bg-slate-800"
                  }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => router.push("/register")}
                className={`px-5 py-2 rounded-full font-medium transition ${pathname === "/register"
                    ? "bg-violet-500 text-white shadow-sm"
                    : "text-slate-200 hover:bg-slate-800"
                  }`}
              >
                Register
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}