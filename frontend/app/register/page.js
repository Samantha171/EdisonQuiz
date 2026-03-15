"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrainCircuit, Eye, EyeOff } from "lucide-react";
import Navbar from "../../components/Navbar";
import { registerUser } from "../../services/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser({ username, email, password });
      router.push("/dashboard");
    }
    catch (err) {
      const errorData = err.response?.data;
      if (errorData?.username) {
        setError(errorData.username[0]);   // "A user with that username already exists."
      } else if (errorData?.email) {
        setError(errorData.email[0]);
      } else if (errorData?.password) {
        setError(errorData.password[0]);
      } else {
        setError("Registration failed. Please try again.");
      }
    }finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full overflow-auto bg-[radial-gradient(circle_at_top,_#4c1d95,_#020617)] text-slate-50">
      <Navbar />
      <main className="mx-auto flex min-h-screen max-w-6xl justify-center px-4 pt-16 pb-32">
      <div className="w-full max-w-lg">
          <div className="relative overflow-auto rounded-3xl border border-slate-800/80 bg-slate-950/60 p-8 shadow-xl shadow-violet-900/50 backdrop-blur">
            <div className="pointer-events-none absolute -top-24 right-0 h-40 w-40 rounded-full bg-violet-600/30 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-0 h-36 w-36 rounded-full bg-sky-500/25 blur-3xl" />

            <div className="relative space-y-6">

              <div>
                <h1 className="text-2xl font-semibold text-slate-50 md:text-3xl">
                  Create your account
                </h1>
                <p className="mt-1 text-sm text-slate-300">
                  Start learning smarter today.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Username
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Choose a username"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Email
                  </label>
                  <input
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>

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
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center px-1 text-slate-400 transition hover:text-slate-200"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-300">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 pr-10 text-sm text-slate-100 placeholder:text-slate-400 outline-none transition focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-2 flex items-center px-1 text-slate-400 transition hover:text-slate-200"
                      aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-400">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-lg hover:shadow-violet-500/30"
                >
                  {loading && <span className="spinner" />}
                  <span>{loading ? "Registering..." : "Register"}</span>
                </button>

                <p className="pt-2 text-center text-sm text-slate-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-violet-400 hover:underline">
                    Login
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


