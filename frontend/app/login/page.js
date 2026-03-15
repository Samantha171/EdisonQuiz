"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrainCircuit, Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";
import { loginUser } from "../../services/auth";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await loginUser({ username, password });
      router.push("/dashboard");
    } catch (err) {
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)] text-slate-50">
      <Navbar />

      <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-6xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-xl shadow-violet-900/50 backdrop-blur">

            <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-violet-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-0 h-36 w-36 rounded-full bg-sky-500/25 blur-3xl" />

            <div className="relative space-y-6">


              {/* Title */}
              <div>
                <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
                  Welcome back
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  Login to continue your learning.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Username */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Username
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-2 flex items-center px-1 text-slate-400 transition hover:text-slate-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <p className="text-xs text-red-400">
                    {error}
                  </p>
                )}

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30"
                >
                  {loading && <span className="spinner" />}
                  <span>{loading ? "Logging in..." : "Login"}</span>
                </button>

                {/* Register */}
                <p className="pt-2 text-center text-sm text-slate-400">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-violet-400 hover:underline"
                  >
                    Register
                  </Link>
                </p>

              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
