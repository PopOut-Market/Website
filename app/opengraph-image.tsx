import { ImageResponse } from "next/og";

// Site-wide social share image (Open Graph). Placed at the app root so every
// route inherits it unless a segment provides its own. Generated at build/request
// time with next/og — no static design asset to maintain.
export const alt = "PopOut Market — Melbourne's second-hand marketplace";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          padding: "90px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 108,
            fontWeight: 800,
            color: "#CC3200",
            letterSpacing: "-2px",
          }}
        >
          PopOut Market
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 48,
            color: "#374151",
          }}
        >
          Melbourne&apos;s second-hand marketplace
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 32,
            color: "#6b7280",
          }}
        >
          Buy &amp; sell locally · suburb-first · multilingual
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 64,
            height: 16,
            width: 280,
            backgroundColor: "#CC3200",
            borderRadius: 9999,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
