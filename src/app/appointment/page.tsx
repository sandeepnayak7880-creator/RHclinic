import { AppointmentForm } from "@/components/appointment/AppointmentForm";

export default function Page() {
  return (
    <section className="bg-teal-50 px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            Appointment booking
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-teal-950 sm:text-4xl">
            Book Your Consultation with Dr. Raghavendra
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Share your preferred time and a little about your needs. The clinic
            will get in touch to confirm your consultation.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-teal-100 bg-white p-6 shadow-xl shadow-teal-900/5 sm:p-10">
          <AppointmentForm />
        </div>
      </div>
    </section>
  );
}