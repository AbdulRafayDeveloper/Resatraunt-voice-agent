import { expect, test } from "@playwright/test";
import { isIgnorableConsoleError, staticRoutes } from "./routes";

for (const route of staticRoutes) {
  test(`page ${route} renders cleanly`, async ({ page }, testInfo) => {
    const errors: string[] = [];
    page.on("console", (m) => {
      if (m.type() === "error" && !isIgnorableConsoleError(m.text())) errors.push(m.text());
    });
    page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

    const response = await page.goto(route, { waitUntil: "networkidle" });
    expect(response?.status(), "HTTP status").toBe(200);

    // Exactly one H1, a non-empty title and a canonical link.
    await expect(page.locator("h1")).toHaveCount(1);
    expect((await page.title()).length).toBeGreaterThan(10);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /.{40,}/);

    // Every JSON-LD block must parse.
    const ldBlocks = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(ldBlocks.length).toBeGreaterThan(0);
    for (const block of ldBlocks) expect(() => JSON.parse(block)).not.toThrow();

    // No horizontal scrolling on any viewport.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "horizontal overflow in px").toBeLessThanOrEqual(1);

    // Header, main landmark, footer and skip link exist.
    await expect(page.locator("body > header")).toBeVisible();
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(page.locator("body > footer")).toBeVisible();

    // Scroll through the page so lazy images load, then check none are broken.
    await page.evaluate(async () => {
      const step = window.innerHeight;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 60));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForLoadState("networkidle");
    const broken = await page.evaluate(() =>
      Array.from(document.images)
        .filter((img) => img.complete && img.naturalWidth === 0 && !img.src.startsWith("data:"))
        .map((img) => img.getAttribute("alt") ?? img.src),
    );
    expect(broken, "broken images").toEqual([]);

    expect(errors, `console errors on ${testInfo.project.name}`).toEqual([]);
  });
}

test("unknown routes return the branded 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(/moved on/i);
  await expect(page.getByRole("link", { name: /back to home/i })).toBeVisible();
});

test("internal links on the home page all resolve", async ({ page, request }) => {
  await page.goto("/");
  const hrefs = await page.locator('a[href^="/"]').evaluateAll((els) => Array.from(new Set(els.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? ""))));
  const paths = hrefs.filter((h) => h && !h.startsWith("/#") && !h.includes("?")).map((h) => h.split("#")[0]);
  expect(paths.length).toBeGreaterThan(15);
  for (const path of paths) {
    const res = await request.get(path);
    expect(res.status(), `link ${path}`).toBe(200);
  }
});
