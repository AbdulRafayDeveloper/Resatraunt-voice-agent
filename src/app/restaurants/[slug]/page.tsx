import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { PageHero } from "@/components/layout/PageHero";
import { AwardChips } from "@/components/restaurant/AwardChips";
import { BookingRules } from "@/components/restaurant/BookingRules";
import { FactsLedger } from "@/components/restaurant/FactsLedger";
import { GettingThere } from "@/components/restaurant/GettingThere";
import { HoursTable } from "@/components/restaurant/HoursTable";
import { MenuLedger } from "@/components/restaurant/MenuLedger";
import { RestaurantAside } from "@/components/restaurant/RestaurantAside";
import { VerificationNote } from "@/components/restaurant/VerificationNote";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCity } from "@/data/cities";
import { collections } from "@/data/collections";
import { getImage, isSiteImageKey } from "@/data/images";
import { findRestaurant, restaurants, restaurantsInCity } from "@/data/restaurants";
import { buildBreadcrumbSchema, buildMetadata, buildRestaurantSchema } from "@/lib/seo";
import { formatDate, priceBandLabels, priceBandSymbol } from "@/lib/utils";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Every slug is prerendered; anything else is a 404 rather than a streamed not-found shell. */
export const dynamicParams = false;

export function generateStaticParams() {
  return restaurants.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = findRestaurant(slug);
  if (!restaurant) return {};
  const city = getCity(restaurant.citySlug);
  return buildMetadata({
    title: `${restaurant.name}, ${restaurant.neighbourhood}, ${city.name}: hours, menus, booking rules`,
    description: restaurant.tagline,
    path: `/restaurants/${restaurant.slug}`,
    photo: isSiteImageKey(restaurant.image) ? restaurant.image : undefined,
    eyebrow: `${restaurant.cuisine} · ${city.name}`,
  });
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-semibold text-claret underline underline-offset-2 hover:no-underline">
      {children}
      <Icon name="open_in_new" className="text-[16px]" />
    </a>
  );
}

const mentionsHours = (note: string) => /hour|service time|times shown|seating/i.test(note);

export default async function RestaurantPage({ params }: PageProps) {
  const { slug } = await params;
  const restaurant = findRestaurant(slug);
  if (!restaurant) notFound();

  const city = getCity(restaurant.citySlug);
  const image = getImage(restaurant.image);
  const path = `/restaurants/${restaurant.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Restaurants", path: "/restaurants" },
    { name: city.name, path: `/cities/${city.slug}` },
    { name: restaurant.name, path },
  ];
  const alsoInCity = restaurantsInCity(city.slug).filter((r) => r.slug !== restaurant.slug).slice(0, 3);
  const featuredIn = collections.filter((c) => c.restaurantSlugs.includes(restaurant.slug));
  const hoursNotes = (restaurant.verification.notes ?? []).filter(mentionsHours);

  const facts = [
    { label: "Cuisine", value: restaurant.cuisine },
    { label: "Neighbourhood", value: `${restaurant.neighbourhood}, ${city.name}` },
    { label: restaurant.chefs.length > 1 ? "Chefs" : "Chef", value: restaurant.chefs.length ? restaurant.chefs.join(", ") : undefined },
    { label: "Opened", value: restaurant.openedYear },
    { label: "Seats", value: restaurant.seats },
    { label: "Price band", value: `${priceBandSymbol(restaurant.priceBand, restaurant.currency)} · ${priceBandLabels[restaurant.priceBand]}` },
    { label: "Dress code", value: restaurant.dressCode },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildRestaurantSchema(restaurant, city.name)} />

      <PageHero
        variant="photo"
        image={image}
        crumbs={crumbs}
        eyebrow={`${restaurant.cuisine} · ${restaurant.neighbourhood}, ${city.name}`}
        title={restaurant.name}
        lede={restaurant.tagline}
      >
        <AwardChips awards={restaurant.awards} tone="dark" />
        <p className="mt-4 text-xs text-cream/65">Illustrative photograph, not taken at {restaurant.name}.</p>
      </PageHero>

      {restaurant.verification.status === "partial" && (
        <div className="border-b border-ember/30 bg-ember/10" role="note" aria-label="Verification notice">
          <Container className="flex items-start gap-3 py-3 text-sm text-ember">
            <Icon name="warning" filled className="mt-0.5 text-[20px]" />
            <p>
              <span className="font-bold">Partially verified.</span> {restaurant.verification.notes?.join(" ")}{" "}
              <a href="#verification" className="font-semibold underline underline-offset-2">Details</a>
            </p>
          </Container>
        </div>
      )}

      <Container className="grid gap-12 py-section-sm md:py-section lg:grid-cols-[1fr_360px] lg:gap-16">
        <div className="min-w-0 space-y-16 md:space-y-20">
          <section aria-label="About">
            <SectionHeading number="01" eyebrow="About" title={<>The <em>room</em> and the kitchen.</>} size="md" />
            <div className="mt-8 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
              <div className="space-y-4 leading-relaxed text-ink/90">
                {restaurant.description.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <FactsLedger rows={facts} />
            </div>
            {restaurant.features.length > 0 && (
              <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-smoke" aria-label="Features">
                {restaurant.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-1.5">
                    <Icon name="check" className="text-[16px] text-basil" />
                    {feature}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label="Menus">
            <SectionHeading number="02" eyebrow="Menus" title={<>What is <em>served</em>, and for how much.</>} size="md" />
            <MenuLedger formats={restaurant.menu.formats} currency={restaurant.currency} className="mt-8 border-y border-line" />
            <p className="mt-4 text-sm text-smoke">
              Prices as published on {formatDate(restaurant.menu.asOf)} · Source: <ExternalLink href={restaurant.menu.sourceUrl}>{restaurant.name} menus</ExternalLink>
            </p>
            {restaurant.menu.notes && restaurant.menu.notes.length > 0 && (
              <ul className="mt-4 divide-y divide-line border-y border-line text-sm text-ink/85">
                {restaurant.menu.notes.map((note) => (
                  <li key={note} className="flex gap-3 py-2.5">
                    <Icon name="restaurant_menu" className="mt-0.5 text-[18px] text-brass-deep" />
                    {note}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label="Opening hours">
            <SectionHeading number="03" eyebrow="Hours" title={<>When the <em>doors</em> open.</>} size="md" />
            <div className="mt-8 rounded-2xl bg-linen p-6">
              <HoursTable hours={restaurant.hours} />
            </div>
            <p className="mt-4 text-sm text-smoke">
              As of {formatDate(restaurant.hoursAsOf)} · Source: <ExternalLink href={restaurant.hoursSourceUrl}>{restaurant.name}</ExternalLink>
            </p>
            {hoursNotes.length > 0 && (
              <ul className="mt-3 space-y-1 text-sm text-ember">
                {hoursNotes.map((note) => (
                  <li key={note} className="flex gap-2">
                    <Icon name="warning" className="mt-0.5 text-[18px]" />
                    {note}
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section aria-label="Booking rules">
            <SectionHeading number="04" eyebrow="Booking rules" title={<>How the restaurant <em>takes</em> bookings.</>} size="md" />
            <div className="mt-8">
              <BookingRules reservations={restaurant.reservations} dressCode={restaurant.dressCode} />
            </div>
          </section>

          <section aria-label="Awards and recognition">
            <SectionHeading number="05" eyebrow="Awards" title={<>Recognition, with <em>sources</em>.</>} size="md" />
            <div className="mt-8">
              {restaurant.awards.length > 0 ? <AwardChips awards={restaurant.awards} mode="full" /> : <p className="text-smoke">No awards are listed for this restaurant.</p>}
            </div>
            <p className="mt-4 text-sm text-smoke">Each award links to its source. TableTalk is not affiliated with the Michelin Guide or the James Beard Foundation.</p>
          </section>

          <section aria-label="Getting there">
            <SectionHeading number="06" eyebrow="Getting there" title={<>Finding the <em>door</em>.</>} size="md" />
            <div className="mt-8">
              <GettingThere restaurant={restaurant} />
            </div>
          </section>

          <section aria-label="Verification" id="verification">
            <SectionHeading number="07" eyebrow="Verification" title={<>How this listing was <em>checked</em>.</>} size="md" />
            <div className="mt-8">
              <VerificationNote verification={restaurant.verification} name={restaurant.name} />
            </div>
          </section>
        </div>

        <RestaurantAside restaurant={restaurant} />
      </Container>

      {alsoInCity.length > 0 && (
        <section className="border-t border-line bg-linen py-section-sm md:py-section" aria-label={`Also in ${city.name}`}>
          <Container className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeading eyebrow={city.name} title={<>Also in <em>{city.name}</em>.</>} size="md" />
              <Link href={`/cities/${city.slug}`} className="mt-5 inline-flex items-center gap-1 font-bold text-claret underline-offset-2 hover:underline">
                All restaurants in {city.name} <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </div>
            <div className="border-t border-line">
              {alsoInCity.map((r) => (
                <RestaurantCard key={r.slug} restaurant={r} layout="row" />
              ))}
            </div>
          </Container>
        </section>
      )}

      {featuredIn.length > 0 && (
        <section className="py-section-sm md:py-section" aria-label={`Collections featuring ${restaurant.name}`}>
          <Container>
            <SectionHeading eyebrow="Collections" title={<>Collections featuring <em>{restaurant.name}</em>.</>} size="md" />
            <ul className="mt-8 divide-y divide-line border-y border-line">
              {featuredIn.map((collection) => (
                <li key={collection.slug}>
                  <Link href={`/collections/${collection.slug}`} className="group flex min-h-14 flex-wrap items-baseline gap-x-4 gap-y-1 py-4">
                    <span className="eyebrow text-brass-deep">{collection.eyebrow}</span>
                    <span className="font-display text-2xl text-claret-deep group-hover:text-claret">{collection.title}</span>
                    <span className="basis-full text-sm text-smoke sm:basis-auto sm:flex-1">{collection.intro}</span>
                    <Icon name="arrow_forward" className="text-[20px] text-claret" />
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <CtaBand
        title={<>Ask for a table at <em className="text-brass">{restaurant.name}</em>.</>}
        primaryHref={`/request-a-table?restaurant=${restaurant.slug}`}
        image={getImage("menuHands")}
      />
    </>
  );
}
