"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type BlockedDate = {
  id: string;
  date: string;
  reason: string | null;
};

export default function Page() {
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [blockedDate, setBlockedDate] = useState("");
  const [reason, setReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchBlockedDates() {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("blocked_dates")
      .select("id, date, reason")
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date", { ascending: true });

    if (error) {
      setErrorMessage("We could not load blocked dates. Please try again.");
    } else {
      setBlockedDates((data ?? []) as BlockedDate[]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    void fetchBlockedDates();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!blockedDate) {
      setErrorMessage("Please choose a date to block.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const formattedDate = new Date(blockedDate).toISOString().split("T")[0];
    const { error } = await supabase.from("blocked_dates").insert({
      date: formattedDate,
      reason,
    });

    if (error) {
      console.error("Failed to block date:", error.message);
      setErrorMessage("We could not block that date. It may already be blocked.");
    } else {
      setBlockedDate("");
      setReason("");
      await fetchBlockedDates();
    }
    setIsSubmitting(false);
  }

  async function handleUnblock(id: string) {
    setErrorMessage("");
    setDeletingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("blocked_dates").delete().eq("id", id);

    if (error) {
      setErrorMessage("We could not unblock that date. Please try again.");
    } else {
      setBlockedDates((currentDates) => currentDates.filter((date) => date.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <section className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-4xl">
        <div className="border-b border-gray-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Clinic availability</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-teal-950">Schedule &amp; Leaves</h1>
          <p className="mt-2 text-sm text-gray-500">Close booking availability for holidays, leave, or clinic closures.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-teal-950">Block a date</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-5 sm:grid-cols-[1fr_1.4fr_auto] sm:items-end" noValidate>
            <label className="text-sm font-semibold text-teal-950">
              Date
              <input
                type="date"
                value={blockedDate}
                onChange={(event) => setBlockedDate(event.target.value)}
                className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-3 text-sm text-teal-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                required
              />
            </label>
            <label className="text-sm font-semibold text-teal-950">
              Reason <span className="font-normal text-gray-400">(optional)</span>
              <input
                type="text"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-3 text-sm text-teal-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Holiday, personal leave..."
              />
            </label>
            <button type="submit" disabled={isSubmitting} className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? "Blocking..." : "Block date"}
            </button>
          </form>
          {errorMessage ? <p role="alert" className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-teal-950">Upcoming blocked dates</h2>
          {isLoading ? (
            <p className="mt-5 text-sm text-gray-500">Loading blocked dates...</p>
          ) : blockedDates.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">No upcoming blocked dates.</p>
          ) : (
            <div className="mt-5 space-y-3">
              {blockedDates.map((date) => (
                <div key={date.id} className="flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold text-teal-950">
                      {new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(`${date.date}T00:00:00`))}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">{date.reason || "Clinic closed"}</p>
                  </div>
                  <button type="button" onClick={() => void handleUnblock(date.id)} disabled={deletingId === date.id} className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60">
                    {deletingId === date.id ? "Removing..." : "Unblock / Delete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}