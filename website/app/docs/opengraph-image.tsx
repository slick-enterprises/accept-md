import { ImageResponse } from "next/og";

export const alt = "accept-md Documentation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function DocsOpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          background: "#0a0a0a",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 500,
            color: "#2dd4bf",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Documentation
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 56,
            fontWeight: 600,
            color: "white",
            lineHeight: 1.15,
          }}
        >
          accept-md docs
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 24,
            color: "#a1a1aa",
            maxWidth: 700,
          }}
        >
          Install, configure, and operate Accept: text/markdown
        </div>
      </div>
    ),
    { ...size }
  );
}
