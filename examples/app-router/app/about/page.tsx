export default function About() {
  return (
    <article>
      <h1>About</h1>
      <p>This is the about page. Request it with <code>Accept: text/markdown</code> to get a markdown version.</p>
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Router</td>
            <td>App Router</td>
          </tr>
          <tr>
            <td>Markdown</td>
            <td>Enabled</td>
          </tr>
        </tbody>
      </table>
      <p><a href="/">Back home</a></p>
    </article>
  );
}
