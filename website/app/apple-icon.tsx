import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0b",
          fontFamily: "system-ui, sans-serif",
          fontSize: 48,
          fontWeight: 700,
          color: "white",
        }}
      >
        accept<span style={{ color: "#22c55e" }}>.md</span>
      </div>
    ),
    { ...size }
  );
}
