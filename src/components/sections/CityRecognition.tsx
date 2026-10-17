import Link from "next/link";
import { awardEntries } from "@/components/sections/AwardsRegister";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { City, Restaurant } from "@/types";

interface CityRecognitionProps {
  city: City;
  restaurants: Restaurant[];
}

/** Dotted-leader ledger: restaurant and award on the left, body and year on the right, source link under each. */
export function CityRecognition({ city, restaurants }: CityRecognitionProps) {
  const rows = awardEntries(restaurants);
  return (
    <section className="border-t border-line bg-claret-mist py-section-sm md:py-section" aria-label={`Recognition in ${city.name}`}>
      <Container>
        <SectionHeading
          number="04"
          eyebrow="Recognition"
          title={<>Awards held in <em>{city.name}</em>.</>}
          lede="Each entry carries its year and a link to the source we checked. Nothing is listed without both."
          size="md"
        />
        {rows.length ? (
          <ul className="mt-10 max-w-3xl divide-y divide-line border-y border-line">
            {rows.map(({ restaurant, award }) => (
              <li key={`${restaurant.slug}-${award.body}-${award.title}-${award.year}`} className="py-4">
                <div className="leader">
                  <span className="font-semibold text-ink">
                    <Link href={`/restaurants/${restaurant.slug}`} className="text-claret-deep hover:text-claret hover:underline">{restaurant.name}</Link>
                    <span aria-hidden="true"> — </span>
                    <span className="sr-only">, </span>
                    {award.title}
                  </span>
                  <span className="whitespace-nowrap font-display text-lg text-claret-deep">
                    {award.body} {award.year}
                  </span>
                </div>
                <a
                  href={award.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={award.sourceLabel}
                  aria-label={`Source for ${award.title}, ${restaurant.name} ${award.year}: ${award.sourceLabel}`}
                  className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-brass-deep underline underline-offset-2 hover:no-underline"
                >
                  Source <Icon name="open_in_new" className="text-[14px]" />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-10 text-smoke">No awards are on record yet for the restaurants listed in {city.name}.</p>
        )}
      </Container>
    </section>
  );
}
