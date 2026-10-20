"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const treatments = [
  {
    title: "Skin & Hair Disorders",
    examples: "Psoriasis, eczema, hair fall",
    description: "A careful review of symptoms, history, triggers, and existing skin or scalp care.",
    icon: "◌",
  },
  {
    title: "Chronic Respiratory & Asthma",
    examples: "Asthma, recurring cough, wheeze",
    description: "Consultation considers symptom patterns and coordinates with your usual respiratory care.",
    icon: "〰",
  },
  {
    title: "Digestive & Gastric Health",
    examples: "Acidity, indigestion, bowel concerns",
    description: "A whole-person review of digestive symptoms, diet, medicines, and when further assessment is needed.",
    icon: "＋",
  },
  {
    title: "Pediatric & Child Immunity",
    examples: "Child wellness, teething concerns",
    description: "Age-appropriate consultation with attention to a child’s development and established pediatric care.",
    icon: "♡",
  },
  {
    title: "Allergies & Sinusitis",
    examples: "Seasonal allergies, sinus symptoms",
    description: "Assessment of symptom timing, possible triggers, and appropriate evidence-based care options.",
    icon: "✳",
  },
];

export function TreatmentsSection() {
  return (
    <motion.section
      id="services"
      className="bg-white px-6 py-20 lg:px-8 lg:py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.32, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Areas of care</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-teal-950 sm:text-4xl">Care conversations for common concerns</h2>
          <p className="mt-4 text-lg leading-8 text-slate-600">Discuss your concerns with Dr. Raghavendra and understand the options appropriate to your health needs.</p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {treatments.map((treatment, index) => (
            <motion.article
              key={treatment.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.24, delay: index * 0.03 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.99 }}
              className="group rounded-2xl border border-emerald-100/80 bg-white/80 p-6 shadow-sm backdrop-blur-md transition-shadow duration-150 hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-2xl font-semibold text-emerald-700 transition-colors duration-150 group-hover:bg-emerald-600 group-hover:text-white" aria-hidden="true">{treatment.icon}</div>
              <h3 className="mt-5 text-lg font-semibold text-teal-950">{treatment.title}</h3>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-emerald-700">{treatment.examples}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">{treatment.description}</p>
              <Link href="/appointment" className="mt-5 inline-flex rounded-full border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600">
                Book for this Condition
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}