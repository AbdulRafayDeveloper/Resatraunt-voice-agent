/** Every indexable route on the site. Keep in sync with src/app/sitemap.ts. */
export const staticRoutes = [
  "/",
  "/restaurants",
  "/restaurants/bonheur-by-matt-abe",
  "/restaurants/lei",
  "/collections",
  "/collections/date-night",
  "/cities",
  "/cities/london",
  "/awards",
  "/guides",
  "/guides/how-to-book-a-michelin-starred-restaurant",
  "/request-a-table",
  "/about",
  "/for-restaurants",
  "/faqs",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/cookie-policy",
  "/booking-policy",
] as const;

/**
 * Console messages we tolerate: dev-only noise from Next.js, and Firefox reporting font downloads
 * that were aborted (status 2152398850 = NS_BINDING_ABORTED) when the dev server hot-reloads a page.
 */
export function isIgnorableConsoleError(text: string): boolean {
  return /Download the React DevTools|hydration|favicon|net::ERR_|Failed to load resource.*fonts\.googleapis|downloadable font: download failed.*status=2152398850/i.test(text);
}
