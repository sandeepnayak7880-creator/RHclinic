"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function Page() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchNotifications() {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("id, title, message, is_read, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage("We could not load notifications right now.");
    } else {
      setNotifications((data ?? []) as Notification[]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    void fetchNotifications();
  }, []);

  async function markAsRead(id: string) {
    const supabase = createClient();
    const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    if (!error) {
      setNotifications((current) => current.map((notification) => notification.id === id ? { ...notification, is_read: true } : notification));
    }
  }

  return (
    <section className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-4xl">
        <div className="border-b border-gray-200 pb-8">
          <Link href="/admin/dashboard" className="text-sm font-semibold text-emerald-700 hover:text-emerald-800">Back to dashboard</Link>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-teal-950">Notifications</h1>
          <p className="mt-2 text-sm text-gray-500">Stay up to date with new patient activity.</p>
        </div>
        {isLoading ? <p className="mt-8 text-sm text-gray-500">Loading notifications...</p> : errorMessage ? <p role="alert" className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : notifications.length === 0 ? <p className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">No notifications found.</p> : (
          <div className="mt-8 space-y-3">
            {notifications.map((notification) => (
              <article key={notification.id} className={`rounded-2xl border bg-white p-5 shadow-sm ${notification.is_read ? "border-gray-200" : "border-emerald-200"}`}>
                <div className="flex flex-col justify-between gap-2 sm:flex-row">
                  <h2 className="font-semibold text-teal-950">{notification.title}</h2>
                  <time className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString("en-IN")}</time>
                </div>
                <p className="mt-2 text-sm leading-6 text-gray-600">{notification.message}</p>
                {!notification.is_read ? <button type="button" onClick={() => void markAsRead(notification.id)} className="mt-4 text-xs font-semibold text-emerald-700 hover:text-emerald-800">Mark as read</button> : <span className="mt-4 inline-block text-xs text-gray-400">Read</span>}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}