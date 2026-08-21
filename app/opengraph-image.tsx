import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

// Site-wide social share image (Open Graph). Placed at the app root so every
// route inherits it. Generated at build time with next/og.
export const alt = "PopOut Market — the neighbourhood app for Melbourne";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Company logo (app icon) embedded as a data URL so Satori can render it.
const logoSrc = `data:image/png;base64,${readFileSync(
  join(process.cwd(), "public/images/app-icon.png"),
).toString("base64")}`;

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 72,
        backgroundColor: "#ffffff",
        padding: "0 96px",
      }}
    >
      {/* Logo on the left */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={logoSrc}
        width={360}
        height={360}
        style={{ borderRadius: 80, flexShrink: 0 }}
        alt=""
      />
      {/* Short text on the right */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 800,
            color: "#111827",
            letterSpacing: "-2px",
            lineHeight: 1.05,
          }}
        >
          PopOut Market
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 42,
            color: "#374151",
          }}
        >
          The neighbourhood app for Melbourne
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontSize: 30,
            color: "#6b7280",
          }}
        >
          Buy and sell locally · multilingual
        </div>
      </div>
    </div>,
    { ...size },
  );
}
