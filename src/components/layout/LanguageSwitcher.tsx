"use client";

import { Languages, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export function LanguageSwitcher() {
  const [selectedLang, setSelectedLang] = useState("en");

  useEffect(() => {
    const translationCookie = document.cookie
      .split("; ")
      .find((cookie) => cookie.startsWith("googtrans="));
    const language = translationCookie?.split("=")[1]?.split("/")[2];

    if (language === "hi" || language === "te") {
      setSelectedLang(language);
    }
  }, []);

  function handleLanguageChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const lang = event.target.value;
    setSelectedLang(lang);

    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;

    if (lang !== "en") {
      document.cookie = `/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; path=/;`;
      document.cookie = `googtrans=/en/${lang}; path=/; domain=${window.location.hostname};`;
    }

    window.location.reload();
  }

  // Determine what text to show on desktop
  const displayLang = selectedLang === "te" ? "Telugu" : selectedLang === "hi" ? "Hindi" : "English";

  return (
    <div className="relative flex items-center">
      
      {/* 1. VISUAL LAYER: What the user actually sees */}
      <div className="flex items-center gap-1 sm:gap-2 rounded-full border border-emerald-200 bg-white px-2 py-1.5 sm:px-3 hover:bg-emerald-50 transition-colors pointer-events-none">
        <Languages className="h-4 w-4 text-emerald-700 shrink-0" aria-hidden="true" />
        
        {/* The text is completely hidden on mobile ('hidden'), but shows on desktop ('sm:block') */}
        <span className="hidden sm:block text-sm font-medium text-emerald-900">
          {displayLang}
        </span>
        
        <ChevronDown className="h-3 w-3 text-emerald-700 shrink-0" aria-hidden="true" />
      </div>

      {/* 2. INTERACTION LAYER: Invisible native select placed perfectly over the visual layer */}
      <select
        value={selectedLang}
        onChange={handleLanguageChange}
        aria-label="Choose language"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        <option value="en">English</option>
        <option value="te">Telugu</option>
        <option value="hi">Hindi</option>
      </select>

      <div id="google_translate_element" className="hidden" aria-hidden="true" />
    </div>
  );
}