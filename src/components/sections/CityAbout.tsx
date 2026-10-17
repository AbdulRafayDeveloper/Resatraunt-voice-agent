import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { City } from "@/types";

interface CityAboutProps {
  city: City;
}

/** Intro paragraphs in a wide editorial column, then dining notes as a ruled list. */
export function CityAbout({ city }: CityAboutProps) {
  return (
    <>
      <section className="py-section-sm md:py-section" aria-label="About dining here">
        <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <SectionHeading number="01" eyebrow="About dining here" title={<>Eating out in <em>{city.name}</em>.</>} size="md" />
          <div className="max-w-xl space-y-5 text-lg leading-relaxed text-ink">
            {city.intro.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-linen py-section-sm md:py-section" aria-label="Dining notes">
        <Container>
          <SectionHeading number="02" eyebrow="Dining notes" title={<>Before you <em>book</em>.</>} lede="Short, factual notes on the customs that affect the bill and the booking." size="md" />
          <ul className="mt-10 max-w-3xl divide-y divide-line border-y border-line">
            {city.diningNotes.map((note) => (
              <li key={note} className="flex items-start gap-4 py-4">
                <Icon name="lightbulb" className="mt-0.5 text-[22px] text-brass-deep" />
                <p className="leading-relaxed text-ink">{note}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
