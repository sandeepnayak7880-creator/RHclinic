const contactActions = [
  {
    label: "WhatsApp",
    href: "https://wa.me/917020008721",
    className: "bg-[#25d366] hover:bg-[#1ebe5d]",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 object-contain" fill="none" aria-hidden="true">
        <path d="M19.1 4.9A9.9 9.9 0 0 0 3.4 16.8L2.5 21.5l4.8-.9A9.9 9.9 0 1 0 19.1 4.9Z" stroke="currentColor" strokeWidth="1.8" />
        <path d="M8.4 7.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.3.1.5-.1.7l-.6.7c.6 1.1 1.5 2 2.6 2.6l.7-.6c.2-.2.5-.2.7-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1.3.4-2.3.1-1.1-.3-2.5-1.1-3.8-2.4-1.3-1.3-2.1-2.7-2.4-3.8-.3-1-.1-1.9.1-2.3Z" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "Call the clinic",
    href: "tel:+917020008721",
    className: "bg-sky-600 hover:bg-sky-700",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 object-contain" fill="none" aria-hidden="true">
        <path d="M6.5 3.5h3l1.5 4-2 1.5a15.5 15.5 0 0 0 5.9 5.9l1.5-2 4 1.5v3c0 .8-.7 1.5-1.5 1.5C11.2 18.9 5.1 12.8 5.1 5c0-.8.6-1.5 1.4-1.5Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
      </svg>
    ),
  },
  {
    label: "Open location in Maps",
    href: "https://maps.app.goo.gl/iiPR2E9xySgLkwhb8",
    className: "bg-rose-600 hover:bg-rose-700",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 object-contain" fill="none" aria-hidden="true">
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.8" />
      </svg>
    ),
  },
];

export function FloatingContact() {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
      {contactActions.map((action) => (
        <a
          key={action.label}
          href={action.href}
          target={action.href.startsWith("http") ? "_blank" : undefined}
          rel={action.href.startsWith("http") ? "noreferrer" : undefined}
          aria-label={action.label}
          className={`group relative flex h-14 w-14 items-center gap-2 justify-center rounded-full text-white shadow-md transition-transform duration-200 hover:scale-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 ${action.className}`}
        >
          {action.icon}
          <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-lg bg-teal-950 px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block group-focus-visible:block">
            {action.label}
          </span>
        </a>
      ))}
    </div>
  );
}