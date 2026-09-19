export const dynamic = "force-dynamic";

import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";

type Treatment = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
};

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("treatments")
    .select("id, title, description, image_url")
    .order("created_at", { ascending: false });
  const treatments = (data ?? []) as Treatment[];

  return (
    <div className="bg-white">
      <section className="bg-teal-950 px-6 py-20 text-white lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-300">Personalised care</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">Our Homoeopathic Treatments</h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-teal-100/80">Natural, safe, and root-cause healing guided by careful listening and an individual approach to your wellbeing.</p>
        </div>
      </section>

      <section className="px-6 py-20 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Areas of care</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-teal-950 sm:text-4xl">Care for the whole person</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">Every consultation is shaped around your symptoms, history, and health goals.</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {treatments.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-teal-200 bg-teal-50 px-6 py-12 text-center text-sm text-slate-600 sm:col-span-2 lg:col-span-3">
                Treatment information will be available soon.
              </p>
            ) : treatments.map((treatment) => (
              <article key={treatment.id} className="group overflow-hidden rounded-3xl border border-teal-100 bg-teal-50/60 transition-transform hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-teal-900/5">
                <div className="relative h-52 bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100">
                  {treatment.image_url ? <Image src={treatment.image_url} alt={treatment.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /> : <div className="flex h-full items-center justify-center text-emerald-600"><svg viewBox="0 0 32 32" className="h-12 w-12" fill="none" aria-hidden="true"><circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.8" /><path d="M16 8v16m-8-8h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.8" /></svg></div>}
                </div>
                <div className="p-7">
                  <h3 className="text-xl font-semibold text-teal-950">{treatment.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{treatment.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-emerald-50 px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl border border-emerald-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Why choose Dr. Raghavendra?</p>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {["Gentle, natural care", "Holistic approach", "Experienced guidance"].map((item) => (
              <div key={item} className="border-l-2 border-emerald-500 pl-5"><h3 className="font-semibold text-teal-950">{item}</h3><p className="mt-2 text-sm leading-6 text-slate-600">Care that considers the complete picture and supports your long-term wellbeing.</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20 text-center lg:px-8 lg:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Your next step</p>
        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-teal-950 sm:text-4xl">Let&apos;s talk about your health</h2>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-slate-600">Book a consultation with Dr. Raghavendra and begin a more personal approach to care.</p>
        <Link href="/appointment" className="mt-8 inline-flex rounded-full bg-emerald-600 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">Book an Appointment</Link>
      </section>
    </div>
  );
}