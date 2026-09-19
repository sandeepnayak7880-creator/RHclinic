"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type GalleryImage = {
  id: string;
  image_url: string;
  created_at: string;
};

export default function Page() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchImages() {
    setIsLoading(true);
    setErrorMessage("");
    const supabase = createClient();
    const { data, error } = await supabase
      .from("gallery")
      .select("id, image_url, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      setErrorMessage("We could not load gallery images. Please try again.");
    } else {
      setImages((data ?? []) as GalleryImage[]);
    }
    setIsLoading(false);
  }

  useEffect(() => {
    void fetchImages();
  }, []);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setSelectedFile(event.target.files?.[0] ?? null);
    setErrorMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    if (!selectedFile) {
      setErrorMessage("Please choose an image before uploading.");
      return;
    }

    setIsUploading(true);
    const supabase = createClient();
    const fileName = `${Date.now()}-${selectedFile.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
    const { error: uploadError } = await supabase.storage.from("clinic-images").upload(fileName, selectedFile);

    if (uploadError) {
      setErrorMessage("The image upload failed. Please try again.");
      setIsUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage.from("clinic-images").getPublicUrl(fileName);
    const { error: insertError } = await supabase.from("gallery").insert({ image_url: publicUrlData.publicUrl });

    if (insertError) {
      setErrorMessage("The image uploaded, but it could not be added to the gallery.");
      setIsUploading(false);
      return;
    }

    setSelectedFile(null);
    const fileInput = document.getElementById("gallery-image") as HTMLInputElement | null;
    if (fileInput) fileInput.value = "";
    await fetchImages();
    setIsUploading(false);
  }

  return (
    <section className="min-h-full bg-gray-50">
      <div className="mx-auto max-w-6xl">
        <div className="border-b border-gray-200 pb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">Media management</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-teal-950">Slideshow / Gallery</h1>
          <p className="mt-2 text-sm text-gray-500">Upload images to showcase the clinic and its care.</p>
        </div>

        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end" noValidate>
            <label className="flex-1 text-sm font-semibold text-teal-950">
              Choose an image
              <input id="gallery-image" type="file" accept="image/*" onChange={handleFileChange} className="mt-2 block w-full rounded-xl border border-teal-200 px-3 py-2.5 text-sm text-gray-600 file:mr-4 file:rounded-full file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:font-semibold file:text-emerald-700" />
            </label>
            <button type="submit" disabled={isUploading} className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {isUploading ? "Uploading..." : "Upload image"}
            </button>
          </form>
          {selectedFile ? <p className="mt-3 text-sm text-gray-500">Selected: {selectedFile.name}</p> : null}
          {errorMessage ? <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{errorMessage}</p> : null}
        </div>

        {isLoading ? <p className="mt-8 text-sm text-gray-500">Loading gallery...</p> : images.length === 0 ? <p className="mt-8 rounded-2xl border border-dashed border-gray-300 bg-white px-6 py-12 text-center text-sm text-gray-500">No gallery images found.</p> : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <figure key={image.id} className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                <img src={image.image_url} alt="Clinic gallery" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="px-4 py-3 text-xs text-gray-500">Added {new Date(image.created_at).toLocaleDateString("en-IN")}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}