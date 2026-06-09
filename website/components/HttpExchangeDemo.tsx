export function HttpExchangeDemo() {
  return (
    <div className="code-block overflow-hidden text-left">
      <div className="border-b border-white/[0.06] px-4 py-2 text-xs text-ink-500">
        HTTP exchange
      </div>
      <pre className="overflow-x-auto p-4 text-sm leading-relaxed">
        <code>
          <span className="text-ink-500">GET</span>{" "}
          <span className="text-ink-200">/docs/installation</span>{" "}
          <span className="text-ink-500">HTTP/1.1</span>
          {"\n"}
          <span className="accent-text">Accept: text/markdown</span>
          {"\n\n"}
          <span className="text-ink-500">→ 200</span>{" "}
          <span className="accent-text">text/markdown</span>
          {"\n\n"}
          <span className="text-ink-500">---</span>
          {"\n"}
          <span className="text-ink-300">title: Installation</span>
          {"\n"}
          <span className="text-ink-300">description: Install accept-md...</span>
          {"\n"}
          <span className="text-ink-500">---</span>
          {"\n\n"}
          <span className="text-ink-400"># Installation</span>
          {"\n\n"}
          <span className="text-ink-400">
            Run from your project root...
          </span>
        </code>
      </pre>
    </div>
  );
}
