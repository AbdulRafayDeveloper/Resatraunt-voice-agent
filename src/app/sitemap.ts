import type { MetadataRoute } from "next";
import { getBaseUrl, siteConfig } from "@/config/site";
import { cities } from "@/data/cities";
import { collections } from "@/data/collections";
import { guides } from "@/data/guides";
import { getImage, siteImages } from "@/data/images";
import { restaurants } from "@/data/restaurants";

type ChangeFrequency = MetadataRoute.Sitemap[number]["changeFrequency"];

interface StaticRoute {
  path: string;
  changeFrequency: ChangeFrequency;
  priority: number;
  /** ISO date of the last meaningful content change. */
  updatedOn: string;
  images?: string[];
}

const LEGAL_UPDATED = "2026-10-17";
const CONTENT_UPDATED = "2026-10-17";
const checked = siteConfig.dataCheckedOn;

/** Keep in sync with tests/routes.ts. Adding a route means adding it here and there. */
export const staticRoutes: StaticRoute[] = [
  { path: "", changeFrequency: "weekly", priority: 1, updatedOn: checked, images: [siteImages.homeHero.src] },
  { path: "/restaurants", changeFrequency: "weekly", priority: 0.95, updatedOn: checked, images: [siteImages.restaurantsHero.src] },
  { path: "/collections", changeFrequency: "weekly", priority: 0.85, updatedOn: checked, images: [siteImages.collectionsHero.src] },
  { path: "/cities", changeFrequency: "monthly", priority: 0.8, updatedOn: checked, images: [siteImages.citiesHero.src] },
  { path: "/awards", changeFrequency: "monthly", priority: 0.8, updatedOn: checked, images: [siteImages.awardsHero.src] },
  { path: "/guides", changeFrequency: "monthly", priority: 0.7, updatedOn: CONTENT_UPDATED, images: [siteImages.guidesHero.src] },
  { path: "/request-a-table", changeFrequency: "monthly", priority: 0.9, updatedOn: CONTENT_UPDATED, images: [siteImages.requestHero.src] },
  { path: "/about", changeFrequency: "monthly", priority: 0.6, updatedOn: CONTENT_UPDATED, images: [siteImages.aboutHero.src] },
  { path: "/for-restaurants", changeFrequency: "monthly", priority: 0.6, updatedOn: CONTENT_UPDATED, images: [siteImages.forRestaurantsHero.src] },
  { path: "/faqs", changeFrequency: "monthly", priority: 0.6, updatedOn: CONTENT_UPDATED },
  { path: "/contact", changeFrequency: "monthly", priority: 0.6, updatedOn: CONTENT_UPDATED },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3, updatedOn: LEGAL_UPDATED },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3, updatedOn: LEGAL_UPDATED },
  { path: "/cookie-policy", changeFrequency: "yearly", priority: 0.3, updatedOn: LEGAL_UPDATED },
  { path: "/booking-policy", changeFrequency: "yearly", priority: 0.4, updatedOn: LEGAL_UPDATED },
];

function toDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

/** Canonical URLs only, with real last-modified dates and image entries for the image sitemap. */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const absolute = (path: string) => new URL(path || "/", baseUrl).toString().replace(/\/$/, path ? "" : "");

  const statics = staticRoutes.map((r) => ({
    url: absolute(r.path),
    lastModified: toDate(r.updatedOn),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    images: r.images?.map(absolute),
  }));

  const restaurantRoutes = restaurants.map((r) => ({
    url: absolute(`/restaurants/${r.slug}`),
    lastModified: toDate(r.verification.checkedOn),
    changeFrequency: "weekly" as const,
    priority: 0.9,
    images: [absolute(getImage(r.image).src)],
  }));

  const collectionRoutes = collections.map((c) => ({
    url: absolute(`/collections/${c.slug}`),
    lastModified: toDate(checked),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: [absolute(getImage(c.image).src)],
  }));

  const cityRoutes = cities.map((c) => ({
    url: absolute(`/cities/${c.slug}`),
    lastModified: toDate(checked),
    changeFrequency: "weekly" as const,
    priority: 0.8,
    images: [absolute(getImage(c.image).src)],
  }));

  const guideRoutes = guides.map((g) => ({
    url: absolute(`/guides/${g.slug}`),
    lastModified: toDate(g.updatedOn),
    changeFrequency: "monthly" as const,
    priority: 0.6,
    images: [absolute(getImage(g.image).src)],
  }));

  return [...statics, ...restaurantRoutes, ...collectionRoutes, ...cityRoutes, ...guideRoutes];
}
