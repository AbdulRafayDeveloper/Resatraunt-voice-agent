import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";
// Vercel preview deployments must never be indexed in place of the canonical site.
const isPreview = Boolean(process.env.VERCEL_ENV) && process.env.VERCEL_ENV !== "production";

/**
 * Content Security Policy. Inline scripts/styles are required by Next.js hydration and Tailwind;
 * everything else is restricted to this origin. No third-party scripts, frames or fonts are
 * loaded at runtime (fonts are self-hosted by next/font and the icon subset lives in /public).
 * 'unsafe-eval' is only needed by the development tooling.
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self' data:",
  "img-src 'self' data: blob:",
  "frame-src 'none'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()" },
  { key: "X-Robots-Tag", value: isPreview ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" },
];

const nextConfig: NextConfig = {
  compress: true,
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    // Rewrite barrel imports to direct module imports so unused parts (e.g. Zod locales) are not bundled.
    optimizePackageImports: ["zod", "react-hook-form", "@hookform/resolvers"],
  },
  compiler: {
    removeConsole: isProd ? { exclude: ["error", "info"] } : false,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 65, 70, 75],
    minimumCacheTTL: 86400,
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      {
        source: "/(images|fonts)/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Brand icons: cache for a week but allow updates after a redeploy.
        source: "/:file((?:favicon|icon|android-chrome|apple-touch-icon|maskable-icon|monochrome-icon)[A-Za-z0-9-]*[.](?:png|ico)|logo-mark[.]svg|safari-pinned-tab[.]svg)",
        headers: [{ key: "Cache-Control", value: "public, max-age=604800, must-revalidate" }],
      },
    ];
  },
};

export default nextConfig;
