import type { Metadata } from "next";
import { getBaseUrl, siteConfig } from "@/config/site";
import type { City, Collection, FaqItem, Guide, Restaurant, Weekday } from "@/types";
import { getImage, type SiteImageKey } from "@/data/images";
import { priceBandSymbol } from "@/lib/utils";

export const BASE_URL = getBaseUrl();

const OG_IMAGE = `${BASE_URL}/opengraph-image`;

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  /** Photo key from siteImages shown on the branded social card. Without it the card is logo-only. */
  photo?: SiteImageKey;
  /** Short label above the title on the social card, e.g. "Restaurants in London". */
  eyebrow?: string;
  type?: "website" | "article";
  noIndex?: boolean;
}

/** Absolute URL for the branded social card rendered by src/app/og/route.tsx. */
export function socialImageUrl(input: { title: string; subtitle?: string; eyebrow?: string; photo?: SiteImageKey }): string {
  const url = new URL("/og", BASE_URL);
  url.searchParams.set("t", input.title);
  if (input.eyebrow) url.searchParams.set("e", input.eyebrow);
  if (input.subtitle) url.searchParams.set("s", input.subtitle);
  if (input.photo) url.searchParams.set("p", input.photo);
  return url.toString();
}

export function absoluteUrl(path: string): string {
  return new URL(path || "/", BASE_URL).toString().replace(/\/$/, path ? "" : "");
}

/** Build complete per-page metadata: canonical, Open Graph, Twitter. */
export function buildMetadata({ title, description, path, photo, eyebrow, type = "website", noIndex = false }: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const ogImage = path ? socialImageUrl({ title, subtitle: description, eyebrow, photo }) : OG_IMAGE;
  return {
    title,
    description,
    alternates: { canonical: url },
    robots: noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description,
      url,
      type,
      siteName: siteConfig.fullName,
      locale: "en_GB",
      images: [{ url: ogImage, width: 1200, height: 630, alt: `${siteConfig.fullName}: ${title}` }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export const organizationId = `${BASE_URL}/#organization`;
export const websiteId = `${BASE_URL}/#website`;

/** No postal address or telephone: the business has not supplied them, so none are claimed. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: siteConfig.fullName,
  url: BASE_URL,
  logo: { "@type": "ImageObject", url: `${BASE_URL}/icon-512x512.png`, width: 512, height: 512 },
  image: OG_IMAGE,
  description: siteConfig.description,
  foundingDate: String(siteConfig.foundedYear),
  telephone: siteConfig.phone,
  contactPoint: { "@type": "ContactPoint", telephone: siteConfig.phone, contactType: "reservations", availableLanguage: "English" },
  areaServed: [
    { "@type": "Country", name: "United Kingdom" },
    { "@type": "Country", name: "United States" },
  ],
  knowsAbout: ["Restaurant reservations", "Tasting menus", "Michelin Guide restaurants", "James Beard Award restaurants", "Fine dining in London", "Fine dining in New York"],
  ...(siteConfig.instagramUrl ? { sameAs: [siteConfig.instagramUrl] } : {}),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": websiteId,
  url: BASE_URL,
  name: siteConfig.fullName,
  description: siteConfig.description,
  publisher: { "@id": organizationId },
  inLanguage: siteConfig.language,
  potentialAction: {
    "@type": "SearchAction",
    target: { "@type": "EntryPoint", urlTemplate: `${BASE_URL}/restaurants?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
};

export function buildBreadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${BASE_URL}${item.path}`,
    })),
  };
}

export function buildFaqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

export function buildWebPageSchema(page: { name: string; description: string; path: string; type?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": page.type ?? "WebPage",
    "@id": `${BASE_URL}${page.path}#webpage`,
    url: `${BASE_URL}${page.path}`,
    name: page.name,
    description: page.description,
    isPartOf: { "@id": websiteId },
    about: { "@id": organizationId },
    inLanguage: siteConfig.language,
  };
}

const schemaDays: Record<Weekday, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

/**
 * schema.org Restaurant for a listing. Only facts the restaurant itself publishes are included:
 * no ratings, no review counts, no invented offers.
 */
export function buildRestaurantSchema(restaurant: Restaurant, cityName: string) {
  const path = `/restaurants/${restaurant.slug}`;
  const image = getImage(restaurant.image);
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${BASE_URL}${path}#restaurant`,
    name: restaurant.name,
    url: restaurant.website,
    mainEntityOfPage: `${BASE_URL}${path}`,
    description: restaurant.tagline,
    image: `${BASE_URL}${image.src}`,
    servesCuisine: restaurant.cuisine,
    priceRange: priceBandSymbol(restaurant.priceBand, restaurant.currency),
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address.street,
      addressLocality: restaurant.address.locality || cityName,
      ...(restaurant.address.region ? { addressRegion: restaurant.address.region } : {}),
      postalCode: restaurant.address.postalCode,
      addressCountry: restaurant.country,
    },
    ...(restaurant.phone ? { telephone: restaurant.phone } : {}),
    ...(restaurant.instagram ? { sameAs: [restaurant.instagram] } : {}),
    openingHoursSpecification: restaurant.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days.map((d) => schemaDays[d]),
      opens: h.opens,
      closes: h.closes,
    })),
    acceptsReservations: restaurant.reservations.bookingUrl ?? "True",
    hasMenu: restaurant.menu.sourceUrl,
    ...(restaurant.awards.length ? { award: restaurant.awards.map((a) => `${a.title} (${a.body}, ${a.year})`) } : {}),
  };
}

export function buildRestaurantListSchema(name: string, restaurants: Restaurant[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    itemListElement: restaurants.map((r, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: r.name,
      url: `${BASE_URL}/restaurants/${r.slug}`,
    })),
  };
}

export function buildCollectionSchema(collection: Collection, restaurants: Restaurant[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/collections/${collection.slug}#webpage`,
    url: `${BASE_URL}/collections/${collection.slug}`,
    name: collection.title,
    description: collection.intro,
    isPartOf: { "@id": websiteId },
    mainEntity: buildRestaurantListSchema(collection.title, restaurants),
  };
}

export function buildCitySchema(city: City, restaurants: Restaurant[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE_URL}/cities/${city.slug}#webpage`,
    url: `${BASE_URL}/cities/${city.slug}`,
    name: `Restaurants in ${city.name}`,
    description: city.intro[0],
    isPartOf: { "@id": websiteId },
    about: { "@type": "City", name: city.name, containedInPlace: { "@type": "Country", name: city.countryName } },
    mainEntity: buildRestaurantListSchema(`Restaurants in ${city.name}`, restaurants),
  };
}

export function buildArticleSchema(guide: Guide) {
  const path = `/guides/${guide.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BASE_URL}${path}#article`,
    headline: guide.title,
    description: guide.excerpt,
    image: `${BASE_URL}${getImage(guide.image).src}`,
    datePublished: guide.publishedOn,
    dateModified: guide.updatedOn,
    author: { "@id": organizationId },
    publisher: { "@id": organizationId },
    mainEntityOfPage: `${BASE_URL}${path}`,
    inLanguage: siteConfig.language,
    articleSection: guide.category,
  };
}
