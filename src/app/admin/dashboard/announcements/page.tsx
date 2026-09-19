"use client";

import { FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Announcement = {
  id: string;
  title: string;
  content: string;
  created_at: string;
};

type AnnouncementForm = {
  title: string;
  content: string;
};

const initialForm: AnnouncementForm = { title: "", content: "" };

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export default function Page() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchAnnouncements() {
    setIsLoading(true);
    setErrorMessage("");

    const supabase = createClient();
    const { data, error } = await supabase
      .from("announcements")
      .select("id, title, content, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage("We could not load announcements. Please try again.");
    } else {
      setAnnouncements((data ?? []) as Announcement[]);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    void fetchAnnouncements();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!form.title.trim() || !form.content.trim()) {
      setErrorMessage("Please enter both a title and announcement content.");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error } = await supabase.from("announcements").insert({
      title: form.title.trim(),
      content: form.content.trim(),
    });

    if (error) {
      setErrorMessage("We could not publish the announcement. Please try again.");
    } else {
      setForm(initialForm);
      await fetchAnnouncements();
    }

    setIsSubmitting(false);
  }

  async function handleDelete(announcementId: string) {
    setDeletingId(announcementId);
    setErrorMessage("");

    const supabase = createClient();
    const { error } = await supabase
      .from("announcements")
      .delete()
      .eq("id", announcementId);

    if (error) {
      setErrorMessage("We could not remove that announcement. Please try again.");
    } else {
      setAnnouncements((current) =>
        current.filter((announcement) => announcement.id !== announcementId),
      );
    }

    setDeletingId(null);
  }

  return (
    <section className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <div className="border-b border-gray-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Communications</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-teal-950">Announcements</h1>
          <p className="mt-2 text-sm text-gray-500">Share important updates with your patients.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-teal-950">Create announcement</h2>
          <form onSubmit={handleSubmit} className="mt-6 space-y-5" noValidate>
            <label className="block text-sm font-semibold text-teal-950">
              Title
              <input
                type="text"
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-3 text-sm text-teal-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Announcement title"
                required
              />
            </label>
            <label className="block text-sm font-semibold text-teal-950">
              Content
              <textarea
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                className="mt-2 min-h-32 w-full resize-y rounded-xl border border-teal-200 px-4 py-3 text-sm text-teal-950 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                placeholder="Write the announcement for patients"
                required
              />
            </label>
            {errorMessage ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Publishing..." : "Publish announcement"}
            </button>
          </form>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-teal-950">Published announcements</h2>
          {isLoading ? (
            <p className="mt-5 text-sm text-gray-500">Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <p className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">No announcements found.</p>
          ) : (
            <div className="mt-5 space-y-4">
              {announcements.map((announcement) => (
                <article key={announcement.id} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <h3 className="text-lg font-semibold text-teal-950">{announcement.title}</h3>
                    <time className="text-xs text-gray-500" dateTime={announcement.created_at}>{formatDate(announcement.created_at)}</time>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-600">{announcement.content}</p>
                  <button
                    type="button"
                    onClick={() => void handleDelete(announcement.id)}
                    disabled={deletingId === announcement.id}
                    className="mt-5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:cursor-wait disabled:opacity-60"
                  >
                    {deletingId === announcement.id ? "Removing..." : "Delete"}
                  </button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}