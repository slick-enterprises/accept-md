import { ImageResponse } from "next/og";

export const alt = "accept-md – Serve Markdown from any Next.js page";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            color: "white",
          }}
        >
          accept<span style={{ color: "#22c55e" }}>.md</span>
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 28,
            color: "#a1a1aa",
            maxWidth: 800,
            textAlign: "center",
          }}
        >
          Serve Markdown from any Next.js page · Accept: text/markdown
        </div>
      </div>
    ),
    { ...size }
  );
}
