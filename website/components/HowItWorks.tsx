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
        <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          No custom server, no edits
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-ink-400">
          Your page components stay untouched. Middleware does the work.
        </p>
        <div className="mt-14 flex flex-col gap-6 md:flex-row md:items-stretch md:gap-6">
          {steps.map((s) => (
            <div
              key={s.step}
              className="relative flex flex-1 flex-col rounded-card-lg border border-ink-800 bg-ink-950/80 p-6 md:p-8"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-brand-500/40 bg-brand-500/10 font-mono text-sm font-bold text-brand-400">
                {s.step}
              </span>
              <h3 className="mt-5 font-display text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-400">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
