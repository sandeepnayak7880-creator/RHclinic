import Image from "next/image";

export function DoctorPreview() {
  return (
    <section className="bg-emerald-50 py-20 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div className="relative mx-auto w-full max-w-md">
          <div className="overflow-hidden rounded-[2rem] border-8 border-white bg-teal-100 shadow-xl shadow-teal-900/10">
            <Image
              src="/doctor.png"
              alt="Dr. Raghavendra"
              width={480}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>
          <p className="absolute bottom-5 left-5 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-widest text-emerald-800 shadow-md">
            Your health partner
          </p>
        </div>

        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Meet your doctor</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-sky-950 sm:text-4xl">
            Personal care, grounded in experience
          </h2>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            Dr. Raghavendra welcomes you to Raghavendra Homoeopathic Clinic,
            where every consultation begins with time, attention, and a clear
            understanding of your needs.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <div className="border-l-2 border-emerald-500 pl-4">
              <p className="text-sm font-semibold text-sky-950">Qualifications</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">BHMS, MD (HOMOEPATHY).</p>
            </div>
            <div className="border-l-2 border-emerald-500 pl-4">
              <p className="text-sm font-semibold text-sky-950">Experience</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">3+ Years of thoughtful clinical practice and guidance.</p>
            </div>
          </div>
          <p className="mt-8 text-base font-medium leading-7 text-sky-900">
            “You deserve care that sees the person, not just the symptoms.”
          </p>
        </div>
      </div>
    </section>
  );
}