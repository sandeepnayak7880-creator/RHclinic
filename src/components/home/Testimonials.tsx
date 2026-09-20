"use client";

import { FormEvent, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Review = { id: string; patient_name: string; rating: number; comment: string };

export function Testimonials() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", rating: 5, comment: "" });
  const [hoverRating, setHoverRating] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState("");

  async function fetchReviews() {
    const supabase = createClient();
    const { data } = await supabase.from("reviews").select("id, patient_name, rating, comment").eq("is_approved", true).order("created_at", { ascending: false });
    setReviews((data ?? []) as Review[]);
    setIsLoading(false);
  }

  useEffect(() => { void fetchReviews(); }, []);

  const averageRating = reviews.length
    ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
    : 0;
  const visibleReviews = reviews.slice(currentIndex, currentIndex + 3);

  async function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim() || !form.comment.trim()) { setMessage("Please complete your name and comment."); return; }
    setIsSubmitting(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("reviews").insert({ patient_name: form.name.trim(), rating: Number(form.rating), comment: form.comment.trim() });
    if (error) {
      console.error("Review Submission Error:", error.message);
      setMessage("We could not submit your review. Please try again.");
    } else {
      setForm({ name: "", rating: 5, comment: "" });
      setHoverRating(0);
      setIsFormOpen(false);
      setMessage("Thank you. Your review will appear after approval.");
    }
    setIsSubmitting(false);
  }

  return (
    <section className="bg-teal-50 px-6 py-20 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Patient experiences</p><h2 className="mt-3 text-3xl font-semibold tracking-tight text-teal-950 sm:text-4xl">Care that makes a difference</h2></div>
          <button type="button" onClick={() => setIsFormOpen((open) => !open)} className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700">{isFormOpen ? "Close form" : "Leave a Review"}</button>
        </div>
        {isFormOpen ? <form onSubmit={submitReview} className="mt-8 grid gap-4 rounded-2xl border border-emerald-200 bg-white p-6 sm:grid-cols-3"><input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="Name" className="rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none focus:border-emerald-500" required /><div><p className="text-sm font-semibold text-teal-950">Your rating</p><div className="mt-2 flex gap-1" onMouseLeave={() => setHoverRating(0)}>{[1, 2, 3, 4, 5].map((value) => <button key={value} type="button" onMouseEnter={() => setHoverRating(value)} onFocus={() => setHoverRating(value)} onBlur={() => setHoverRating(0)} onClick={() => setForm((current) => ({ ...current, rating: value }))} aria-label={`${value} star${value === 1 ? "" : "s"}`} className="rounded p-1 text-amber-400 hover:bg-amber-50 focus-visible:outline-2 focus-visible:outline-emerald-600"><Star size={24} fill={value <= (hoverRating || form.rating) ? "currentColor" : "none"} /></button>)}</div></div><textarea value={form.comment} onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))} placeholder="Your experience" className="min-h-12 rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 sm:col-span-2" required /><div className="flex flex-col gap-3 sm:col-span-3 sm:flex-row sm:items-center"><button type="submit" disabled={isSubmitting} className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">{isSubmitting ? "Sending..." : "Submit review"}</button><a href="https://maps.app.goo.gl/iiPR2E9xySgLkwhb8" target="_blank" rel="noreferrer" className="rounded-full border border-teal-200 px-5 py-3 text-center text-sm font-semibold text-teal-800 hover:bg-teal-50">Review us on Google Maps</a>{message ? <p role="status" className="text-sm text-emerald-700">{message}</p> : null}</div></form> : null}
        {!isFormOpen && message ? <p role="status" className="mt-5 text-sm text-emerald-700">{message}</p> : null}
        {isLoading ? (
          <p className="mt-10 text-sm text-slate-500">Loading patient experiences...</p>
        ) : reviews.length === 0 ? (
          <p className="mt-10 text-sm text-slate-500">Be the first to share your experience.</p>
        ) : (
          <>
            <div className="mt-8 flex items-center gap-3 text-emerald-700">
              <div className="flex gap-1" aria-label={`${averageRating.toFixed(1)} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Star key={value} size={18} fill={value <= Math.round(averageRating) ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-sm font-semibold text-teal-950">{averageRating.toFixed(1)} / 5.0 from {reviews.length} reviews</p>
            </div>
            <div className="mt-8 flex w-full items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentIndex((previous) => Math.max(previous - 3, 0))}
                disabled={currentIndex === 0}
                aria-label="Previous reviews"
                className="shrink-0 rounded-full border border-emerald-200 p-2 text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={32} />
              </button>
              <div className="grid min-w-0 flex-1 grid-cols-1 gap-6 md:grid-cols-3">
                {visibleReviews.map((review) => (
                  <article key={review.id} className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm">
                    <div className="flex gap-1 text-emerald-600" aria-label={`${review.rating} out of 5 stars`}>
                      {[1, 2, 3, 4, 5].map((value) => <Star key={value} size={18} fill={value <= review.rating ? "currentColor" : "none"} />)}
                    </div>
                    <p className="mt-4 text-sm leading-6 text-slate-600">&ldquo;{review.comment}&rdquo;</p>
                    <p className="mt-5 text-sm font-semibold text-teal-950">{review.patient_name}</p>
                  </article>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setCurrentIndex((previous) => previous + 3)}
                disabled={currentIndex + 3 >= reviews.length}
                aria-label="Next reviews"
                className="shrink-0 rounded-full border border-emerald-200 p-2 text-emerald-700 transition-colors hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}