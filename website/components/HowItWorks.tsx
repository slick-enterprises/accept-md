const steps = [
  {
    step: "01",
    title: "Intercept",
    detail:
      "Middleware detects Accept: text/markdown and rewrites the request to an internal handler.",
  },
  {
    step: "02",
    title: "Render & convert",
    detail:
      "The handler fetches the page as HTML — your app renders once — then converts it to Markdown.",
  },
  {
    step: "03",
    title: "Return clean output",
    detail:
      "Chrome, boilerplate, and nav are stripped. Headings, links, images, and tables stay intact. Responses are cacheable.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 border-t border-white/5 px-4 py-section sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        <p className="section-label">How it works</p>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl">
          Three steps, zero page edits
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-400">
          Your components stay untouched. Next.js middleware or SvelteKit hooks
          handle the routing — deploys to Vercel with no custom server.
        </p>
        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.step}
              className="card-hover group rounded-xl border border-white/[0.06] bg-white/[0.02] p-8 transition-colors duration-200 hover:bg-white/[0.04]"
            >
              <span className="text-xs font-medium uppercase tracking-wider text-ink-500">
                {s.step}
              </span>
              <h3 className="mt-6 text-lg font-semibold text-white">
                {s.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ink-400">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
