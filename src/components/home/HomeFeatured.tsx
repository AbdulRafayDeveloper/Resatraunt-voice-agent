import Image from "next/image";
import Link from "next/link";
import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { AwardChips } from "@/components/restaurant/AwardChips";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCity } from "@/data/cities";
import { getImage } from "@/data/images";
import { featuredRestaurants } from "@/data/restaurants";
import { formatMoney, priceBandSymbol, walkInLabels } from "@/lib/utils";

/** One large editorial feature followed by three arched cards; the rest live on /restaurants. */
export function HomeFeatured() {
  const [lead, ...rest] = featuredRestaurants;
  const city = getCity(lead.citySlug);
  const image = getImage(lead.image);
  const cards = rest.slice(0, 3);
  return (
    <section className="bg-cream py-section-sm md:py-section" aria-label="Featured restaurants">
      <Container>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading number="01" eyebrow="Featured this month" title={<>Tables we would <em>book first</em>.</>} lede="Chosen for what they publish, not for a fee: clear prices, clear rules, awards you can check." />
          <LinkButton href="/restaurants" variant="outline" icon="arrow_forward" className="md:mb-2">All restaurants</LinkButton>
        </div>

        {/* Lead feature: split row with a round photo */}
        <article className="mt-10 grid items-center gap-8 border-y border-line py-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14">
          <Link href={`/restaurants/${lead.slug}`} className="plate relative mx-auto aspect-square w-full max-w-sm lg:max-w-none" aria-label={`${lead.name} listing`}>
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 460px, 80vw" className="object-cover" />
          </Link>
          <div>
            <p className="eyebrow text-brass-deep">{lead.cuisine} · {lead.neighbourhood}, {city.name}</p>
            <h3 className="display-title mt-2 text-3xl text-claret-deep md:text-5xl">
              <Link href={`/restaurants/${lead.slug}`} className="hover:text-claret">{lead.name}</Link>
            </h3>
            <p className="lede mt-4 text-smoke">{lead.tagline}</p>
            <AwardChips awards={lead.awards} className="mt-4" />
            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="eyebrow text-smoke">Price</dt>
                <dd className="mt-1 font-display text-xl text-claret-deep">{priceBandSymbol(lead.priceBand, lead.currency)}{lead.priceFrom ? ` · from ${formatMoney(lead.priceFrom, lead.currency)}` : ""}</dd>
              </div>
              <div>
                <dt className="eyebrow text-smoke">Books via</dt>
                <dd className="mt-1 font-display text-xl text-claret-deep">{lead.reservations.provider}</dd>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <dt className="eyebrow text-smoke">Walk-ins</dt>
                <dd className="mt-1 font-display text-xl text-claret-deep">{walkInLabels[lead.reservations.walkIns]}</dd>
              </div>
            </dl>
            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton href={`/restaurants/${lead.slug}`} icon="arrow_forward">View listing</LinkButton>
              <LinkButton href={`/request-a-table?restaurant=${lead.slug}`} variant="ghost" icon="table_restaurant" iconPosition="start">Request a table</LinkButton>
            </div>
            <p className="mt-3 flex items-center gap-1 text-xs text-smoke"><Icon name="visibility" className="text-[14px]" /> Illustrative photograph, not taken at {lead.name}.</p>
          </div>
        </article>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((r, i) => (
            <RestaurantCard key={r.slug} restaurant={r} index={String(i + 2).padStart(2, "0")} />
          ))}
        </div>
      </Container>
    </section>
  );
}
