import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Raghavendra Homoeopathic Clinic | Best Homeopathy in Wanaparthy",
  description:
    "Trusted homeopathic treatments in Wanaparthy for chronic illnesses, skin disorders, hair fall, allergies, and general wellness. Book your consultation today.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
    keywords: [
    "Raghavendra Homoeopathic Clinic",
    "Homeopathy Wanaparthy",
    "Best Homeopathy Doctor Wanaparthy",
    "Homeopathic Clinic near me",
    "Skin Treatment Wanaparthy Homeopathy",
  ],
  metadataBase: new URL("https://raghavendrahomeopathy.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Raghavendra Homoeopathic Clinic | Wanaparthy",
    description: "Safe & Effective Homeopathic Care in Wanaparthy.",
    url: "https://raghavendrahomeopathy.in",
    siteName: "Raghavendra Homoeopathic Clinic",
    locale: "en_IN",
    type: "website",
  },
};

// @ts-ignore - Keeping your existing LayoutProps type
export default function RootLayout({ children }: LayoutProps<"/">) {
  // Medical Clinic Schema for Google Search Rich Results
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "name": "Raghavendra Homoeopathic Clinic",
    "image": "https://raghavendrahomeopathy.in/logo.png",
    "@id": "https://raghavendrahomeopathy.in",
    "url": "https://raghavendrahomeopathy.in",
    "telephone": "+917020008721",
    "priceRange": "₹₹",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Main Road",
      "addressLocality": "Wanaparthy",
      "addressRegion": "Telangana",
      "postalCode": "509103",
      "addressCountry": "IN",
    },
    "medicalSpecialty": "Homeopathic",
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body>
        {/* SEO Schema Script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        
        {children}
        
        <Script id="google-translate-init" strategy="afterInteractive">
          {`function googleTranslateElementInit() {
            new window.google.translate.TranslateElement({
              pageLanguage: 'en',
              includedLanguages: 'en,hi,te',
              autoDisplay: false
            }, 'google_translate_element');
          }`}
        </Script>
        <Script
          id="google-translate-script"
          src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}