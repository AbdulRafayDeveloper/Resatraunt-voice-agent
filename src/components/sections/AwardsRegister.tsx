import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCity } from "@/data/cities";
import type { Award, AwardBody, Restaurant } from "@/types";
import { pluralise } from "@/lib/utils";

export interface AwardEntry {
  restaurant: Restaurant;
  award: Award;
}

const bodyOrder: AwardBody[] = ["Michelin Guide", "James Beard Foundation", "National Restaurant Awards", "Other"];

/** Every award with a year and a source, flattened from the restaurants and sorted newest first, then by name. */
export function awardEntries(restaurants: Restaurant[]): AwardEntry[] {
  return restaurants
    .flatMap((restaurant) => restaurant.awards.filter((a) => a.year && a.sourceUrl).map((award) => ({ restaurant, award })))
    .sort((a, b) => b.award.year - a.award.year || a.restaurant.name.localeCompare(b.restaurant.name));
}

/** Entries grouped by awarding body in a fixed order; bodies with no entries are omitted. */
export function awardEntriesByBody(entries: AwardEntry[]): Array<{ body: AwardBody; entries: AwardEntry[] }> {
  return bodyOrder.map((body) => ({ body, entries: entries.filter((e) => e.award.body === body) })).filter((g) => g.entries.length > 0);
}

interface AwardsRegisterProps {
  restaurants: Restaurant[];
}

const headers = ["Restaurant", "City", "Award", "Year", "Source"] as const;

/** One ledger table per awarding body. Every row has a year and a link to the source we checked. */
export function AwardsRegister({ restaurants }: AwardsRegisterProps) {
  const entries = awardEntries(restaurants);
  const groups = awardEntriesByBody(entries);
  return (
    <section className="border-t border-line bg-linen py-section-sm md:py-section" aria-label="The register">
      <Container>
        <SectionHeading
          number="02"
          eyebrow="The register"
          title={<>{pluralise(entries.length, "award")} across {pluralise(restaurants.length, "restaurant")}, <em>sourced</em>.</>}
          lede="Grouped by awarding body, newest first. The Source column links to the page or announcement we read; the full citation appears when you hover or focus the link."
        />
        <div className="mt-12 space-y-14">
          {groups.map((group) => (
            <div key={group.body}>
              <h3 className="flex items-center gap-3">
                <span className="font-display text-2xl font-medium text-claret-deep md:text-3xl">{group.body}</span>
                <span className="h-px flex-1 bg-brass/50" aria-hidden="true" />
                <span className="eyebrow text-brass-deep">{pluralise(group.entries.length, "entry", "entries")}</span>
              </h3>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <caption className="sr-only">{group.body} awards held by listed restaurants</caption>
                  <thead>
                    <tr className="border-b-2 border-claret/30">
                      {headers.map((h) => (
                        <th key={h} scope="col" className="eyebrow py-3 pe-4 text-start text-brass-deep">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {group.entries.map(({ restaurant, award }) => (
                      <tr key={`${restaurant.slug}-${award.title}-${award.year}`}>
                        <th scope="row" className="py-3.5 pe-4 text-start font-semibold text-claret-deep">
                          <Link href={`/restaurants/${restaurant.slug}`} className="hover:text-claret hover:underline">{restaurant.name}</Link>
                        </th>
                        <td className="py-3.5 pe-4 text-smoke">{getCity(restaurant.citySlug).name}</td>
                        <td className="py-3.5 pe-4 text-ink">{award.title}</td>
                        <td className="py-3.5 pe-4 tabular-nums text-ink">{award.year}</td>
                        <td className="py-3.5">
                          <a
                            href={award.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={award.sourceLabel}
                            aria-label={`Source for ${award.title}, ${restaurant.name} ${award.year}: ${award.sourceLabel}`}
                            className="inline-flex items-center gap-1 whitespace-nowrap font-bold text-brass-deep underline underline-offset-2 hover:no-underline"
                          >
                            Source <Icon name="open_in_new" className="text-[14px]" />
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
