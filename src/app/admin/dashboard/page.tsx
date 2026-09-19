export const dynamic = "force-dynamic";

import type { Appointment } from "@/types/appointment";
import { createClient } from "@/lib/supabase/server";
import { AppointmentsTable } from "@/components/admin/AppointmentsTable";

export default async function Page() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true })
    .order("appointment_time", { ascending: true });

  const appointments = (data ?? []) as Appointment[];

  return (
    <section className="min-h-screen bg-gray-50 px-6 py-10 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
              Overview
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-teal-950">
              Appointments
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Review and manage incoming patient consultation requests.
            </p>
          </div>
          <p className="rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-gray-200">
            {appointments.length} {appointments.length === 1 ? "appointment" : "appointments"}
          </p>
        </div>

        {error ? (
          <div role="alert" className="mt-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            We could not load appointments right now. Please refresh and try again.
          </div>
        ) : (
          <AppointmentsTable initialAppointments={appointments} />
        )}
      </div>
    </section>
  );
}