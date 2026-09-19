"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { siteConfig } from "@/config/site";
import { createClient } from "@/lib/supabase/client";

const slideshowInterval = 4500;

export function Hero() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoadingImages, setIsLoadingImages] = useState(true);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);
  const [isMediaVisible, setIsMediaVisible] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    async function fetchGalleryImages() {
      const supabase = createClient();
      const { data } = await supabase
        .from("gallery")
        .select("image_url")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (isCurrent) {
        setCurrentImageIndex(0);
        setImageLoadFailed(false);
        setIsMediaVisible(true);
        setImageUrls(
          (data ?? [])
            .map((image) => image.image_url)
            .filter((imageUrl): imageUrl is string => Boolean(imageUrl)),
        );
        setIsLoadingImages(false);
      }
    }

    void fetchGalleryImages();

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    if (imageUrls.length < 2 || imageLoadFailed) {
      return;
    }

    const interval = window.setInterval(() => {
      setIsMediaVisible(false);
      window.setTimeout(() => {
        setCurrentImageIndex((index) => (index + 1) % imageUrls.length);
        setImageLoadFailed(false);
        setIsMediaVisible(true);
      }, 350);
    }, slideshowInterval);

    return () => window.clearInterval(interval);
  }, [imageLoadFailed, imageUrls]);

  const currentImage = imageUrls[currentImageIndex];
  const showFallback = isLoadingImages || !currentImage || imageLoadFailed;
  const isVideo = currentImage ? /\.(mp4|webm|ogg|mov)(?:\?.*)?$/i.test(currentImage) : false;

  return (
    <section className="overflow-hidden bg-teal-50">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:px-8 lg:py-28">
        <div className="max-w-3xl">
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
            {siteConfig.tagline}
          </p>
          <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-teal-950 sm:text-5xl lg:text-6xl">
            Expert Homoeopathic Care in Wanaparthy
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Natural, safe, and effective treatments shaped around your health,
            your story, and your long-term wellbeing.
          </p>
          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/appointment"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-900/10 transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Book an Appointment
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center rounded-full border border-teal-200 bg-white px-6 py-3.5 text-sm font-semibold text-teal-800 transition-colors hover:border-teal-300 hover:bg-teal-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
            >
              Learn More
            </Link>
          </div>
          <div className="mt-7 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-emerald-200 bg-white px-5 py-3 text-sm font-medium text-teal-800 shadow-sm">
            <span>Call us: {siteConfig.phone}</span>
            <span className="hidden text-emerald-500 sm:inline" aria-hidden="true">|</span>
            <span>Open Daily: 10AM - 9PM</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white p-8 shadow-2xl shadow-teal-900/10">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-teal-50 to-sky-100">
              {showFallback ? (
                <div className="flex w-full items-end justify-center p-8" aria-label="Natural care illustration">
                  <svg
                    viewBox="0 0 240 220"
                    className="h-auto w-full text-emerald-600"
                    role="img"
                    aria-label="Illustration of a calm plant representing natural care"
                  >
                    <path
                      d="M120 213V92M120 142c-29-8-48-27-53-58 31 1 52 19 53 58Zm1-28c2-33 19-55 49-64 2 31-15 57-49 64Z"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="7"
                    />
                    <path d="M73 213h94" stroke="currentColor" strokeLinecap="round" strokeWidth="7" />
                  </svg>
                </div>
              ) : isVideo ? (
                <video
                  key={currentImage}
                  src={currentImage}
                  autoPlay
                  loop
                  muted
                  playsInline
                  onError={() => setImageLoadFailed(true)}
                  className={`block w-full h-auto object-contain transition-opacity duration-700 ${isMediaVisible ? "opacity-100" : "opacity-0"}`}
                />
              ) : (
                // Gallery dimensions are supplied by each remote asset, so intrinsic img sizing preserves its ratio.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={currentImage}
                  src={currentImage}
                  alt="Raghavendra Homoeopathic Clinic"
                  onError={() => setImageLoadFailed(true)}
                  className={`block w-full h-auto object-contain transition-opacity duration-700 ${isMediaVisible ? "opacity-100" : "opacity-0"}`}
                />
              )}
            </div>
            <div className="mt-7 flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-teal-700">
                <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden="true">
                  <path d="M12 3v18M3 12h18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-teal-950">Care that listens</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Thoughtful consultations for every stage of your health journey.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-emerald-100 bg-white px-5 py-4 shadow-lg shadow-teal-900/10 sm:block">
            <p className="text-xs font-semibold uppercase tracking-widest text-emerald-700">Trusted care</p>
            <p className="mt-1 text-sm font-medium text-teal-950">For you and your family</p>
          </div>
        </div>
      </div>
    </section>
  );
}