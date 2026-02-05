export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="no-markdown" data-no-markdown>
          <a href="/">Home</a> | <a href="/about">About</a>
        </nav>
        <main>{children}</main>
        <footer className="no-markdown">accept-md App Router example</footer>
      </body>
    </html>
  );
}
