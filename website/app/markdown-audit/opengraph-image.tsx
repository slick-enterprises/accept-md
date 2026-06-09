import { ImageResponse } from "next/og";

export const alt = "Markdown Audit — Test Accept: text/markdown on any URL";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function MarkdownAuditOpenGraphImage() {
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
            fontSize: 64,
            fontWeight: 700,
            color: "white",
          }}
        >
          Markdown Audit
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
          Test Accept: text/markdown on any URL · accept.md
        </div>
      </div>
    ),
    { ...size }
  );
}
