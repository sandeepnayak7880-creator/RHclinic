"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!email.trim() || !password) {
      setErrorMessage("Enter your email and password to continue.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error("Supabase login failed:", error.message, error);
        throw error;
      }

      router.replace("/admin/dashboard");
      router.refresh();
    } catch {
      setErrorMessage("Invalid credentials. Please check your email and password.");
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-[calc(100vh-9rem)] items-center justify-center bg-teal-50 px-6 py-16 lg:px-8">
      <div className="w-full max-w-md rounded-3xl border border-teal-100 bg-white p-8 shadow-xl shadow-teal-900/5 sm:p-10">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Secure portal
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-teal-950">
            Admin sign in
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Sign in to manage clinic appointments and enquiries.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          <label className="block text-sm font-semibold text-teal-950">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-teal-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="block text-sm font-semibold text-teal-950">
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-teal-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </label>

          {errorMessage ? (
            <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}