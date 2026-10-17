"use client";

import { useEffect } from "react";
import { LogoMark } from "@/components/graphics/LogoMark";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Last-resort error boundary for failures in the root layout itself. It must render its own
 * <html> and <body>, so it uses plain styles rather than the app's fonts and components.
 */
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(JSON.stringify({ event: "global_error", digest: error.digest, message: error.message }));
  }, [error]);

  return (
    <html lang="en-GB">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#FAF6EF", color: "#1E1B21" }}>
        <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
          <LogoMark size={56} />
          <h1 style={{ fontSize: 32, margin: "16px 0 12px", color: "#3B0F1A" }}>Something went wrong</h1>
          <p style={{ maxWidth: 480, lineHeight: 1.6, margin: "0 0 24px", color: "#5E5964" }}>The page could not be loaded. Please try again. If it keeps happening, call our booking line and we will help directly.</p>
          <button type="button" onClick={reset} style={{ background: "#5B1D2B", color: "#fff", border: 0, borderRadius: 8, padding: "12px 20px", fontWeight: 700, cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
