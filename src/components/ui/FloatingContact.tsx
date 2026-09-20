const contactActions = [
  {
    label: "WhatsApp",
    href: "https://wa.me/917020008721",
    className: "bg-[#25d366] hover:bg-[#1ebe5d]",
    icon: (
      /* Replaced wobbly outline with perfect official WhatsApp SVG */
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 16 16" 
        className="h-7 w-7 shrink-0" 
        fill="currentColor" 
        aria-hidden="true"
      >
        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
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
    href: "https://maps.app.goo.gl/XbCdJzwizgQd1LWb9", /* Updated to your new link */
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