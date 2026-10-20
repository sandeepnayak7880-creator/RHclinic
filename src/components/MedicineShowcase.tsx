"use client";

import { motion } from "framer-motion";

const remedies = [
  {
    name: "Arnica montana",
    source: "Mountain daisy",
    traditionalUse: "Traditionally listed in homeopathic references for bruising and soreness.",
    safety: "Injuries need appropriate assessment. Do not apply or ingest concentrated plant products without medical advice.",
  },
  {
    name: "Allium cepa",
    source: "Red onion",
    traditionalUse: "Traditionally listed for runny-nose and seasonal symptom patterns.",
    safety: "Avoid if sensitive to onion-derived ingredients; persistent or severe symptoms warrant clinical review.",
  },
  {
    name: "Chamomilla",
    source: "German chamomile",
    traditionalUse: "Traditionally listed for restlessness and teething-related discomfort.",
    safety: "For children, check any product and dose with a qualified pediatric clinician; do not delay care for concerning symptoms.",
  },
  {
    name: "Nux vomica",
    source: "Strychnine tree seed",
    traditionalUse: "Traditionally listed for digestive complaints in homeopathic materia medica.",
    safety: "The source plant is toxic. Only regulated preparations should be considered under qualified practitioner guidance.",
  },
];

const trustNotes = [
  { title: "Natural-origin sources", detail: "Ingredients and preparation are reviewed individually." },
  { title: "Safety comes first", detail: "Discuss medicines, allergies, pregnancy, and health conditions." },
  { title: "Age-appropriate care", detail: "Children need individualized assessment by qualified clinicians." },
  { title: "Whole-person consultation", detail: "Care planning considers your history and current treatment." },
];

export function MedicineShowcase() {
  return (
    <motion.section
      className="bg-emerald-50/70 px-6 py-20 lg:px-8 lg:py-24"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Homeopathic materia medica</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-teal-950 sm:text-4xl">Remedies are selected for the individual</h2>
          <p className="mt-4 text-base leading-7 text-slate-600">The examples below describe traditional homeopathic references, not established treatment recommendations. Current evidence has not shown homeopathy to reliably treat medical conditions. Do not stop prescribed care or delay medical assessment.</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {remedies.map((remedy, index) => (
            <motion.article
              key={remedy.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.24, delay: index * 0.025 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-2xl border border-emerald-100/80 bg-white/80 p-5 shadow-sm backdrop-blur-md transition-shadow hover:shadow-md"
            >
              <p className="text-lg font-semibold text-teal-950">{remedy.name}</p>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-emerald-700">Source: {remedy.source}</p>
              <p className="mt-4 text-sm leading-6 text-slate-600"><span className="font-semibold text-teal-900">Traditional use: </span>{remedy.traditionalUse}</p>
              <p className="mt-3 border-t border-emerald-100 pt-3 text-xs leading-5 text-slate-600"><span className="font-semibold text-teal-900">Safety: </span>{remedy.safety}</p>
            </motion.article>
          ))}
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {trustNotes.map((note, index) => (
            <motion.div
              key={note.title}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl border border-emerald-100/80 bg-white/80 p-4 shadow-sm backdrop-blur-md"
            >
              <p className="text-sm font-semibold text-emerald-800">{["🌿", "🛡️", "👶", "✦"][index]} {note.title}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">{note.detail}</p>
            </motion.div>
          ))}
        </div>

        <p className="mt-8 rounded-xl border border-emerald-200 bg-white/80 px-5 py-4 text-sm font-medium leading-6 text-teal-900 backdrop-blur-md">
          All remedies are prescribed after individual case analysis by certified doctors.
        </p>
      </div>
    </motion.section>
  );
}