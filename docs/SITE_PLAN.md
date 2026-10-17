# TableTalk — Research, Strategy and Site Plan

Working document for the build of TableTalk, a restaurant dining guide and table-request service for diners in the United Kingdom and the United States. Written 17 October 2026 after inspecting the seven reference websites and verifying thirteen restaurants against their own sites and the awarding bodies.

## 1. Reference research

Method: every reference was fetched directly (raw HTML, PDFs and, where a site blocked automated access, an archived copy or a text proxy). No screenshots were taken, so palette and typography notes come from CSS, not rendered pages. Anything that could not be loaded is marked.

| Reference | What we observed | Borrow | Avoid |
|---|---|---|---|
| **St. JOHN** (stjohnrestaurant.com, Shopify) | Homepage is a logo, one photo and the nav; nothing else. Per-venue HTML menus dated to the day with inline prices, published at 11 am / 5 pm. OpenTable modal with venue picker, 1–20 covers. Corkage, cakeage and 12.5% service published on the venue page. Black-on-white, serif, zero decoration. | Date-stamped menus with prices; house policies as structured fields; named human for groups of 8+; the story page as the trust device instead of badges. | A homepage that tells a first-time visitor nothing; menus blank before service; no cancellation or deposit terms on site; 2021 copyright. |
| **Gymkhana** (gymkhanarestaurants.com; gymkhanalondon.com is a legacy shell) | Group site behind a bot wall. London page: Club Menus → The Rooms → 42 Lounge → Private Dining → Gifts → Contact and hours. Menus are undated PDFs with no prices on the page. SevenRooms multi-venue booking; tables open 2 months ahead (3 for the vaults); sister venues suggested when full. Awards only as captions in a timeline, no years. | The explicit booking window; the sister-venue fallback; space-level rules (what is bookable online, what needs an enquiry); dish-captioned imagery. | Split across two domains; PDF-only menus without prices or years; policies hidden inside the booking widget; a "360 viewing" heading with no content. |
| **Bonheur by Matt Abé** (bonheurbymattabe.com, WordPress + Tailwind) | Video hero → definition of *bonheur* and the two-star line → menus page with pill tabs (Dream £225, Journey £195, à la carte £165 with £20 supplements, full wine list with prices) → OpenTable widget themed to the brand. Policies on the Info page: £165 fee inside 72 hours, smart casual, no babies. Chef's table £1,350 for the table, up to six, by enquiry. Dark-brown / tan / cream palette, one custom sans. | Tasting menus beside the carte with the price as the last line; policies as plain, structured cards; third-party widget themed to feel native; chef's table as a whole-table product. | No map; cancellation fee ambiguous (per person or per booking); no party-size guidance; undated menus; video hero cost. |
| **The Ritz Restaurant** (theritzlondon.com/dine-with-us/the-ritz-restaurant) | Restaurant is one long page inside the hotel site: 2-star eyebrow, room, chef, awards (NRA Restaurant of the Year 2025), hours, dress code (jacket and tie), then tabs per service each with its own BOOK NOW (SevenRooms, with pre-set times). Headline prices on the page (from £150; tasting £215/£235; £58 entertainment charge Fri/Sat); full menus as PDFs without dates. Navy, off-white, rose-gold; small-caps headings with an italic word. | Per-service CTA with a pre-set time; dress code as a first-class field; tiered pairing pricing; the italic-emphasis headline device; the second star confirmed by the hotel's own press release. | Prices buried in PDFs; no deposit or cancellation information near the CTA; hotel booking engine dominates the nav; email obfuscated. |
| **Kalaya** (kalayaphilly.com, Squarespace) | Full-bleed hero with a tagline sentence, chef feature, menu feature, "Reserve a Table" twice. Menus are three PDFs (dinner PDF has prices and the $85 Taste of Kalaya set menu; 3% kitchen service charge). Resy link hard-coded with a stale date. Booking rules live only in the About-page FAQ (online up to 12; tasting menu mandatory for 5+ at dinner and all Fri/Sat dinner; a few walk-in bar seats). Warm cream and gold, watercolour illustrations. | Booking rules surfaced beside the book button as data; the whole-table set menu as a bookable option; service-charge and dietary notes as structured fields; credentials as exact phrases, not badge images. | PDF menus; stale prefilled booking date; policies buried in a FAQ; empty cart icon; duplicated, misspelled legal URLs; no map. |
| **Feld** (feldrestaurant.com, Framer) | Homepage is a single full-viewport photo plus a Michelin badge image. Six nav items, no menu page (nightly tasting, unpublished). Beverages page: pairings pre-purchased with the Tock reservation, no corkage, wine list PDF. FAQ answers rendered only client-side. No phone line. Near-monochrome white, black and deep teal. | Model prepaid Tock tickets, party limits and release drops as booking metadata shown before hand-off; segmented contact routes; pairing add-ons as pre-purchase options; a standard policy checklist (dress, children, late arrival, photography, corkage). | A homepage with zero information; FAQ invisible to crawlers; inconsistent hours; "Updates" that is a mailto, not a newsletter. |
| **Lei** (leiwine.nyc, Squarespace) | Photo-only hero. About page carries the whole booking policy in three sentences: limited reservations 14 days ahead at 9 am ET, walk-ins welcome nightly, groups of five or more by form, private dining for eight or more. Menu page is a 56-page wine-list PDF by region; no food menu. No awards mentioned on site despite the 2026 James Beard Best New Restaurant and the 2025 Michelin Sommelier Award. Playfair / Newsreader, green logo, near-empty pages. | The one-sentence booking-policy pattern (release window + walk-ins + group threshold); the group-size router; "getting there" instructions as a field; gift cards without a cart. | No food menu or prices; the wine list as a 3 MB PDF; walk-in policy only on About; a hard-coded date in the booking link; hours that may be stale. |

### Competitor research matrix

| Dimension | St. JOHN | Gymkhana | Bonheur | The Ritz | Kalaya | Feld | Lei |
|---|---|---|---|---|---|---|---|
| Positioning | Heritage, nose-to-tail | Two-star Indian club | Two-star debut, tasting | Grand classical, two stars | James Beard Thai | Tiny produce-led tasting | 28-seat wine bar |
| Navigation | Mega-menu by venue type | Group nav, two domains | 5 items + Reserve | Hotel nav, restaurant nested | 5 items | 6 items | 6 items |
| Palette | Black / white | Jade, timber, chilli (copy) | Dark brown, tan, cream | Navy, off-white, rose gold | Cream, gold, red | White, black, teal | Green, white |
| Type | Georgia / Times | n/a (blocked) | Custom sans "1955" | Austin News Deck / Effra | Lato, Inter Tight, Gotu | Poppins | Playfair, Newsreader |
| Menu format | HTML, daily, priced | PDF, undated, unpriced | HTML tabs, priced | Headline prices + PDFs | PDFs, priced | None published | Wine PDF only |
| Booking | OpenTable modal | SevenRooms | OpenTable widget | SevenRooms per service | Resy | Tock prepaid | Resy + walk-ins |
| Policies near CTA | Corkage/cakeage on venue page | Inside widget | Info page | T&Cs only | About FAQ | FAQ (hidden) | About page |
| Trust signals | Story timeline, one award line | Timeline captions, no years | Two-star line, team bios | Awards, Royal Warrant, chef | Chef credentials in prose | Michelin badge image | None |
| Mobile | Fine (Shopify) | Blocked | Fine | Long page, tabs | Fine | Fine | Fine |
| Accessibility | Plain HTML, good | Unknown | Good semantics | Tabs, PDFs | PDFs, mis-spelled a11y page | JS-only FAQ | PDF list |
| SEO/content | Thin home | Group pages | Rich menus | Hotel-heavy | Page titles with "Reserve Today" | Thin | Thin |
| Gaps | Home says nothing | Prices, years | Map, party size | Prices in PDFs | Rules buried | Price, hours | Food menu, awards |

### What TableTalk learns

1. **No reference shows booking rules inside the discovery flow.** Release windows, deposits, cancellation fees, party-size caps and walk-in policy are scattered across About pages, FAQs and booking widgets. TableTalk puts them on the listing, next to the request button, as structured data.
2. **Menu formats and prices are inconsistent** (live HTML at St. JOHN, undated PDFs at Gymkhana, nothing at Feld). TableTalk normalises them into a ledger: format, type, published price, the date checked and a link to the source.
3. **Awards are either badges without years or absent entirely** (Lei). TableTalk lists each award with its body, year and a link to the source, and never shows one without both.
4. **The strongest sites are typographic and quiet.** Big serif headlines with one italic word (The Ritz), generous whitespace (St. JOHN, Feld), a dark-to-light rhythm (Bonheur). TableTalk adopts the rhythm, not the brands.
5. **Walk-ins and sister venues are the real pressure valve** when diaries are full. TableTalk records walk-in policy for every listing and lists sister venues in the policy text.

## 2. Market and audience

Evidence comes from the reference sites and the booking providers they use; audience sizes are not claimed.

- **Primary: special-occasion diners** (anniversaries, birthdays, visiting a city). They compare three or four options, want to know the real price before committing, and are anxious about deposits and dress codes. Decision criteria: recognition they trust, price certainty, how hard it is to get in, and whether the room suits the occasion.
- **Secondary: business diners and assistants** booking for others. They need private rooms, quiet tables, dependable kitchens and a written confirmation trail.
- **Tertiary: restaurants** that want accurate listings and a referral channel without another commission platform.
- **Pain points observed:** booking windows that are not explained, prices hidden in PDFs, policies that differ between the site and the booking widget, awards that cannot be checked, and stock photography pretending to be the room.
- **Localisation:** UK prices include VAT with a discretionary 12.5% service charge; US prices exclude sales tax and expect an 18–20% tip; Tock tickets are prepaid and non-refundable; dates are written day-month-year on the site (British English) while US venues keep their own menu wording.
- **Trust requirements:** every factual claim carries a date and a source; the request flow states plainly that it is not a booking.

### Customer journey

1. *Discover*: home or city page → collection or filtered listing.
2. *Compare*: two or three listings side by side: price band, from-price, provider, walk-ins, rules, awards.
3. *Decide*: the restaurant page's booking rules and dress code remove surprises.
4. *Act*: request a table (prefilled with the restaurant) or book direct via the provider link.
5. *After*: reference by email; the restaurant confirms; cancellation routes are explained in the booking policy.

## 3. Brand

- **Name:** TableTalk (supplied by the owner).
- **Tagline:** "Find the table worth talking about."
- **Voice:** warm, direct, specific; British English; no hype ("instant", "guaranteed", "#1"); facts first, with dates.
- **Mark:** a round table seen from above drawn as a speech bubble, with a plate ring and two seats facing each other. Pure SVG; works as a 16 px favicon and a maskable app icon.
- **Palette** (Tailwind v4 `@theme` tokens): `claret #5B1D2B` (primary), `claret-deep #3B0F1A`, `claret-soft #F1E3E6`, `claret-mist #FAF3F4`, `brass #B8893A`, `brass-deep #7C5A1C` (text on light), `brass-pale #F5EAD3`, `cream #FAF6EF` (page), `linen #F1EADF` (bands), `linen-dark #E3D9C8`, `charcoal #17151A` (dark bands), `ink #1E1B21` (text), `smoke #5E5964` (muted), `line #DCD4C8` (rules), `basil #2E6B4E` (positive), `ember #C2410C` (notices). Contrast checked: brass-deep on cream 5.6:1, smoke on cream 6:1, claret on cream 10:1.
- **Type:** Fraunces (display, with the WONK axis on for warmth) and Manrope (body). Headings use one italic brass word. Icons: Material Symbols Outlined, self-hosted subset.
- **Motifs:** dotted menu leaders (`.leader`), round "plate" photo masks, arched "carte" cards, double-ring "stamp" circles, perforated hairlines, a fine linen hatch on dark bands, numbered sections (01–08).
- **Photography:** licensed Pexels/Unsplash editorial images, attention-cropped; every restaurant page states the photograph is illustrative.

## 4. Sitemap

| Route | Purpose | Hero variant | Sections |
|---|---|---|---|
| `/` | Brand and conversion | Full-viewport photo + quick finder | Facts strip · Featured (lead split + three cartes) · How it works (route line) · Collections (ledger + sticky carte) · New openings (dark band list) · Cities (ledger) · How we verify (timeline + photo) · Guides (ruled list) · FAQ · Request band |
| `/restaurants` | Search and filter | Linen | Explorer (search, city, cuisine, price band, occasion, open on, lunch, sort, cards/list) · How to read a listing · FAQ · band |
| `/restaurants/[slug]` ×13 | Listing | Photo | About ledger · Menus ledger with date and source · Hours with date and source · Booking rules · Awards with sources · Getting there · Verification · sticky request aside · Also in city · band |
| `/collections` and `/collections/[slug]` ×6 | Curated lists | Band / Photo | Editorial rows; editor note; numbered restaurant rows; cross-links |
| `/cities` and `/cities/[slug]` ×5 | City guides | Linen / Split | Ledger table; dining notes; restaurants; awards in the city; collections; guides |
| `/awards` | Awards register | Photo | Definitions · register tables by body with sources · how we verify · disclaimer band |
| `/guides` and `/guides/[slug]` ×5 | Editorial | Linen / Band | Feature + ruled list; article with contents nav; keep reading |
| `/request-a-table` | Primary conversion | Split | Form + live "before you send" panel · how it works · FAQ |
| `/about` | Trust | Split | What it is · by the numbers · verification timeline · what we never do · who runs it (honest placeholder) |
| `/for-restaurants` | Secondary conversion | Photo | What a listing includes · what we ask for · commercial terms (not finalised) · listing form · FAQ |
| `/contact`, `/faqs` | Support | Band | Channels ledger + form; grouped accordions |
| `/privacy-policy`, `/terms`, `/cookie-policy`, `/booking-policy` | Legal | Linen document | Prose with contents nav |
| `loading`, `error`, `not-found`, `global-error` | System | | |
| `sitemap.xml`, `robots.txt`, `manifest.webmanifest`, `icon`, `apple-icon`, `opengraph-image`, `twitter-image`, `/og` | Metadata | | |

## 5. Page specification summary

Every page: unique title and description via `buildMetadata()`, canonical URL, Open Graph and Twitter cards from the `/og` renderer, breadcrumb JSON-LD, a page-type JSON-LD (WebPage, CollectionPage, AboutPage, ContactPage, Article, FAQPage, Restaurant), one H1, sections labelled with `aria-label`, mobile-first layout with no horizontal overflow at 320–390 px, and a closing request band except on the two form pages.

- **Primary CTA everywhere:** "Request a table" (`/request-a-table`, prefilled with `?restaurant=slug` from listings). **Secondary:** "Book direct on {provider}" (verified external URL), "Browse restaurants", "List your restaurant", newsletter.
- **States:** forms validate client-side (React Hook Form + Zod) and again in the server action; success shows a reference (`TT-`, `TL-`, `TC-`, `TN-`), a summary and what happens next; server errors render inline; per-IP rate limiting and a honeypot field protect against spam.
- **Honesty:** a request is never called a booking; every award carries a year and a source link; prices and hours carry the date checked and a source; partial verification is labelled; photographs are declared illustrative; there are no ratings, reviews, counts or testimonials.

## 6. Data model (`src/data/*.ts`, typed in `src/types/index.ts`)

- `Restaurant { slug, name, citySlug, neighbourhood, country, currency, address, cuisine, tagline, description[], chefs[], openedYear?, seats?, priceBand 1–4, priceFrom?, priceFromNote?, hours: ServiceHours[], hoursAsOf, hoursSourceUrl, menu { formats[], asOf, sourceUrl, notes[] }, reservations { provider, bookingUrl?, walkIns, maxPartyOnline?, policy[] }, dressCode?, awards: Award[] (title, body, year, sourceUrl, sourceLabel, verified), occasions[], features[], website, instagram?, phone?, gettingThere?, image, verification { status, checkedOn, notes[] }, featured, newOpening? }`
- `City { slug, name, country, countryName, currency, intro[], image, diningNotes[] }`
- `Collection { slug, title, eyebrow, intro, editorNote[], image, restaurantSlugs[], occasion? }`
- `Guide { slug, title, excerpt, readMinutes, image, category, publishedOn, updatedOn, sections[] }`
- `FaqGroup { id, title, icon, items[{ q, a }] }`

## 7. Restaurants verified for launch (17 October 2026)

| Restaurant | City | Key verified facts | Status |
|---|---|---|---|
| St. JOHN Smithfield | London | Hours, OpenTable, corkage/cakeage/service, Michelin star held since 2009 (own story page) | Verified; 2026 Guide page not loaded directly |
| Gymkhana | London | Hours, SevenRooms, 2-month window, two stars (Michelin listing) | Verified |
| Bonheur by Matt Abé | London | Menus £165/£195/£225, chef's table £1,350, 72-hour fee, dress code, two stars 2026 | Verified |
| The Ritz Restaurant | London | Lunch £105, from £150, tasting £215/£235, jacket and tie, two stars 2025 (own press release), NRA 2025 | Verified |
| Ikoyi | London | £180/£395 menus, first-of-month release, two stars | Partial: times from Michelin listing |
| Core by Clare Smyth | London | £205–£275 menus, £175 fee, chef's table £2,500 deposit, three stars 2026 | Partial: official site read from a June 2026 archive |
| The Kitchin | Edinburgh | £69 lunch to £220 tasting, ResDiary, £45/£90 no-show fees, one star since 2007 | Verified; times from Michelin listing |
| Kalaya | Philadelphia | Hours, Resy, $85 Taste of Kalaya rules, 3% kitchen charge, JBF Outstanding Restaurant 2026 | Verified |
| Feld | Chicago | Hours, Tock, no corkage, Michelin star + Green Star 2025, JBF Best Chef Great Lakes 2026 | Verified |
| Lei | New York | 14-day release, walk-ins, Resy, JBF Best New Restaurant 2026, Michelin Sommelier Award 2025 | Partial: hours conflict between site and listings |
| Atomix | New York | Tock $424/$314, two stars 2025, JBF Outstanding Hospitality 2025 | Verified |
| Le Bernardin | New York | Prix fixe $142/$225, tastings $270–$350, $150 fee, dress code, three stars 2025 | Verified |
| Alinea | Chicago | Tock $450–$594 + 20%, release on the 15th, two stars 2025 (site still says three) | Partial: award discrepancy labelled |
