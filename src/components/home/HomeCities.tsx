import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cities } from "@/data/cities";
import { restaurantsInCity } from "@/data/restaurants";
import { currencySymbol, pluralise } from "@/lib/utils";

/** Cities as a ledger: name, country, count, price range, awards. */
export function HomeCities() {
  const rows = cities.map((city) => {
    const list = restaurantsInCity(city.slug);
    const bands = list.map((r) => r.priceBand);
    const min = bands.length ? Math.min(...bands) : 0;
    const max = bands.length ? Math.max(...bands) : 0;
    const awards = list.reduce((n, r) => n + r.awards.length, 0);
    const symbol = currencySymbol[city.currency];
    return { city, count: list.length, range: bands.length ? (min === max ? symbol.repeat(min) : `${symbol.repeat(min)} to ${symbol.repeat(max)}`) : "—", awards };
  });
  return (
    <section className="bg-linen py-section-sm md:py-section" aria-label="Cities">
      <Container>
        <SectionHeading number="05" eyebrow="Cities" title={<>Where we have <em>checked the tables</em>.</>} lede="Each city page carries local dining notes: service charges, tax, release windows and how walk-ins work." />
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {rows.map(({ city, count, range, awards }) => (
            <li key={city.slug}>
              <Link href={`/cities/${city.slug}`} className="group grid grid-cols-[1fr_auto] items-center gap-4 py-5 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto] sm:gap-6">
                <span>
                  <span className="block font-display text-2xl font-medium text-claret-deep group-hover:text-claret md:text-3xl">{city.name}</span>
                  <span className="text-xs font-semibold uppercase tracking-wider text-smoke">{city.countryName}</span>
                </span>
                <span className="hidden text-sm text-ink sm:block">{pluralise(count, "restaurant")}</span>
                <span className="hidden font-display text-lg text-claret-deep sm:block">{range}</span>
                <span className="hidden text-sm text-ink sm:block">{pluralise(awards, "award")}</span>
                <span className="flex items-center gap-2 text-sm font-bold text-claret">
                  <span className="sm:hidden">{count}</span>
                  <Icon name="arrow_forward" className="text-[22px] transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
