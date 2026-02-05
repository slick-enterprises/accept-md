export default function Home() {
  return (
    <article>
      <h1>Welcome to the App Router Example</h1>
      <p>
        This page is served as <strong>HTML</strong> by default. Request it with{' '}
        <code>Accept: text/markdown</code> to get a markdown representation.
      </p>
      <h2>Features</h2>
      <ul>
        <li>Next.js App Router</li>
        <li>accept-md runtime</li>
        <li>Zero config</li>
      </ul>
      <p>
        <a href="/about">Go to About</a>
      </p>
    </article>
  );
}
