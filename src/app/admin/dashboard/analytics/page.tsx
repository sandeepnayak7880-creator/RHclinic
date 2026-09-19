"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Appointment } from "@/types/appointment";
import { createClient } from "@/lib/supabase/client";

type StackedDailyCount = {
  date: string;
  Pending: number;
  Completed: number;
  Rescheduled: number;
  Confirmed: number;
};
type StatusFilter = "All" | Appointment["status"];
type StatusCount = { name: Appointment["status"]; value: number };

const statusOptions: StatusFilter[] = ["All", "Pending", "Completed", "Rescheduled"];
const statusColors: Record<Appointment["status"], string> = {
  Pending: "#f59e0b",
  Confirmed: "#3b82f6",
  Completed: "#059669",
  Rescheduled: "#8b5cf6",
};

function getStackedDailyCounts(appointments: Appointment[]): StackedDailyCount[] {
  const counts = new Map<string, StackedDailyCount>();

  appointments.forEach((appointment) => {
    const current = counts.get(appointment.appointment_date) ?? {
      date: appointment.appointment_date,
      Pending: 0,
      Completed: 0,
      Rescheduled: 0,
      Confirmed: 0,
    };
    current[appointment.status] += 1;
    counts.set(appointment.appointment_date, current);
  });

  return [...counts.values()].sort((first, second) => first.date.localeCompare(second.date));
}

export default function Page() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");

  useEffect(() => {
    async function fetchAppointments() {
      const supabase = createClient();
      const { data, error } = await supabase.from("appointments").select("*").order("appointment_date", { ascending: true });
      if (error) {
        setErrorMessage("We could not load analytics right now.");
      } else {
        setAppointments((data ?? []) as Appointment[]);
      }
      setIsLoading(false);
    }
    void fetchAppointments();
  }, []);

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesStart = !startDate || appointment.appointment_date >= startDate;
    const matchesEnd = !endDate || appointment.appointment_date <= endDate;
    const matchesStatus = statusFilter === "All" || appointment.status === statusFilter;
    return matchesStart && matchesEnd && matchesStatus;
  });
  const completed = filteredAppointments.filter((appointment) => appointment.status === "Completed").length;
  const pending = filteredAppointments.filter((appointment) => appointment.status === "Pending").length;
  const chartData = getStackedDailyCounts(filteredAppointments);
  const statusData: StatusCount[] = (Object.keys(statusColors) as Appointment["status"][]).map((status) => ({
    name: status,
    value: filteredAppointments.filter((appointment) => appointment.status === status).length,
  })).filter((item) => item.value > 0);

  return (
    <section className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-gray-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Clinic insights</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-teal-950">Analytics</h1>
          <p className="mt-2 text-sm text-gray-500">Track appointment volume and patient workflow at a glance.</p>
        </div>
        <div className="mt-8 grid gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:grid-cols-3">
          <label className="text-sm font-semibold text-teal-950">
            Start Date
            <input type="date" value={startDate} onChange={(event) => setStartDate(event.target.value)} className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
          </label>
          <label className="text-sm font-semibold text-teal-950">
            End Date
            <input type="date" value={endDate} onChange={(event) => setEndDate(event.target.value)} className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" />
          </label>
          <label className="text-sm font-semibold text-teal-950">
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as StatusFilter)} className="mt-2 w-full rounded-xl border border-teal-200 bg-white px-4 py-2.5 text-sm font-normal outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10">
              {statusOptions.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </label>
        </div>
        {isLoading ? <p className="mt-8 text-sm text-gray-500">Loading analytics...</p> : errorMessage ? <p role="alert" className="mt-8 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : (
          <>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Total", filteredAppointments.length],
                ["Completed", completed],
                ["Pending", pending],
                ["Consultations", filteredAppointments.filter((appointment) => appointment.status === "Confirmed").length],
              ].map(([label, value]) => <div key={label} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"><p className="text-sm text-gray-500">{label}</p><p className="mt-3 text-3xl font-semibold text-teal-950">{value}</p></div>)}
            </div>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                <h2 className="text-lg font-semibold text-teal-950">Appointments over time</h2>
                <p className="mt-1 text-sm text-gray-500">Daily appointment volume for the selected filters.</p>
                <div className="mt-8 h-80 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" stroke="#dbe7e6" /><XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 12 }} /><YAxis allowDecimals={false} tick={{ fill: "#64748b", fontSize: 12 }} /><Tooltip /><Legend /><Bar dataKey="Completed" stackId="a" fill="#10b981" /><Bar dataKey="Confirmed" stackId="a" fill="#3b82f6" /><Bar dataKey="Pending" stackId="a" fill="#f59e0b" /><Bar dataKey="Rescheduled" stackId="a" fill="#6366f1" /></BarChart></ResponsiveContainer></div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
                <h2 className="text-lg font-semibold text-teal-950">Status distribution</h2>
                <p className="mt-1 text-sm text-gray-500">Current workflow mix.</p>
                <div className="mt-6 h-80 w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="45%" outerRadius={90} label>{statusData.map((entry) => <Cell key={entry.name} fill={statusColors[entry.name]} />)}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}