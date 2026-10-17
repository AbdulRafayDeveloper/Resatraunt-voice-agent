import Link from "next/link";
import { Hatch } from "@/components/graphics/Hatch";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { occasionLabels } from "@/data/restaurants";
import type { Occasion } from "@/types";

/** Dark band of occasion chips that deep-link into the restaurant finder. */
export function CollectionOccasionBand() {
  const occasions = Object.entries(occasionLabels) as Array<[Occasion, string]>;
  return (
    <section className="relative overflow-hidden bg-charcoal py-section-sm text-cream md:py-section" aria-label="Pick by occasion">
      <Hatch />
      <Container className="relative grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          number="02"
          eyebrow="Pick by occasion"
          title={<>Or start with the <em>evening</em>.</>}
          lede="Every restaurant is tagged with the occasions it suits, from a solo seat at the counter to a working dinner for eight. Pick one and the finder filters the whole list."
          tone="dark"
          size="md"
        />
        <ul className="flex flex-wrap gap-3 self-center">
          {occasions.map(([key, label]) => (
            <li key={key}>
              <Link
                href={`/restaurants?occasion=${key}`}
                className="inline-flex items-center gap-2 rounded-lg border border-brass/50 bg-cream/5 px-4 py-2.5 text-sm font-bold text-brass-pale transition-colors hover:bg-brass hover:text-charcoal"
              >
                {label}
                <Icon name="arrow_forward" className="text-[18px]" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
