"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Announcement = {
  title: string;
  content: string;
};

export function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    async function fetchAnnouncement() {
      const supabase = createClient();
      const { data } = await supabase
        .from("announcements")
        .select("title, content")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      const nextAnnouncement = data as Announcement | null;
      setAnnouncement(
        nextAnnouncement?.title?.trim() && nextAnnouncement?.content?.trim()
          ? nextAnnouncement
          : null,
      );
    }

    void fetchAnnouncement();
  }, []);

  if (!announcement) {
    return null;
  }

  return (
    <aside className="border-b border-emerald-200 bg-emerald-50 px-6 py-3 text-center text-sm text-emerald-950">
      <span className="font-semibold">{announcement.title}:</span>{" "}
      <span>{announcement.content}</span>
    </aside>
  );
}