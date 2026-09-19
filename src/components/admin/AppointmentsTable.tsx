"use client";

import { useState } from "react";
import type { Appointment } from "@/types/appointment";
import { createClient } from "@/lib/supabase/client";

type AppointmentFilter = "today" | "tomorrow" | "upcoming";

const statusOptions: Appointment["status"][] = [
  "Pending",
  "Confirmed",
  "Completed",
  "Rescheduled",
];

const statusLabels: Record<Appointment["status"], string> = {
  Pending: "Pending",
  Confirmed: "Confirmed",
  Completed: "Completed",
  Rescheduled: "Rescheduled",
};

const statusStyles: Record<Appointment["status"], string> = {
  Pending: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Confirmed: "bg-blue-50 text-blue-700 ring-blue-600/20",
  Completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Rescheduled: "bg-violet-50 text-violet-700 ring-violet-600/20",
};

const filterOptions: { value: AppointmentFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "upcoming", label: "All Upcoming" },
];

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

function formatTime(time: string) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(`1970-01-01T${time}`));
}

export function AppointmentsTable({ initialAppointments }: { initialAppointments: Appointment[] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [activeFilter, setActiveFilter] = useState<AppointmentFilter>("upcoming");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedRescheduleId, setSelectedRescheduleId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const today = new Date();
  const todayKey = getDateKey(today);
  const tomorrowKey = getDateKey(new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1));

  const filteredAppointments = appointments.filter((appointment) => {
    if (activeFilter === "today") {
      return appointment.appointment_date === todayKey;
    }
    if (activeFilter === "tomorrow") {
      return appointment.appointment_date === tomorrowKey;
    }
    return appointment.appointment_date >= todayKey;
  });

  async function handleStatusChange(
    appointmentId: string,
    newStatus: Appointment["status"],
    currentStatus: Appointment["status"],
  ) {
    setUpdatingId(appointmentId);
    setNotification(null);

    const supabase = createClient();
    const { error } = await supabase
      .from("appointments")
      .update({ status: newStatus })
      .eq("id", appointmentId);

    if (error) {
      console.error("Status Update Error:", error);
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: currentStatus }
            : appointment,
        ),
      );
      setNotification({ type: "error", text: "We could not update that appointment status." });
    } else {
      setAppointments((current) =>
        current.map((appointment) =>
          appointment.id === appointmentId
            ? { ...appointment, status: newStatus }
            : appointment,
        ),
      );
      setNotification({ type: "success", text: "Appointment status updated." });
    }
    setUpdatingId(null);
  }

  function openRescheduleModal(appointment: Appointment) {
    setSelectedRescheduleId(appointment.id);
    setNewDate(appointment.appointment_date);
    setNewTime(appointment.appointment_time);
    setIsRescheduleModalOpen(true);
    setNotification(null);
  }

  function closeRescheduleModal() {
    setIsRescheduleModalOpen(false);
    setSelectedRescheduleId(null);
    setNewDate("");
    setNewTime("");
  }

  async function confirmReschedule() {
    if (!selectedRescheduleId || !newDate || !newTime) {
      setNotification({ type: "error", text: "Choose a new date and time before confirming." });
      return;
    }

    const appointment = appointments.find((item) => item.id === selectedRescheduleId);
    if (!appointment) {
      closeRescheduleModal();
      return;
    }

    setUpdatingId(selectedRescheduleId);
    setNotification(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("appointments")
      .update({ status: "Rescheduled", appointment_date: newDate, appointment_time: newTime })
      .eq("id", selectedRescheduleId);

    if (error) {
      console.error("Status Update Error:", error);
      setNotification({ type: "error", text: "We could not reschedule that appointment." });
    } else {
      setAppointments((current) =>
        current.map((item) =>
          item.id === selectedRescheduleId
            ? { ...item, status: "Rescheduled", appointment_date: newDate, appointment_time: newTime }
            : item,
        ),
      );
      setNotification({ type: "success", text: "Appointment rescheduled successfully." });
      closeRescheduleModal();
    }
    setUpdatingId(null);
  }

  return (
    <>
      <div className="mt-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex rounded-xl bg-white p-1 shadow-sm ring-1 ring-gray-200" role="tablist" aria-label="Appointment date filters">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              role="tab"
              aria-selected={activeFilter === option.value}
              onClick={() => setActiveFilter(option.value)}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${activeFilter === option.value ? "bg-emerald-600 text-white shadow-sm" : "text-gray-600 hover:bg-teal-50 hover:text-teal-800"}`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500">
          {filteredAppointments.length} {filteredAppointments.length === 1 ? "appointment" : "appointments"}
        </p>
      </div>

      {notification ? (
        <p role={notification.type === "error" ? "alert" : "status"} className={`mt-4 rounded-xl px-4 py-3 text-sm ${notification.type === "success" ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
          {notification.text}
        </p>
      ) : null}

      {filteredAppointments.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-teal-950">No appointments found</h2>
          <p className="mt-2 text-sm text-gray-500">There are no appointments for this date range.</p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-left">
              <thead className="bg-gray-50">
                <tr>
                  {["Patient Name", "Phone", "Date", "Time", "Message", "Status"].map((heading) => (
                    <th key={heading} scope="col" className="whitespace-nowrap px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {filteredAppointments.map((appointment) => (
                  <tr key={appointment.id} className="align-top transition-colors hover:bg-teal-50/40">
                    <td className="whitespace-nowrap px-6 py-5 text-sm font-semibold text-teal-950">{appointment.patient_name}</td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600"><a className="hover:text-emerald-700" href={`tel:${appointment.phone_number}`}>{appointment.phone_number}</a></td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">{formatDate(appointment.appointment_date)}</td>
                    <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-600">{formatTime(appointment.appointment_time)}</td>
                    <td className="max-w-xs px-6 py-5 text-sm leading-6 text-gray-600">{appointment.message}</td>
                    <td className="whitespace-nowrap px-6 py-5">
                      {(() => {
                        const currentStatus = appointment.status ?? "Pending";

                        return (
                      <select
                        value={currentStatus}
                        onChange={(event) => {
                          const nextStatus = event.target.value as Appointment["status"];
                          if (nextStatus === "Rescheduled") {
                            openRescheduleModal(appointment);
                          } else {
                            void handleStatusChange(appointment.id, nextStatus, currentStatus);
                          }
                        }}
                        disabled={updatingId === appointment.id}
                        aria-label={`Status for ${appointment.patient_name}`}
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-semibold capitalize outline-none ring-1 ring-inset focus:ring-2 focus:ring-emerald-500 disabled:cursor-wait disabled:opacity-60 ${statusStyles[currentStatus]}`}
                      >
                        {statusOptions.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}
                      </select>
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {isRescheduleModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-teal-950/50 px-6 py-8" role="presentation">
          <div role="dialog" aria-modal="true" aria-labelledby="reschedule-title" className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Appointment update</p>
                <h2 id="reschedule-title" className="mt-2 text-2xl font-semibold tracking-tight text-teal-950">Reschedule appointment</h2>
              </div>
              <button type="button" onClick={closeRescheduleModal} className="rounded-full px-3 py-1 text-2xl leading-none text-gray-400 hover:bg-teal-50 hover:text-teal-800" aria-label="Close reschedule dialog">&times;</button>
            </div>
            <div className="mt-7 space-y-5">
              <label className="block text-sm font-semibold text-teal-950">
                New Date
                <input type="date" value={newDate} onChange={(event) => setNewDate(event.target.value)} className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
              </label>
              <label className="block text-sm font-semibold text-teal-950">
                New Time
                <input type="time" value={newTime} onChange={(event) => setNewTime(event.target.value)} className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-3 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
              </label>
              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeRescheduleModal} className="rounded-full border border-teal-200 px-5 py-3 text-sm font-semibold text-teal-800 hover:bg-teal-50">Cancel</button>
                <button type="button" onClick={() => void confirmReschedule()} disabled={updatingId === selectedRescheduleId} className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{updatingId === selectedRescheduleId ? "Saving..." : "Confirm Reschedule"}</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}