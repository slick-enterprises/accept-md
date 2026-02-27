const steps = [
  {
    step: 1,
    title: "Middleware intercepts",
    detail:
      "Requests with Accept: text/markdown are rewritten to an internal handler.",
  },
  {
    step: 2,
    title: "Same URL, HTML first",
    detail:
      "The handler fetches your page as HTML (your app renders once), then converts HTML → Markdown.",
  },
  {
    step: 3,
    title: "Clean Markdown out",
    detail:
      "Nav/footer stripped, headings/links/images/tables preserved. Response can be cached.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-ink-800/80 px-4 py-section sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="section-label">How it works</p>
        <h2 className="mt-3 font-display text-4xl tracking-tight text-white sm:text-5xl md:text-6xl">
          No custom server, no edits
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-ink-300">
          Your page components stay untouched. Middleware does the work.
        </p>
        <div className="mt-14 flex flex-col gap-6 md:flex-row md:items-stretch md:gap-6">
          {steps.map((s, index) => (
            <div
              key={s.step}
              className="group relative flex flex-1 flex-col rounded-card-lg border border-ink-800/60 bg-gradient-to-br from-ink-950/95 to-ink-900/60 p-6 backdrop-blur-sm transition-all duration-500 hover:border-brand-500/40 hover:from-ink-900/70 hover:to-ink-950/90 hover:shadow-xl md:p-8"
            >
              {/* Connecting line for desktop - perfectly aligned with step badge center */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute -right-[18px] top-0 h-full w-[18px] pointer-events-none overflow-visible z-0">
                  {/* Main horizontal line - aligned with badge center (p-8 = 32px padding + 24px to badge center = 56px) */}
                  <div className="absolute left-0 top-[56px] h-[1px] w-full bg-gradient-to-r from-brand-500/70 via-brand-500/60 to-brand-500/40"></div>
                  {/* Arrow head - perfectly centered on the line */}
                  <div className="absolute left-full top-[55.5px] -translate-y-1/2 w-0 h-0 border-t-[3.5px] border-t-transparent border-b-[3.5px] border-b-transparent border-l-[5px] border-l-brand-500/70"></div>
                  {/* Subtle glow effect for depth */}
                  <div className="absolute left-0 top-[56px] h-[1px] w-full bg-brand-500/30 blur-[2px]"></div>
                  {/* Connecting dot at the start */}
                  <div className="absolute left-0 top-[55.5px] -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand-500/60"></div>
                </div>
              )}
              
              <div className="relative z-10">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-brand-500/40 bg-gradient-to-br from-brand-500/15 to-brand-600/5 font-mono text-base font-bold text-brand-300 shadow-sm transition-all duration-300 group-hover:border-brand-500/60 group-hover:from-brand-500/25 group-hover:to-brand-600/10 group-hover:shadow-md group-hover:shadow-brand-500/20">
                  {s.step}
                </span>
                <div className="absolute -inset-1 rounded-xl bg-brand-500/0 blur transition-all duration-300 group-hover:bg-brand-500/10"></div>
              </div>
              <h3 className="mt-6 font-display text-xl text-white transition-colors group-hover:text-brand-300 sm:text-2xl">
                {s.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-300 transition-colors group-hover:text-ink-200">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
