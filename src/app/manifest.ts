import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.fullName,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FAF6EF",
    theme_color: "#5B1D2B",
    lang: "en-GB",
    dir: "ltr",
    categories: ["food", "lifestyle", "travel"],
    icons: [
      ...[48, 72, 96, 144, 192, 256, 384, 512].map((size) => ({ src: `/icon-${size}x${size}.png`, sizes: `${size}x${size}`, type: "image/png", purpose: "any" as const })),
      { src: "/maskable-icon.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      { src: "/monochrome-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "monochrome" },
    ],
  };
}
