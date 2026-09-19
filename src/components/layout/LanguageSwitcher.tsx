"use client";

import { Languages } from "lucide-react";
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

  return (
    <div className="flex items-center gap-2">
      <label className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-1 text-emerald-900">
      <Languages className="h-4 w-4 text-emerald-700" aria-hidden="true" />
      <span className="sr-only">Choose language</span>
      <select
        value={selectedLang}
        onChange={handleLanguageChange}
        aria-label="Choose language"
        className="cursor-pointer bg-transparent text-sm text-emerald-900 outline-none"
      >
        <option value="en">English</option>
        <option value="te">Telugu</option>
        <option value="hi">Hindi</option>
      </select>
      </label>
      <div id="google_translate_element" className="hidden" aria-hidden="true" />
    </div>
  );
}