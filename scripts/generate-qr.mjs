#!/usr/bin/env node
// Generate qr.png + qr.svg for the deployed URL.
// Usage: node scripts/generate-qr.mjs <url>
import { promises as fs } from "node:fs";
import path from "node:path";
import QRCode from "qrcode";

const url = process.argv[2] ?? "https://ibrews.github.io/holodeck-pocket/";
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");

await QRCode.toFile(path.join(root, "qr.png"), url, {
  errorCorrectionLevel: "M",
  margin: 2,
  scale: 12,
  color: { dark: "#0d0a1e", light: "#f5f3ffff" },
});

const svgString = await QRCode.toString(url, { type: "svg", errorCorrectionLevel: "M", margin: 2, color: { dark: "#0d0a1e", light: "#f5f3ff" } });
await fs.writeFile(path.join(root, "qr.svg"), svgString, "utf8");

console.log(`Wrote qr.png + qr.svg for ${url}`);
