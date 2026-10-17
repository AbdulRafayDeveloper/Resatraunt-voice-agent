# TableTalk — Test and Launch Report

Date: 17 October 2026. Build: Next.js 16.2.10 production build, 55 routes prerendered.

## Checks run

| Check | Result |
|---|---|
| `npm run typecheck` (tsc, strict) | Clean |
| `npm run lint` (next/core-web-vitals + next/typescript) | Clean, no warnings |
| `npm run build` | 55/55 pages generated; `/request-a-table` and `/og` are server-rendered on demand (query parameters), everything else static |
| Playwright, local production server (`next start`) | 150 passed, 3 skipped (project-specific), 0 failed, 5.3 min |
| Playwright, live production URL, all projects | 146 passed, 4 failed on the third browser project: all four were form submissions rejected by the per-IP rate limit (8 submissions per 10 minutes) after the first two projects had submitted 8 forms |
| Playwright, live, mobile Chromium forms and home rerun after the window | 21 passed, 1 skipped, 0 failed |
| Lighthouse 12 (mobile emulation) on the live home page | Performance 77, Accessibility 97, Best practices 100, SEO 100; LCP 3.9 s, CLS 0, TBT 430 ms |

Playwright projects: desktop Chromium 1440×900, mobile Firefox 390×844 (touch), mobile Chromium (Pixel 7 emulation). These are browser emulations; no physical devices were used.

## Routes covered by the suite

`/`, `/restaurants`, `/restaurants/bonheur-by-matt-abe`, `/restaurants/lei`, `/collections`, `/collections/date-night`, `/cities`, `/cities/london`, `/awards`, `/guides`, `/guides/how-to-book-a-michelin-starred-restaurant`, `/request-a-table`, `/about`, `/for-restaurants`, `/faqs`, `/contact`, `/privacy-policy`, `/terms`, `/cookie-policy`, `/booking-policy`, plus `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`, `/icon`, `/apple-icon`, `/opengraph-image`, `/twitter-image`, `/og`, the brand icon files, an unknown route (404) and an unknown restaurant slug (404). The sitemap test also asserts all 13 restaurant URLs are listed.

## What each spec verifies

- **pages.spec**: every route returns 200, has one H1, a title, a description over 40 characters, a canonical link, parseable JSON-LD, no console or page errors, no horizontal overflow, header/main/footer landmarks, and no broken images after scrolling; unknown routes return the branded 404; every internal link on the home page resolves.
- **home.spec**: the hero (headline and primary button) fits the first viewport on every project; the eleven home sections appear in order; the facts strip is derived from data and never zero; the quick finder hands off to `/restaurants?city=…&occasion=…`; the FAQ accordion toggles with answers kept in the DOM; every award chip carries a year; the mobile drawer opens, scroll-locks, navigates and closes; the sticky action bar shows on phones only; desktop navigation and footer links work; no WhatsApp links render when no number is configured.
- **features.spec**: explorer filters by city, price band and occasion, searches by text, resets, survives a reload through the URL and shows an empty state; the Bonheur listing shows the £165 from-price, the £225 menu, the 72-hour rule, the illustrative-photo notice, sourced award links, a request link and a "Book direct" link; the Lei listing shows its partial-verification notice; an unknown slug is a 404; the table request form validates, prefills from `?restaurant=`, rejects a past date, requires consent and succeeds with a `TT-` reference, a summary and a direct-booking link; the listing, contact and newsletter forms validate and succeed with `TL-`, `TC-` and `TN-` references; every row of the awards register carries a year and a source link.
- **seo.spec**: sitemap lists every route and all 13 restaurants, robots points to it; manifest, icons and social images respond; the `/og` card is a JPEG under 300 KB with a safe fallback; the home page carries Organization, WebSite, FAQPage and WebPage data with no ratings; a restaurant page carries a Restaurant entity with cuisine, menu URL, opening hours and no rating, and its social card uses the listing photo; every page has a unique title and description.
- **icons.spec**: every Material Symbols icon used in `src` is in the self-hosted subset list.

## Live-site checks (https://tabletalk-pearl.vercel.app)

- Home, listing, a restaurant page, the request page with a prefilled restaurant, robots, sitemap, manifest and the social image all return 200; an unknown restaurant returns 404.
- robots.txt allows crawling and points to the sitemap; canonical URLs and the 44 sitemap entries use the production origin.
- Security headers present: Content-Security-Policy (no third-party scripts, frames or fonts), Strict-Transport-Security, X-Content-Type-Options, X-Frame-Options, X-Robots-Tag (index, follow).
- Visual review by screenshot on desktop (1440 px) and mobile Firefox (390 px) for the home, listing, restaurant detail, request, awards and collections pages: no overflow, hero fits the first viewport, sections render with their intended compositions.

## Issues found and fixed during testing

- Required-field asterisks were part of the label text, so exact label matching failed; the asterisk is now drawn with CSS and the accessible name is exactly the label.
- The root `loading.tsx` caused `notFound()` on dynamic routes to stream with a 200; unknown slugs are now hard 404s via `dynamicParams = false` (every real slug is prerendered).
- Footer newsletter "City of interest" collided with the explorer's "City" select in the tests; tests now match exactly.
- Hero award chips (compact) were matched before the sourced chips; tests now scope to the awards section.
- Two Lighthouse accessibility findings on restaurant cards: a low-contrast caption and an image link whose `aria-label` omitted its visible text. Both fixed.
- Feld opened in June 2024, so it was removed from the "new openings" collection, which promises restaurants under two years old.

## Not verified or not possible here

- No physical-device testing; mobile results are emulated (Firefox and Chromium).
- `REQUEST_WEBHOOK_URL` is not configured on the deployment, so submissions return a reference but are not forwarded anywhere yet. Connect the webhook or inbox before announcing the reply promise.
- Lighthouse was run once, on the home page only, from one machine; treat the scores as indicative. The LCP element is the hero photograph.
- Hours for Ikoyi and The Kitchin come from the Michelin Guide listings; Core by Clare Smyth's site was read from an archived copy; Lei's hours conflict between its site and other listings; Alinea's own site still claims three stars against Michelin's two. All four listings are labelled "partially verified" on the site and should be re-checked with the restaurants before launch.
- The contact email, legal entity, governing law and data-retention period are placeholders marked "[to be confirmed]".
