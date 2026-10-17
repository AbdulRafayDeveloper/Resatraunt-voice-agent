# TableTalk

A restaurant dining guide and table-request service for diners in the United Kingdom and the United States. Every listing shows verified opening hours, menu formats with prices as published, the restaurant's own booking rules, and awards with a year and a link to their source. Visitors can request a table in a minute; the restaurant confirms under its own terms. Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4, and deployed on Vercel.

## Overview

TableTalk exists because the best restaurant websites still hide the things a diner needs before committing: how far ahead tables are released, what the deposit and cancellation terms are, what the tasting menu costs, and whether the awards on the wall are current. The site normalises those facts into one layout and shows the date each was checked.

It serves three audiences:

- Diners planning a special occasion or a business dinner who want to compare a few options with real prices and rules.
- People who want help getting a table and are happy for a human to route the request.
- Restaurants that want an accurate listing and a referral channel.

Core workflow: a visitor browses the listing (search and filters), opens a restaurant page, reads the menus, hours and booking rules, and either books directly through the restaurant's provider link or sends a table request. Every form is validated in the browser and again in a server action, returns a reference number, and can forward the submission to a webhook. A request is never presented as a confirmed booking.

## Features

### Listings
- Thirteen restaurants across London, Edinburgh, New York, Chicago and Philadelphia, each with address, cuisine, chefs, price band, lowest published price, service hours, menu formats and prices, booking provider and rules, dress code, awards with sources, and a verification note with the date checked.
- Explorer with text search, city, cuisine, price band, occasion, open-on-day and serves-lunch filters, four sort orders, card and list views, and filters stored in the URL so results are shareable.
- Six editorial collections (date night, tasting menus, chef's tables, business dinners, wine-led, new openings) and five city pages with local dining notes.
- An awards register listing every Michelin and James Beard recognition on the site with its year and source.

### Table requests
- Request form with restaurant, date (today to 120 days ahead), half-hour time slots, flexibility, party size up to 12, occasion, dietary needs, contact details and an explicit "this is a request, not a booking" consent.
- A live "before you send" panel showing the selected restaurant's provider, hours and booking rules.
- Success state with a reference, a summary, what happens next, and a link to book directly with the restaurant's provider where one is public.
- Listing enquiry, contact and newsletter forms using the same validation and server action.

### Content
- Five guides: booking starred restaurants, tasting menus, deposits and cancellations, dress codes, and chef's table versus counter versus private room.
- Grouped FAQs with FAQPage structured data, an about page that explains the verification method, and four legal documents including a booking and cancellation policy.

### SEO and branding
- Per-page metadata, canonical URLs, Open Graph and Twitter cards rendered on demand at `/og`, JSON-LD (Organization, WebSite with SearchAction, WebPage, CollectionPage, Restaurant with opening hours and menu, BreadcrumbList, FAQPage, Article), an image sitemap, robots rules that block preview deployments, and security headers including a Content Security Policy.
- Original logo mark (a round table drawn as a speech bubble), a full icon set generated from it, and a web app manifest.

### Quality
- Playwright suite across desktop Chromium, mobile Firefox and mobile Chromium covering every route, the home hero, navigation, the explorer, restaurant pages, all four forms, the awards register, structured data and the metadata routes.
- Lint, strict TypeScript and a production build with every route prerendered.

## Tech stack

| Category | Technology |
|---|---|
| Frontend | Next.js 16.2 (App Router, Server Components), React 19.2, TypeScript 5 (strict) |
| Backend | One server action for submissions (`src/actions/requests.ts`), a Node route handler for social cards (`src/app/og/route.tsx`) |
| Database | None; content lives in typed TypeScript modules under `src/data` |
| Styling | Tailwind CSS v4 (`@theme` tokens), Fraunces and Manrope via `next/font`, self-hosted Material Symbols subset |
| Validation | Zod 4 on the client and the server, React Hook Form |
| Images | `next/image` with AVIF/WebP, `sharp` for photo optimisation and social cards |
| Testing | Playwright |
| Deployment | Vercel |

## Project structure

```
src/
  app/                 Routes, metadata routes (sitemap, robots, manifest, icons, OG), loading/error/404
    restaurants/       Listing and [slug] pages
    collections/       Index and [slug]
    cities/            Index and [slug]
    guides/            Index and [slug]
    awards/ request-a-table/ about/ for-restaurants/ contact/ faqs/ and legal pages
  components/
    layout/            Header (drawer), Footer, PageHero, MobileStickyBar, LegalPage
    ui/                Button, Field, SectionHeading, Accordion, Badge, Breadcrumbs, JsonLd, Icon, Container
    graphics/          Logo, LogoMark, Hatch
    cards/             RestaurantCard, GuideCard
    restaurant/        AwardChips, HoursTable, MenuLedger and detail-page helpers
    home/              One file per home-page section
    sections/          Shared sections (CtaBand, FaqSection, collection/city/awards sections)
  features/            Client components with state: forms, explorer, quick finder
  data/                Restaurants, cities, collections, guides, FAQs, company copy, legal text, image registry
  config/              Site identity and contact channels, navigation, icon subset list
  lib/                 SEO builders, social card renderer, Zod schemas, formatting utilities
  actions/             Server action for submissions
  types/               Shared TypeScript types
public/
  images/tabletalk/    Optimised editorial photography (Pexels and Unsplash; sources in manifest.json)
  fonts/               Self-hosted Material Symbols subset
scripts/               fetch-photos, fetch-material-symbols, generate-brand-assets, screenshot (local tooling, git-ignored by the owner's rule)
tests/                 Playwright specs and the route list
docs/                  Research, strategy and site plan
```

## Getting started

### Prerequisites
- Node.js 20 or later
- npm 10 or later
- For end-to-end tests: Playwright browsers (`npx playwright install chromium firefox`)

### Installation

```bash
npm install
cp .env.example .env.local   # then edit values
npm run dev                  # http://localhost:3000
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Recommended in production | Canonical origin for canonical links, sitemap, robots, Open Graph and JSON-LD. Without it, Vercel production uses the project URL, previews use their own URL and local uses `http://localhost:3000`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Before launch | Public contact address. Defaults to a reserved `.example` placeholder that the site labels as such. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional | International number without `+`. WhatsApp links are hidden when empty. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Optional | Footer link and Organization `sameAs`; hidden when empty. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional | Google Search Console verification token. |
| `REQUEST_WEBHOOK_URL` | Optional | HTTPS endpoint that receives validated submissions as JSON (`{ kind, reference, receivedAt, data }`). Leave empty to run without a backend. |

Never put secret values in this file or in the repository.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build; every route is prerendered |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (`next/core-web-vitals` and `next/typescript`) |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test:e2e` | Playwright on all three projects (starts the dev server on port 3100 if nothing is listening) |
| `npm run test:e2e:desktop` / `npm run test:e2e:mobile` | Subsets of the suite |
| `npm run screenshot -- <route> <name> [both\|desktop\|mobile] [tiles\|full\|viewport]` | QA captures into `.screenshots/` (git-ignored) |
| `npm run photos` | Re-download and optimise the photography listed in `scripts/fetch-photos.mjs` |
| `npm run icons` | Regenerate the Material Symbols subset from `src/config/icons.ts` |
| `npm run brand-assets` | Regenerate favicons and app icons from the logo mark |

Run the suite against a deployment with `BASE_URL=https://your-domain npm run test:e2e`.

## Content and configuration

- Restaurants, cities, collections, guides and FAQs are edited in `src/data`. Each restaurant records the date its hours and menus were checked; update `siteConfig.dataCheckedOn` in `src/config/site.ts` after a review pass.
- Awards must carry a year and a source URL; the award chip component refuses to render one without both.
- Contact channels and the reply promise live in `src/config/site.ts` and the environment variables above.
- Photography is illustrative editorial stock, registered with alt text in `src/data/images.ts`; restaurant pages say so. Do not add restaurant-owned photographs without written permission.
- Spelling is British English. Restaurant names and menu wording keep the venue's own spelling.

### Before launch
- Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_CONTACT_EMAIL` in Vercel.
- Replace the legal-entity, governing-law and retention placeholders in `src/data/legal.ts` and `src/config/site.ts`.
- Re-check the listings marked "partial" (Ikoyi, Core by Clare Smyth, Lei, Alinea) against the restaurants' own sites.
- Connect `REQUEST_WEBHOOK_URL` to the inbox or CRM that will answer requests within the promised working day.

## Testing

The Playwright suite (`tests/`) checks, for every route: HTTP 200, exactly one H1, title and description, a canonical link, valid JSON-LD, no console errors, no horizontal overflow and no broken images after scrolling. It also covers the home hero fitting the first viewport, the mobile drawer, the sticky action bar, the explorer filters and URL state, restaurant page prices, rules and sourced awards, all four forms including validation and success states, the awards register, the sitemap, robots, manifest, icons and social cards, uniqueness of titles and descriptions, and that every icon used in the code is in the subset list.

## Deployment

The project deploys to Vercel. `vercel --prod` deploys from a local checkout; pushing to `main` deploys when the Git integration is connected. Set the environment variables above in the project's Production environment. Preview deployments serve a `robots.txt` that disallows crawling and a `noindex` header, so they can never be indexed in place of the production site.
