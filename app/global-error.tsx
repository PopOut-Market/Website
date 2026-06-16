"use client";

// Last-resort boundary for errors in the root layout itself. It replaces the
// whole document, so it must render its own <html>/<body> and use inline styles
// (global CSS may not be applied here).
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f4f6",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        <div style={{ maxWidth: "32rem", padding: "32px", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "1.5rem", color: "#111827" }}>Something went wrong</h1>
          <p style={{ marginTop: "12px", color: "#4b5563" }}>
            Please refresh the page or try again shortly.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "20px",
              background: "#CC3200",
              color: "#fff",
              border: 0,
              borderRadius: "12px",
              padding: "12px 22px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
