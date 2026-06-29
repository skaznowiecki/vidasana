const highlights = ["Frutos secos", "Semillas", "Granolas"];

export function SiteHeader() {
  return (
    <header className="relative overflow-hidden border-b border-sage/10 bg-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_-10%,rgba(193,127,58,0.1),transparent_40%),radial-gradient(circle_at_100%_120%,rgba(61,90,69,0.14),transparent_45%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-6 -top-10 h-40 w-40 rotate-12 text-sage/[0.07]"
      >
        <SproutMark className="h-full w-full" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
        <div className="flex items-center gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sage text-cream shadow-sm md:size-12">
            <SproutMark className="size-6 md:size-7" />
          </span>
          <div>
            <p className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-amber">
              Alimentación natural
            </p>
            <h1 className="font-heading text-3xl font-semibold leading-none text-earth md:text-4xl">
              Vida<span className="text-amber">sana</span>
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-2 md:items-end">
          <p className="max-w-xs text-sm leading-snug text-earth/60 md:text-right">
            Armá tu pedido y envialo directo por WhatsApp.
          </p>
          <div className="flex flex-wrap gap-1.5">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-sage/15 bg-white/70 px-2.5 py-0.5 text-xs font-medium text-sage"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function SproutMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 21v-7" />
      <path d="M12 14c0-3.3-2.7-6-6-6 0 3.3 2.7 6 6 6Z" />
      <path d="M12 12c0-3.9 3.1-7 7-7 0 3.9-3.1 7-7 7Z" />
    </svg>
  );
}
