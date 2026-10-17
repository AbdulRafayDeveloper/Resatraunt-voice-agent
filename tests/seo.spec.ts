import { expect, test } from "@playwright/test";
import { staticRoutes } from "./routes";

test.describe("SEO plumbing", () => {
  test("sitemap lists every route and robots points to it", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    // The sitemap host comes from NEXT_PUBLIC_SITE_URL, which may differ from the test target; match paths only.
    for (const route of staticRoutes) {
      const pattern = route === "/" ? /<loc>https?:\/\/[^/<]+<\/loc>/ : new RegExp(`<loc>https?://[^/<]+${route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}</loc>`);
      expect(xml, `sitemap contains ${route}`).toMatch(pattern);
    }
    // All 13 restaurants are present.
    expect((xml.match(/\/restaurants\/[a-z0-9-]+<\/loc>/g) ?? []).length).toBe(13);
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("/sitemap.xml");
  });

  test("manifest, icons and social images respond", async ({ request }) => {
    for (const path of ["/manifest.webmanifest", "/icon", "/apple-icon", "/opengraph-image", "/twitter-image", "/favicon.ico", "/favicon-32x32.png", "/icon-192x192.png", "/icon-512x512.png", "/maskable-icon-512x512.png", "/monochrome-icon-512x512.png", "/safari-pinned-tab.svg", "/logo-mark.svg", "/apple-touch-icon.png"]) {
      const res = await request.get(path);
      expect(res.status(), path).toBe(200);
    }
    const manifest = (await (await request.get("/manifest.webmanifest")).json()) as { name: string; theme_color: string; icons: Array<{ sizes: string; purpose?: string }> };
    expect(manifest.name).toContain("TableTalk");
    expect(manifest.theme_color).toBe("#5B1D2B");
    expect(manifest.icons.map((i) => i.sizes)).toEqual(expect.arrayContaining(["192x192", "512x512", "144x144", "96x96"]));
    expect(manifest.icons.some((i) => i.purpose === "maskable")).toBe(true);
  });

  test("branded social card renders for any page and falls back safely", async ({ request }) => {
    const card = await request.get("/og?t=Restaurants%20in%20London&e=Test&s=Subtitle&p=restaurantsHero");
    expect(card.status()).toBe(200);
    expect(card.headers()["content-type"]).toContain("image/jpeg");
    expect(card.headers()["cache-control"]).toContain("max-age");
    const bytes = (await card.body()).length;
    expect(bytes).toBeGreaterThan(10_000);
    expect(bytes, "social card must stay small enough for messaging previews").toBeLessThan(300_000);
    const fallback = await request.get("/og?p=does-not-exist");
    expect(fallback.status()).toBe(200);
    expect(fallback.headers()["content-type"]).toContain("image/jpeg");
  });

  test("home page carries organisation, website and FAQ structured data without ratings", async ({ page }) => {
    await page.goto("/");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = blocks.flatMap((b) => {
      const parsed = JSON.parse(b) as { "@type"?: string | string[] } | Array<{ "@type"?: string | string[] }>;
      return (Array.isArray(parsed) ? parsed : [parsed]).flatMap((p) => (Array.isArray(p["@type"]) ? p["@type"] : [p["@type"] ?? ""]));
    });
    expect(types).toEqual(expect.arrayContaining(["Organization", "WebSite", "FAQPage", "WebPage"]));
    expect(blocks.join("\n")).not.toMatch(/aggregateRating|reviewCount/);
  });

  test("restaurant page exposes a Restaurant entity with hours, menu and address but no rating", async ({ page }) => {
    await page.goto("/restaurants/the-ritz-restaurant");
    const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    const entity = blocks.map((b) => JSON.parse(b) as Record<string, unknown>).find((p) => p["@type"] === "Restaurant");
    expect(entity).toBeTruthy();
    expect(entity?.servesCuisine).toBeTruthy();
    expect(entity?.hasMenu).toMatch(/^https?:\/\//);
    expect(Array.isArray(entity?.openingHoursSpecification)).toBe(true);
    expect(entity?.aggregateRating).toBeUndefined();
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /Ritz/);
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(ogImage, "branded social card carrying the listing photo").toMatch(/\/og\?.*p=diningClassic/);
  });

  test("every page has unique title and description", async ({ request }) => {
    const titles = new Set<string>();
    const descriptions = new Set<string>();
    for (const route of staticRoutes) {
      const html = await (await request.get(route)).text();
      const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "";
      const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1] ?? "";
      expect(title, `title on ${route}`).not.toBe("");
      expect(description, `description on ${route}`).not.toBe("");
      expect(titles.has(title), `duplicate title: ${title}`).toBe(false);
      expect(descriptions.has(description), `duplicate description on ${route}`).toBe(false);
      titles.add(title);
      descriptions.add(description);
    }
  });
});
