import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { restaurantsInCity } from "@/data/restaurants";
import type { City, PriceBand } from "@/types";
import { priceBandSymbol } from "@/lib/utils";

interface CityLedgerProps {
  cities: City[];
}

interface CityRow {
  city: City;
  restaurantCount: number;
  priceBands: string;
  awardCount: number;
}

/** Facts per city derived from the listed restaurants; nothing is typed in by hand. */
function cityRow(city: City): CityRow {
  const listed = restaurantsInCity(city.slug);
  const bands = listed.map((r) => r.priceBand);
  const min = bands.length ? (Math.min(...bands) as PriceBand) : undefined;
  const max = bands.length ? (Math.max(...bands) as PriceBand) : undefined;
  const priceBands = min === undefined || max === undefined ? "–" : min === max ? priceBandSymbol(min, city.currency) : `${priceBandSymbol(min, city.currency)} to ${priceBandSymbol(max, city.currency)}`;
  return {
    city,
    restaurantCount: listed.length,
    priceBands,
    awardCount: listed.reduce((sum, r) => sum + r.awards.length, 0),
  };
}

const headers = ["City", "Country", "Restaurants", "Price bands", "Awards"] as const;

/** Ledger table of cities on wide screens; the same rows as stacked definition lists on phones. */
export function CityLedger({ cities }: CityLedgerProps) {
  const rows = cities.map(cityRow);
  return (
    <section className="py-section-sm md:py-section" aria-label="Cities covered">
      <Container>
        <SectionHeading
          number="01"
          eyebrow="The ledger"
          title={<>What we cover, <em>city by city</em>.</>}
          lede="Counts are taken from the listings themselves. Price bands use each city's own currency symbol; awards are counted only where a year and a source are on record."
        />

        <table className="mt-12 hidden w-full border-collapse md:table">
          <caption className="sr-only">Cities covered</caption>
          <thead>
            <tr className="border-b-2 border-claret/30 text-start">
              {headers.map((h) => (
                <th key={h} scope="col" className="eyebrow py-3 pe-4 text-start text-brass-deep">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(({ city, restaurantCount, priceBands, awardCount }) => (
              <tr key={city.slug}>
                <th scope="row" className="py-5 pe-4 text-start font-display text-2xl font-medium text-claret-deep">
                  <Link href={`/cities/${city.slug}`} className="hover:text-claret hover:underline">{city.name}</Link>
                </th>
                <td className="py-5 pe-4 text-smoke">{city.countryName}</td>
                <td className="py-5 pe-4 font-semibold tabular-nums text-ink">{restaurantCount}</td>
                <td className="py-5 pe-4 font-semibold text-ink">{priceBands}</td>
                <td className="py-5 font-semibold tabular-nums text-ink">{awardCount}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="mt-10 divide-y divide-line border-y border-line md:hidden" aria-label="Cities covered">
          {rows.map(({ city, restaurantCount, priceBands, awardCount }) => (
            <li key={city.slug} className="py-5">
              <h3 className="font-display text-2xl font-medium text-claret-deep">
                <Link href={`/cities/${city.slug}`} className="hover:text-claret">{city.name}</Link>
              </h3>
              <dl className="mt-3 space-y-1.5 text-sm">
                <div className="leader">
                  <dt className="text-smoke">Country</dt>
                  <dd className="font-semibold text-ink">{city.countryName}</dd>
                </div>
                <div className="leader">
                  <dt className="text-smoke">Restaurants</dt>
                  <dd className="font-semibold tabular-nums text-ink">{restaurantCount}</dd>
                </div>
                <div className="leader">
                  <dt className="text-smoke">Price bands</dt>
                  <dd className="font-semibold text-ink">{priceBands}</dd>
                </div>
                <div className="leader">
                  <dt className="text-smoke">Awards</dt>
                  <dd className="font-semibold tabular-nums text-ink">{awardCount}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
