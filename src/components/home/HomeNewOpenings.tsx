import Link from "next/link";
import { Hatch } from "@/components/graphics/Hatch";
import { AwardChips } from "@/components/restaurant/AwardChips";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getCity } from "@/data/cities";
import { newOpenings } from "@/data/restaurants";
import { formatDate } from "@/lib/utils";

/** Dark band: recent openings already recognised by Michelin or James Beard, as a ruled list. */
export function HomeNewOpenings() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-section-sm text-cream md:py-section" aria-label="New openings">
      <Hatch color="#B8893A" opacity={0.1} size={16} />
      <Container className="relative">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading number="05" eyebrow="New openings" title={<>Opened recently, <em className="text-brass">already recognised</em>.</>} lede="Restaurants under two years old that the Michelin Guide or the James Beard Foundation has already named. We re-check these more often." tone="dark" />
          <LinkButton href="/collections/new-openings" variant="outlineLight" icon="arrow_forward" className="md:mb-2">The full list</LinkButton>
        </div>
        <ul className="mt-10 divide-y divide-cream/15 border-y border-cream/15">
          {newOpenings.map((r) => {
            const city = getCity(r.citySlug);
            return (
              <li key={r.slug} className="grid gap-3 py-6 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-8">
                <div>
                  <p className="eyebrow text-brass">{r.cuisine} · {city.name}{r.openedYear ? ` · opened ${r.openedYear}` : ""}</p>
                  <h3 className="mt-1 font-display text-3xl font-medium">
                    <Link href={`/restaurants/${r.slug}`} className="hover:text-brass-pale">{r.name}</Link>
                  </h3>
                </div>
                <div>
                  <AwardChips awards={r.awards} tone="dark" />
                  <p className="mt-2 text-xs text-cream/60">Checked {formatDate(r.verification.checkedOn)}</p>
                </div>
                <LinkButton href={`/restaurants/${r.slug}`} variant="white" size="sm" icon="arrow_forward">View</LinkButton>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
