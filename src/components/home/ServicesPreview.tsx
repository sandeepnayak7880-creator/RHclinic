const services = [
  {
    title: "Respiratory Issues",
    description: "Supportive care for seasonal concerns, allergies, and breathing discomfort.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M12 4v7m0 0c-2.8-3.4-6.5-2.1-6.5 2v2.5c0 2.5 1.5 4 3.5 4 2.2 0 3-1.5 3-4.5m0-4c2.8-3.4 6.5-2.1 6.5 2v2.5c0 2.5-1.5 4-3.5 4-2.2 0-3-1.5-3-4.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: "Skin Conditions",
    description: "Gentle, individualised support for clearer and more comfortable skin.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M12 3.5c3.8 4.2 6.5 7.2 6.5 10.8a6.5 6.5 0 1 1-13 0C5.5 10.7 8.2 7.7 12 3.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="M9 15.5c.5 1.5 1.4 2.3 3 2.7" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: "Digestive Health",
    description: "Balanced care for everyday digestive comfort and overall vitality.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M8 4v5.5c0 1.7 1.2 3 2.7 3H13c1.7 0 3 1.3 3 3v4.5M8 4h3m-3 0v3m8-3v5c0 1.4.8 2.5 2 3.2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.7" />
      </svg>
    ),
  },
  {
    title: "Chronic Pain",
    description: "Long-term support focused on comfort, mobility, and quality of life.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
        <path d="M8.5 5.5a3 3 0 0 1 5.1-2.1l1.9 1.9a3 3 0 0 1 0 4.2l-5.7 5.7a3 3 0 0 1-4.2 0l-1.9-1.9a3 3 0 0 1 2.1-5.1h2.7Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.7" />
        <path d="m13 11 3.5 3.5m-1.2 4.9 2.1-2.1m1.2 4.2.5-.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      </svg>
    ),
  },
];

export function ServicesPreview() {
  return (
    <section className="bg-white py-20 lg:py-24" id="services">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Areas of care</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-sky-950 sm:text-4xl">
            Support for your whole wellbeing
          </h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">
            Explore thoughtful homoeopathic care for common concerns, always
            tailored to the individual.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <article
              key={service.title}
              className="group rounded-3xl border border-teal-100 bg-teal-50/60 p-6 transition-transform hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-teal-900/5"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-emerald-600 shadow-sm ring-1 ring-teal-100 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
                {service.icon}
              </div>
              <h3 className="mt-7 text-lg font-semibold text-sky-950">{service.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}