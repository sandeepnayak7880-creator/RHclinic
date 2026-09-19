import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-emerald-900 bg-teal-950 text-teal-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <p className="text-lg font-semibold">{siteConfig.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-teal-100/75">
            Compassionate homoeopathic care for individuals and families in
            Wanaparthy.
          </p>
          <address className="mt-5 max-w-sm not-italic text-sm leading-6 text-teal-100/75">
            <a className="transition-colors hover:text-white" href={siteConfig.maps} target="_blank" rel="noreferrer">
              {siteConfig.address}
            </a>
            <br />
            <a className="transition-colors hover:text-white" href={`tel:${siteConfig.phone.replaceAll(" ", "")}`}>
              {siteConfig.phone}
            </a>
            <br />
            {siteConfig.hours}
          </address>
          <a
            href={siteConfig.instagram}
            target="_blank"
            rel="noreferrer"
            aria-label="Follow Raghavendra Homoeopathic Clinic on Instagram"
            className="mt-6 inline-flex h-10 w-10 items-center justify-center rounded-full border border-teal-700 text-teal-100 transition-colors hover:border-emerald-300 hover:bg-emerald-600 hover:text-white"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" aria-hidden="true">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
            </svg>
          </a>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Quick navigation
          </h2>
          <nav aria-label="Footer navigation" className="mt-4 flex flex-col items-start gap-3">
            {siteConfig.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-teal-100/75 transition-colors hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-emerald-300">
            Visit us
          </h2>
          <p className="mt-4 text-sm leading-6 text-teal-100/75">
            Open daily from 10:00 AM to 9:00 PM for attentive, individualised
            homoeopathic care.
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-5 text-xs text-teal-100/60 lg:px-8">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}