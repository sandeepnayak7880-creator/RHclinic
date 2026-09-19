"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Treatment = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
};

export default function Page() {
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchTreatments() {
    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("treatments")
      .select("id, title, description, image_url")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage("We could not load treatments right now.");
    } else {
      setTreatments((data ?? []) as Treatment[]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    void fetchTreatments();
  }, []);

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    setImage(event.target.files?.[0] ?? null);
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!title.trim() || !description.trim() || !image) {
      setErrorMessage("Please enter a title, description, and image.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    const fileName = `treatments/${Date.now()}-${image.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
    const { error: uploadError } = await supabase.storage
      .from("clinic-images")
      .upload(fileName, image);

    if (uploadError) {
      setErrorMessage("The treatment image could not be uploaded.");
      setIsUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("clinic-images")
      .getPublicUrl(fileName);
    const { error: insertError } = await supabase.from("treatments").insert({
      title: title.trim(),
      description: description.trim(),
      image_url: publicUrlData.publicUrl,
    });

    if (insertError) {
      setErrorMessage("The image uploaded, but the treatment could not be saved.");
    } else {
      setTitle("");
      setDescription("");
      setImage(null);
      const fileInput = document.getElementById("treatment-image") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      await fetchTreatments();
    }
    setIsUploading(false);
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    setErrorMessage("");
    const supabase = createClient();
    const { error } = await supabase.from("treatments").delete().eq("id", id);

    if (error) {
      setErrorMessage("The treatment could not be deleted.");
    } else {
      setTreatments((current) => current.filter((treatment) => treatment.id !== id));
    }
    setDeletingId(null);
  }

  return (
    <section className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-gray-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Content management</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-teal-950">Manage Treatments</h1>
          <p className="mt-2 text-sm text-gray-500">Add and maintain the treatment areas shown to patients.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-lg font-semibold text-teal-950">Add treatment</h2>
          <form onSubmit={handleSubmit} className="mt-6 grid gap-5 lg:grid-cols-2" noValidate>
            <label className="text-sm font-semibold text-teal-950">
              Title
              <input type="text" value={title} onChange={(event) => setTitle(event.target.value)} className="mt-2 w-full rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" placeholder="Respiratory Issues" required />
            </label>
            <label className="text-sm font-semibold text-teal-950">
              Image
              <input id="treatment-image" type="file" accept="image/*" onChange={handleImageChange} className="mt-2 block w-full rounded-xl border border-teal-200 px-3 py-2.5 text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-semibold file:text-emerald-700" required />
            </label>
            <label className="text-sm font-semibold text-teal-950 lg:col-span-2">
              Description
              <textarea value={description} onChange={(event) => setDescription(event.target.value)} className="mt-2 min-h-28 w-full resize-y rounded-xl border border-teal-200 px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10" placeholder="Short description of this area of care" required />
            </label>
            {errorMessage ? <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 lg:col-span-2">{errorMessage}</p> : null}
            <button type="submit" disabled={isUploading} className="w-fit rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-wait disabled:opacity-60">{isUploading ? "Uploading..." : "Add treatment"}</button>
          </form>
        </div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold text-teal-950">Current treatments</h2>
          {isLoading ? <p className="mt-5 text-sm text-gray-500">Loading treatments...</p> : treatments.length === 0 ? <p className="mt-5 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">No treatments found.</p> : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {treatments.map((treatment) => (
                <article key={treatment.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                  <div className="relative h-40 bg-gradient-to-br from-emerald-100 to-teal-100">
                    {treatment.image_url ? <Image src={treatment.image_url} alt={treatment.title} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /> : null}
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-teal-950">{treatment.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-gray-600">{treatment.description}</p>
                    <button type="button" onClick={() => void handleDelete(treatment.id)} disabled={deletingId === treatment.id} className="mt-5 rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-wait disabled:opacity-60">{deletingId === treatment.id ? "Deleting..." : "Delete"}</button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}