"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navigationLinks = [
    { href: "/admin/dashboard", label: "Appointments" },
    { href: "/admin/dashboard/enquiries", label: "Enquiries" },
    { href: "/admin/dashboard/gallery", label: "Slideshow / Gallery" },
    { href: "/admin/dashboard/announcements", label: "Announcements" },
    { href: "/admin/dashboard/schedule", label: "Schedule & Leaves" },
    { href: "/admin/dashboard/treatments", label: "Manage Treatments" },
    { href: "/admin/dashboard/reviews", label: "Reviews" },
    { href: "/admin/dashboard/analytics", label: "Analytics" },
    { href: "/admin/dashboard/notifications", label: "Notifications" },
  ];

  type Notification = {
    id: string;
    title: string;
    message: string;
    created_at: string;
  };

  useEffect(() => {
    async function fetchNotifications() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("notifications")
        .select("id, title, message, created_at")
        .eq("is_read", false)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Notification fetch failed:", error.message, error.details, error.hint);
        return;
      }

      setNotifications((data ?? []) as Notification[]);
    }

    void fetchNotifications();
  }, []);

  async function markAsRead(id: string) {
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (!error) {
      setNotifications((current) => current.filter((notification) => notification.id !== id));
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  function renderNavigationLinks() {
    return navigationLinks.map((link) => {
      const isActive = pathname === link.href;

      return (
        <Link
          key={link.href}
          href={link.href}
          onClick={() => setIsOpen(false)}
          className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium transition-colors ${isActive ? "bg-emerald-600 text-white shadow-sm" : "text-teal-100/75 hover:bg-white/10 hover:text-white"}`}
          aria-current={isActive ? "page" : undefined}
        >
          {link.label}
        </Link>
      );
    });
  }

  return (
    <>
      <header className="flex items-center justify-between bg-emerald-900 p-4 text-white md:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">Clinic portal</p>
          <p className="mt-1 font-semibold">Doctor&apos;s Dashboard</p>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close admin menu" : "Open admin menu"}
          className="rounded-xl p-2 hover:bg-white/10"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {isOpen ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-emerald-900 p-5 text-white md:hidden">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">Doctor&apos;s Dashboard</p>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Close admin menu" className="rounded-xl p-2 hover:bg-white/10">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav aria-label="Mobile admin navigation" className="mt-8 flex flex-col gap-2">
            {renderNavigationLinks()}
          </nav>
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="mt-auto rounded-xl border border-white/10 px-4 py-3 text-left text-sm font-medium text-emerald-100 hover:bg-white/10 disabled:opacity-60"
          >
            {isLoggingOut ? "Signing out..." : "Logout"}
          </button>
        </div>
      ) : null}

    <aside className="hidden h-full w-64 shrink-0 flex-col bg-teal-950 text-teal-50 md:flex">
      <div className="border-b border-white/10 px-6 py-7">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
          Clinic portal
        </p>
        <p className="mt-2 text-lg font-semibold leading-tight">Doctor&apos;s Dashboard</p>
      </div>

      <nav aria-label="Admin navigation" className="flex flex-col gap-2 px-4 py-5">
        {renderNavigationLinks()}
      </nav>

      <div className="relative mx-4 mb-4">
        <button
          type="button"
          onClick={() => setIsNotificationsOpen((open) => !open)}
          aria-expanded={isNotificationsOpen}
          aria-label={`Notifications${notifications.length ? `, ${notifications.length} unread` : ""}`}
          className="flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-teal-100/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          <span className="flex items-center gap-3">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM10 21h4" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
            Notifications
          </span>
          {notifications.length > 0 ? <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs font-bold text-white">{notifications.length}</span> : null}
        </button>

        {isNotificationsOpen ? (
          <div className="absolute bottom-14 left-0 z-20 w-72 rounded-2xl border border-teal-100 bg-white p-3 text-teal-950 shadow-2xl">
            <div className="flex items-center justify-between px-2 py-1">
              <p className="text-sm font-semibold">Unread notifications</p>
              <Link href="/admin/dashboard/notifications" className="text-xs font-semibold text-emerald-700 hover:text-emerald-800">View all</Link>
            </div>
            {notifications.length === 0 ? (
              <p className="px-2 py-5 text-sm text-gray-500">You&apos;re all caught up.</p>
            ) : (
              <div className="mt-2 max-h-64 space-y-1 overflow-y-auto">
                {notifications.map((notification) => (
                  <button key={notification.id} type="button" onClick={() => void markAsRead(notification.id)} className="w-full rounded-xl p-2 text-left hover:bg-emerald-50">
                    <p className="text-sm font-semibold">{notification.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-gray-500">{notification.message}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>

      <div className="mt-auto border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-teal-100/75 transition-colors hover:bg-red-500/15 hover:text-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? "Signing out..." : "Logout"}
        </button>
      </div>
    </aside>
    </>
  );
}