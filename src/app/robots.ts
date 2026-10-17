import type { MetadataRoute } from "next";
import { getBaseUrl, isProductionDeployment } from "@/config/site";

/**
 * Production: allow everything except internal routes. Preview and development deployments
 * disallow all crawling so a temporary Vercel URL can never be indexed instead of the canonical site.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();
  if (!isProductionDeployment()) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/", "/_next/"] }],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
