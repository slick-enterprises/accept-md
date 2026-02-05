export default function Home() {
  return (
    <article>
      <h1>Pages Router Example</h1>
      <p>
        Request this page with <code>Accept: text/markdown</code> to get a markdown representation.
      </p>
      <ul>
        <li>Next.js Pages Router</li>
        <li>accept-md runtime</li>
      </ul>
      <p><a href="/blog/first">First post</a> · <a href="/blog/second">Second post</a></p>
    </article>
  );
}
