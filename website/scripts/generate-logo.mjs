import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { createElement } from "react";
import { ImageResponse } from "next/og.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outputPath = join(__dirname, "../public/logo.png");

mkdirSync(dirname(outputPath), { recursive: true });

const response = new ImageResponse(
  createElement(
    "div",
    {
      style: {
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0b",
        fontFamily: "system-ui, sans-serif",
        fontSize: 96,
        fontWeight: 700,
        color: "white",
      },
    },
    "accept",
    createElement("span", { style: { color: "#22c55e" } }, ".md")
  ),
  { width: 512, height: 512 }
);

const buffer = Buffer.from(await response.arrayBuffer());
writeFileSync(outputPath, buffer);
console.log(`Wrote ${outputPath}`);
