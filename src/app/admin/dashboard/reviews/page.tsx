"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Review = {
  id: string;
  patient_name: string;
  rating: number;
  comment: string;
  is_approved: boolean;
  created_at: string;
};

export default function Page() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchReviews() {
      const supabase = createClient();
      const { data: reviews, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Reviews Fetch Error:", error);
        setErrorMessage(error.message);
      } else {
        setReviews((reviews ?? []) as Review[]);
      }
      setIsLoading(false);
    }

    void fetchReviews();
  }, []);

  async function toggleApproval(review: Review) {
    setUpdatingId(review.id);
    setErrorMessage("");
    const supabase = createClient();
    const { error } = await supabase
      .from("reviews")
      .update({ is_approved: !review.is_approved })
      .eq("id", review.id);

    if (error) {
      setErrorMessage("We could not update this review.");
    } else {
      setReviews((current) => current.map((item) => item.id === review.id ? { ...item, is_approved: !review.is_approved } : item));
    }
    setUpdatingId(null);
  }

  return (
    <section className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-gray-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Patient voices</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-teal-950">Reviews</h1>
          <p className="mt-2 text-sm text-gray-500">Approve patient feedback before it appears publicly.</p>
        </div>
        {isLoading ? <p className="mt-8 text-sm text-gray-500">Loading reviews...</p> : errorMessage ? <p role="alert" className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : reviews.length === 0 ? <p className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">No reviews found.</p> : (
          <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50"><tr>{["Date", "Patient", "Rating", "Comment", "Visibility"].map((heading) => <th key={heading} scope="col" className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{heading}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-100">
                  {reviews.map((review) => <tr key={review.id} className="align-top hover:bg-teal-50/40">
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">{new Date(review.created_at).toLocaleDateString("en-IN")}</td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-teal-950">{review.patient_name}</td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-amber-500">{"★".repeat(Math.min(5, Math.max(0, review.rating)))}</td>
                    <td className="max-w-md px-6 py-5 text-sm leading-6 text-gray-600">{review.comment}</td>
                    <td className="whitespace-nowrap px-6 py-5"><button type="button" onClick={() => void toggleApproval(review)} disabled={updatingId === review.id} className={`rounded-full px-4 py-2 text-xs font-semibold transition-colors disabled:cursor-wait disabled:opacity-60 ${review.is_approved ? "bg-emerald-50 text-emerald-700 hover:bg-amber-50 hover:text-amber-700" : "bg-amber-50 text-amber-700 hover:bg-emerald-50 hover:text-emerald-700"}`}>{updatingId === review.id ? "Saving..." : review.is_approved ? "Hide" : "Approve"}</button></td>
                  </tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}