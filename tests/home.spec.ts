import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("hero is fully visible without scrolling", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const hero = page.locator("section[aria-labelledby='hero-title']");
    await expect(hero).toBeVisible();
    const box = await hero.boundingBox();
    const viewport = page.viewportSize();
    expect(box, "hero bounding box").not.toBeNull();
    expect(viewport).not.toBeNull();
    if (!box || !viewport) return;
    // Hero must start at the top (just under the fixed header) and end inside the first viewport.
    expect(box.y).toBeLessThanOrEqual(120);
    expect(box.y + box.height, `hero bottom (${Math.round(box.y + box.height)}) vs viewport ${viewport.height}`).toBeLessThanOrEqual(viewport.height + 1);
    // Its headline and primary buttons are inside the viewport too.
    await expect(page.getByRole("heading", { level: 1 })).toBeInViewport();
    await expect(page.getByRole("link", { name: /browse restaurants/i }).first()).toBeInViewport();
  });

  test("key sections are present in order", async ({ page }) => {
    await page.goto("/");
    const labels = await page.locator("main section[aria-label], main section[aria-labelledby]").evaluateAll((els) =>
      els.map((el) => el.getAttribute("aria-label") ?? el.getAttribute("aria-labelledby") ?? ""),
    );
    const expected = ["hero-title", "TableTalk at a glance", "Featured restaurants", "How it works", "Collections", "New openings", "Cities", "How we verify", "Guides", "Frequently asked questions", "Request a table"];
    let cursor = -1;
    for (const label of expected) {
      const idx = labels.indexOf(label);
      expect(idx, `section ${label} present`).toBeGreaterThan(cursor);
      cursor = idx;
    }
  });

  test("facts strip is derived from data and never zero", async ({ page }) => {
    await page.goto("/");
    const facts = page.locator("section[aria-label='TableTalk at a glance'] dd");
    await expect(facts).toHaveCount(5);
    for (const text of await facts.allTextContents()) expect(text).not.toMatch(/^0\+?$/);
    await expect(facts.first()).toHaveText("13");
  });

  test("quick finder hands off to the listing with filters", async ({ page }) => {
    await page.goto("/");
    // Two finders exist on the home page (desktop hero and phone card); use the visible one.
    const form = page.getByTestId("quick-finder").locator("visible=true").first();
    await form.getByLabel("City").selectOption("london");
    await form.getByLabel("Occasion").selectOption("date-night");
    await form.getByRole("button", { name: /show restaurants/i }).click();
    await expect(page).toHaveURL(/\/restaurants\?city=london&occasion=date-night/);
    await expect(page.getByLabel("City", { exact: true })).toHaveValue("london");
    await expect(page.getByText(/of 13 restaurants/)).toBeVisible();
  });

  test("FAQ accordion toggles and keeps answers in the DOM", async ({ page }) => {
    await page.goto("/");
    const section = page.locator("section[aria-label='Frequently asked questions']");
    const buttons = section.getByRole("button", { name: /\?$/ });
    await expect(buttons.first()).toHaveAttribute("aria-expanded", "true");
    await buttons.nth(1).scrollIntoViewIfNeeded();
    await buttons.nth(1).click();
    await expect(buttons.nth(1)).toHaveAttribute("aria-expanded", "true");
    await expect(buttons.first()).toHaveAttribute("aria-expanded", "false");
    // Hidden answers still exist for crawlers.
    expect(await section.locator("[role='region'][hidden]").count()).toBeGreaterThan(0);
  });

  test("every award chip on the home page carries a year", async ({ page }) => {
    await page.goto("/");
    const chips = page.locator("ul[aria-label='Awards and recognition'] li");
    expect(await chips.count()).toBeGreaterThan(0);
    for (const text of await chips.allTextContents()) expect(text).toMatch(/· (19|20)\d{2}/);
  });
});

test.describe("navigation", () => {
  test("mobile drawer opens, scroll-locks, navigates and closes", async ({ page, isMobile, browserName }) => {
    const viewport = page.viewportSize();
    test.skip(!!viewport && viewport.width >= 1024, "desktop layout has no drawer");
    await page.goto("/");
    const openButton = page.getByRole("button", { name: "Open menu" });
    await expect(openButton).toBeVisible();
    await openButton.click();
    const drawer = page.getByRole("dialog", { name: "Site navigation" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: /^restaurants/i })).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, "no horizontal overflow with drawer open").toBeLessThanOrEqual(1);

    await drawer.getByRole("link", { name: /^collections/i }).click();
    await expect(page).toHaveURL(/\/collections$/);
    await expect(drawer).toBeHidden();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
    test.info().annotations.push({ type: "browser", description: `${browserName} mobile=${isMobile}` });
  });

  test("sticky action bar shows on phones only", async ({ page }) => {
    await page.goto("/");
    const viewport = page.viewportSize();
    const bar = page.getByRole("navigation", { name: "Quick actions" });
    if (viewport && viewport.width < 1024) {
      await expect(bar).toBeVisible();
      await expect(bar.getByRole("link", { name: /request a table/i })).toHaveAttribute("href", "/request-a-table");
      await expect(bar.getByRole("link", { name: /restaurants/i })).toHaveAttribute("href", "/restaurants");
    } else {
      await expect(bar).toBeHidden();
    }
  });

  test("desktop navigation links and footer links work", async ({ page }) => {
    const viewport = page.viewportSize();
    test.skip(!!viewport && viewport.width < 1024, "desktop only");
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: "Primary" });
    for (const [label, path] of [
      ["Restaurants", "/restaurants"],
      ["Collections", "/collections"],
      ["Cities", "/cities"],
      ["Awards", "/awards"],
      ["Guides", "/guides"],
      ["About", "/about"],
    ] as const) {
      await nav.getByRole("link", { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(nav.getByRole("link", { name: label, exact: true })).toHaveAttribute("aria-current", "page");
    }
    await page.locator("footer").getByRole("link", { name: "Booking & Cancellation Policy" }).click();
    await expect(page).toHaveURL(/\/booking-policy$/);
  });

  test("no WhatsApp links render when no number is configured", async ({ page }) => {
    await page.goto("/");
    expect(await page.locator('a[href*="wa.me"]').count()).toBe(0);
  });
});
