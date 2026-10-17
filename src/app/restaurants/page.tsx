import { Suspense } from "react";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { cities } from "@/data/cities";
import { homeFaqs } from "@/data/faqs";
import { getImage } from "@/data/images";
import { restaurants } from "@/data/restaurants";
import { RestaurantExplorer } from "@/features/restaurants/RestaurantExplorer";
import { buildBreadcrumbSchema, buildFaqSchema, buildMetadata, buildRestaurantListSchema, buildWebPageSchema } from "@/lib/seo";
import { formatDate, priceBandLabels, priceBandSymbol } from "@/lib/utils";
import type { PriceBand } from "@/types";

const title = "Restaurants in London, Edinburgh, New York, Chicago and Philadelphia";
const description = `${restaurants.length} restaurants with verified hours, menu formats, prices as published, booking rules and awards with their source. Filter by city, cuisine, price band, occasion and the day you want to eat.`;

export const metadata = buildMetadata({
  title,
  description,
  path: "/restaurants",
  photo: "restaurantsHero",
  eyebrow: "Every listed restaurant",
});

const bands: PriceBand[] = [1, 2, 3, 4];

const readingGuide = [
  {
    term: "Price band",
    detail: "A rough per-person spend before drinks, in the restaurant's own currency, so London listings use £ and US listings use $.",
    rows: bands.map((band) => ({ label: `${priceBandSymbol(band, "GBP")} or ${priceBandSymbol(band, "USD")}`, value: priceBandLabels[band] })),
  },
  {
    term: "From price",
    detail: "The lowest per-person price the restaurant publishes, usually a set lunch or a fixed-price carte. Where the restaurant prices dishes individually we say 'Priced on the menu' instead of guessing.",
  },
  {
    term: "Booking provider",
    detail: "The system the restaurant takes reservations through (Tock, Resy, SevenRooms, OpenTable, its own site or the phone). Every listing links to it, and a table request through TableTalk never replaces it.",
  },
  {
    term: "Verification",
    detail: `Each fact is checked against the restaurant's own website on the date shown on the listing (currently ${formatDate(siteConfig.dataCheckedOn)}). Listings marked 'partially verified' explain what could not be confirmed.`,
  },
];

export default function RestaurantsPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "Restaurants", path: "/restaurants" }])} />
      <JsonLd data={buildWebPageSchema({ name: title, description, path: "/restaurants", type: "CollectionPage" })} />
      <JsonLd data={buildRestaurantListSchema("Restaurants listed on TableTalk", restaurants)} />
      <JsonLd data={buildFaqSchema(homeFaqs)} />

      <PageHero
        variant="linen"
        crumbs={[{ name: "Home", path: "/" }, { name: "Restaurants", path: "/restaurants" }]}
        eyebrow={`${restaurants.length} restaurants · ${cities.length} cities`}
        title={<>Every table, <em>verified</em>.</>}
        lede="Each listing shows opening hours, menu formats and prices as the restaurant publishes them, its booking provider and rules, and any Michelin or James Beard recognition with the year and a link to the source. No ratings, no reviews, nothing we could not check."
      />

      <section className="py-section-sm md:py-section" aria-label="Browse restaurants">
        <Container>
          <Suspense fallback={<p className="font-display text-xl text-claret-deep">Loading restaurants…</p>}>
            <RestaurantExplorer restaurants={restaurants} cities={cities} />
          </Suspense>
        </Container>
      </section>

      <section className="border-t border-line bg-linen py-section-sm md:py-section" aria-label="How to read a listing">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading
            number="02"
            eyebrow="Reading a listing"
            title={<>What the <em>numbers</em> mean.</>}
            lede="Four things on every card, and where each one comes from."
            size="md"
            className="lg:sticky lg:top-32 lg:self-start"
          />
          <dl className="divide-y divide-line border-y border-line">
            {readingGuide.map((entry, index) => (
              <div key={entry.term} className="grid gap-3 py-6 sm:grid-cols-[3rem_1fr]">
                <span className="font-display text-2xl italic leading-none text-brass-deep">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <dt className="font-display text-2xl text-claret-deep">{entry.term}</dt>
                  <dd className="mt-2 leading-relaxed text-ink/85">
                    {entry.detail}
                    {entry.rows && (
                      <ul className="mt-4 space-y-2 text-sm">
                        {entry.rows.map((row) => (
                          <li key={row.label} className="leader">
                            <span className="font-semibold text-ink">{row.label}</span>
                            <span className="text-smoke">{row.value}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <FaqSection items={homeFaqs} number="03" />

      <CtaBand image={getImage("tableLinen")} />
    </>
  );
}
