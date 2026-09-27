import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";

export function Navbar() {
  const primaryLinks = siteConfig.navLinks.filter(
    (link) => link.name !== "Book Appointment",
  );

  return (
    {/* FIX 1: Added relative z-50 so the dropdown sits on top of all page content */}
    <header className="relative z-50 border-b border-emerald-100 bg-white">
      {/* FIX 2: Removed "overflow-hidden" so the dropdown isn't clipped out of existence */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-6 px-3 py-3 sm:px-6 lg:px-8">
        
        <Link 
          href="/" 
          className="flex items-center gap-2 sm:gap-3 text-emerald-950 transition-colors hover:text-emerald-700 min-w-0 shrink"
        >
          {/* FIX 3: Added rounded-full object-cover back so your logo stays circular! */}
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={52}
            height={52}
            className="h-9 w-9 sm:h-12 sm:w-12 rounded-full object-cover shrink-0"
            priority
          />
          <span className="text-sm sm:text-lg font-semibold leading-tight tracking-tight line-clamp-2 min-w-0">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="hidden items-center gap-7 md:flex shrink-0">
          {primaryLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-emerald-700"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/appointment"
            className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
          >
            Book Appointment
          </Link>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none rounded-full border border-emerald-200 px-3 py-1.5 text-xs sm:text-sm font-semibold text-emerald-800 hover:bg-emerald-50 whitespace-nowrap">
              Menu
            </summary>
            <nav
              aria-label="Mobile navigation"
              className="absolute right-0 top-10 z-10 flex min-w-56 flex-col gap-1 rounded-2xl border border-emerald-100 bg-white p-3 shadow-xl"
            >
              {siteConfig.navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </details>

          <div className="relative z-40 shrink-0">
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}