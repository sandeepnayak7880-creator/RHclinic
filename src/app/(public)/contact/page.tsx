"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { siteConfig } from "@/config/site";

type ContactFormData = {
  name: string;
  phone_number: string;
  subject: string;
  message: string;
};

const initialFormData: ContactFormData = {
  name: "",
  phone_number: "",
  subject: "",
  message: "",
};

export default function Page() {
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
    setSuccessMessage("");
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (Object.values(formData).some((value) => !value.trim())) {
      setErrorMessage("Please complete all fields before sending your enquiry.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.from("enquiries").insert({
        ...formData,
        status: "unread",
      });

      if (error) {
        throw error;
      }

      setFormData(initialFormData);
      setSuccessMessage("Thank you. Your enquiry has been sent successfully.");
    } catch {
      setErrorMessage("We could not send your enquiry right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const fieldClassName =
    "mt-2 w-full rounded-xl border border-teal-200 bg-white px-4 py-3 text-sm text-teal-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10";

  return (
    <section className="bg-teal-50 px-6 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Get in touch</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight text-teal-950 sm:text-5xl">We&apos;re here to help</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Have a question about our care? Send us a message or visit the clinic in Wanaparthy.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl bg-teal-950 p-7 text-teal-50 shadow-xl shadow-teal-900/10 sm:p-9">
            <h2 className="text-xl font-semibold">Visit the clinic</h2>
            <div className="mt-7 space-y-6 text-sm leading-6 text-teal-100/80">
              <div>
                <p className="font-semibold text-emerald-300">Address</p>
                <a href={siteConfig.maps} target="_blank" rel="noreferrer" className="mt-1 block hover:text-white">
                  {siteConfig.address}
                </a>
              </div>
              <div>
                <p className="font-semibold text-emerald-300">Phone</p>
                <a href={`tel:${siteConfig.phone.replaceAll(" ", "")}`} className="mt-1 block hover:text-white">{siteConfig.phone}</a>
              </div>
              <div>
                <p className="font-semibold text-emerald-300">Opening hours</p>
                <p className="mt-1">{siteConfig.hours}</p>
              </div>
            </div>
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-teal-900">
              <iframe
                title="Map showing Raghavendra Homoeopathic Clinic"
                src="https://www.google.com/maps?q=Parvathraj%20Complex%2C%20Bus%20Depot%20Rd%2C%20Wanaparthy%2C%20Telangana%20509103&output=embed"
                className="h-64 w-full border-0 grayscale-[20%]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-teal-100 bg-white p-7 shadow-xl shadow-teal-900/5 sm:p-10">
            <h2 className="text-xl font-semibold text-teal-950">Send an enquiry</h2>
            <form onSubmit={handleSubmit} className="mt-7 space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="text-sm font-semibold text-teal-950">
                  Name
                  <input name="name" type="text" value={formData.name} onChange={handleChange} className={fieldClassName} placeholder="Your name" autoComplete="name" required />
                </label>
                <label className="text-sm font-semibold text-teal-950">
                  Phone Number
                  <input name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} className={fieldClassName} placeholder={siteConfig.phone} autoComplete="tel" required />
                </label>
              </div>
              <label className="block text-sm font-semibold text-teal-950">
                Subject
                <input name="subject" type="text" value={formData.subject} onChange={handleChange} className={fieldClassName} placeholder="How can we help?" required />
              </label>
              <label className="block text-sm font-semibold text-teal-950">
                Message
                <textarea name="message" value={formData.message} onChange={handleChange} className={`${fieldClassName} min-h-36 resize-y`} placeholder="Write your message" required />
              </label>
              {errorMessage ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
              {successMessage ? <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{successMessage}</p> : null}
              <button type="submit" disabled={isSubmitting} className="w-full rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
                {isSubmitting ? "Sending..." : "Send enquiry"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}