import { expect, test } from "@playwright/test";

test.describe("restaurant explorer", () => {
  test("filters by city, price band and occasion, searches and resets", async ({ page }) => {
    await page.goto("/restaurants");
    const count = page.getByText(/of 13 restaurants/);
    await expect(count).toContainText("13 of 13");

    await page.getByLabel("City", { exact: true }).selectOption("london");
    await expect(count).toContainText("6 of 13");

    await page.getByRole("group", { name: "Price band" }).getByRole("button", { name: "Band 4" }).click();
    await expect(count).toContainText("4 of 13");

    await page.getByRole("button", { name: /clear filters/i }).first().click();
    await expect(count).toContainText("13 of 13");

    await page.getByRole("group", { name: "Occasion" }).getByRole("button", { name: "Walk-ins welcome" }).click();
    await expect(count).toContainText("3 of 13");
    await expect(page).toHaveURL(/occasion=walk-in/);

    await page.getByRole("button", { name: /clear filters/i }).first().click();
    await page.getByLabel("Search restaurants").fill("doyers");
    await expect(count).toContainText("1 of 13");
    await expect(page.getByRole("heading", { name: "Lei" })).toBeVisible();
  });

  test("filters survive a reload through the URL", async ({ page }) => {
    await page.goto("/restaurants?city=new-york&occasion=wine");
    await expect(page.getByText(/of 13 restaurants/)).toContainText("2 of 13");
    await expect(page.getByLabel("City", { exact: true })).toHaveValue("new-york");
  });

  test("empty result state offers a reset", async ({ page }) => {
    await page.goto("/restaurants");
    await page.getByLabel("City", { exact: true }).selectOption("edinburgh");
    await page.getByRole("group", { name: "Price band" }).getByRole("button", { name: "Band 1" }).click();
    await expect(page.getByText(/no restaurant matches/i)).toBeVisible();
    await page.getByRole("button", { name: /clear filters/i }).first().click();
    await expect(page.getByText(/of 13 restaurants/)).toContainText("13 of 13");
  });
});

test.describe("restaurant detail", () => {
  test("shows published prices, hours, rules, sourced awards and both booking routes", async ({ page }) => {
    await page.goto("/restaurants/bonheur-by-matt-abe");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Bonheur by Matt Abé");
    const aside = page.getByRole("complementary", { name: /book bonheur/i });
    await expect(aside).toContainText("£165");
    await expect(aside.getByRole("link", { name: /request a table/i })).toHaveAttribute("href", "/request-a-table?restaurant=bonheur-by-matt-abe");
    await expect(aside.getByRole("link", { name: /book direct/i })).toHaveAttribute("href", /bonheurbymattabe\.com/);
    await expect(page.getByText("£225").first()).toBeVisible();
    await expect(page.getByText(/72 hours/).first()).toBeVisible();
    await expect(page.getByText(/illustrative photograph/i).first()).toBeVisible();
    // Every award shows a year and links to a source.
    const chips = page.locator("section[aria-label='Awards and recognition'] ul[aria-label='Awards and recognition'] li");
    expect(await chips.count()).toBeGreaterThan(0);
    for (const chip of await chips.all()) {
      await expect(chip).toContainText(/2026/);
      await expect(chip.getByRole("link", { name: /source/i })).toHaveAttribute("href", /^https?:\/\//);
    }
  });

  test("partially verified listings say so", async ({ page }) => {
    await page.goto("/restaurants/lei");
    await expect(page.getByText(/to be confirmed|partially verified/i).first()).toBeVisible();
  });

  test("unknown restaurant returns the 404 page", async ({ page }) => {
    const response = await page.goto("/restaurants/not-a-restaurant");
    expect(response?.status()).toBe(404);
  });
});

test.describe("forms", () => {
  test("table request validates, prefills from the URL and succeeds with a reference", async ({ page }) => {
    await page.goto("/request-a-table?restaurant=lei");
    const form = page.getByRole("form", { name: "Table request form" });
    await expect(form.getByLabel("Restaurant", { exact: true })).toHaveValue("lei");
    await form.getByRole("button", { name: /send table request/i }).click();
    await expect(form.getByText(/choose a date/i)).toBeVisible();
    await expect(form.getByText(/please enter your name/i)).toBeVisible();

    const date = new Date();
    date.setDate(date.getDate() + 14);
    const iso = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    await form.getByLabel("Date", { exact: true }).fill(iso);
    await form.getByLabel("Time", { exact: true }).selectOption("19:30");
    await form.getByRole("button", { name: "More Guests" }).click();
    await form.getByLabel("Occasion", { exact: true }).selectOption("anniversary");
    await form.getByLabel("Dietary requirements").fill("One vegetarian guest.");
    await form.getByLabel("Your name", { exact: true }).fill("Test Diner");
    await form.getByLabel("Email", { exact: true }).fill("diner@example.com");
    await form.getByLabel("Phone (optional)").fill("+44 20 7946 0000");
    await form.getByRole("button", { name: /send table request/i }).click();
    await expect(form.getByText(/not a confirmed booking/i).first()).toBeVisible();
    await form.getByLabel(/i understand this is a request/i).check();
    await form.getByRole("button", { name: /send table request/i }).click();

    const status = page.getByRole("status").filter({ hasText: /received|on the list/ });
    await expect(status).toContainText(/request received · TT-/i);
    await expect(status).toContainText("Lei");
    await expect(status).toContainText("3 guests");
    await expect(status).toContainText(/not a confirmed booking/i);
    await expect(status.getByRole("link", { name: /book direct/i })).toHaveAttribute("href", /resy\.com/);
  });

  test("table request rejects a date in the past", async ({ page }) => {
    await page.goto("/request-a-table");
    const form = page.getByRole("form", { name: "Table request form" });
    await form.getByLabel("Restaurant", { exact: true }).selectOption("kalaya");
    await form.getByLabel("Date", { exact: true }).fill("2020-01-01");
    await form.getByRole("button", { name: /send table request/i }).click();
    await expect(form.getByText(/from today onwards/i)).toBeVisible();
  });

  test("listing enquiry succeeds with a reference", async ({ page }) => {
    await page.goto("/for-restaurants");
    const form = page.getByRole("form", { name: "List your restaurant form" });
    await form.getByLabel("Restaurant name", { exact: true }).fill("Test Kitchen");
    await form.getByLabel("City", { exact: true }).fill("Manchester");
    await form.getByLabel("Your name", { exact: true }).fill("Owner Test");
    await form.getByLabel("Email", { exact: true }).fill("owner@example.com");
    await form.getByLabel("Tell us about the restaurant", { exact: true }).fill("A 40-seat neighbourhood restaurant opening in spring with a set menu.");
    await form.getByLabel(/i agree to be contacted/i).check();
    await form.getByRole("button", { name: /send listing enquiry/i }).click();
    await expect(page.getByRole("status").filter({ hasText: /received|on the list/ })).toContainText(/enquiry received · TL-/i);
  });

  test("contact form validates then succeeds", async ({ page }) => {
    await page.goto("/contact");
    const form = page.getByRole("form", { name: "Contact form" });
    await form.getByRole("button", { name: /send message/i }).click();
    await expect(form.getByText(/please enter your name/i)).toBeVisible();
    await form.getByLabel("Your name", { exact: true }).fill("Contact Test");
    await form.getByLabel("Email", { exact: true }).fill("contact@example.com");
    await form.getByLabel("Topic", { exact: true }).selectOption("listing");
    await form.getByLabel("Your message", { exact: true }).fill("The opening hours for one restaurant look out of date, please check.");
    await form.getByRole("button", { name: /send message/i }).click();
    await expect(page.getByRole("status").filter({ hasText: /received|on the list/ })).toContainText(/message received · TC-/i);
  });

  test("newsletter sign-up requires consent and then succeeds", async ({ page }) => {
    await page.goto("/about");
    const form = page.getByRole("form", { name: "Newsletter sign-up" });
    await form.scrollIntoViewIfNeeded();
    await form.getByLabel("Email address").fill("reader@example.com");
    await form.getByRole("button", { name: /subscribe/i }).click();
    await expect(form.getByText(/please agree to receive/i)).toBeVisible();
    await form.getByRole("checkbox").check();
    await form.getByRole("button", { name: /subscribe/i }).click();
    await expect(page.getByRole("status").filter({ hasText: /received|on the list/ })).toContainText(/TN-/);
  });
});

test.describe("awards register", () => {
  test("every award row links to a source and carries a year", async ({ page }) => {
    await page.goto("/awards");
    const rows = page.locator("table tbody tr");
    expect(await rows.count()).toBeGreaterThan(10);
    for (const row of await rows.all()) {
      await expect(row).toContainText(/(19|20)\d{2}/);
      await expect(row.getByRole("link", { name: /source/i })).toHaveAttribute("href", /^https?:\/\//);
    }
  });
});
