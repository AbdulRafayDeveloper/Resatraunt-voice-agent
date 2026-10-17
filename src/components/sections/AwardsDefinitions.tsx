import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface Definition {
  term: string;
  body: string;
  detail: string;
}

/** Plain-language definitions; no logos, no claims about ranking between the schemes. */
const definitions: Definition[] = [
  {
    term: "Michelin Stars",
    body: "Michelin Guide",
    detail:
      "Awarded by Michelin's anonymous inspectors to restaurants in the cities and regions the Guide covers. One star means a very good restaurant in its category, two means excellent cooking that is worth a detour, three means exceptional cuisine that is worth a special journey. Stars are reviewed every year and can be lost.",
  },
  {
    term: "Michelin Green Star",
    body: "Michelin Guide",
    detail:
      "A separate Michelin distinction, introduced in 2020, for restaurants the Guide judges to be at the forefront of sustainable practice: sourcing, waste, energy and the way the kitchen works with its suppliers. It can be held alongside stars or on its own.",
  },
  {
    term: "James Beard Foundation Awards",
    body: "James Beard Foundation",
    detail:
      "Annual awards from the New York-based James Beard Foundation for restaurants, chefs and hospitality in the United States, including Outstanding Restaurant, Outstanding Chef, Best New Restaurant and regional Best Chef categories. Winners are chosen by a committee and a voting body from a shortlist of nominees.",
  },
  {
    term: "National Restaurant Awards",
    body: "National Restaurant Awards",
    detail:
      "An annual list of restaurants in the United Kingdom compiled by Restaurant magazine from the votes of an academy of chefs, writers and industry figures. Entries are ranked, and the top-ranked restaurant is named Restaurant of the Year.",
  },
];

/** Ruled list of what each award body's distinctions mean. */
export function AwardsDefinitions() {
  return (
    <section className="py-section-sm md:py-section" aria-label="What the awards mean">
      <Container>
        <SectionHeading
          number="01"
          eyebrow="What the awards mean"
          title={<>Four schemes, <em>plainly</em>.</>}
          lede="A short description of each distinction that appears in the register. We quote the bodies' own definitions in our words; none of them has reviewed or endorsed this page."
        />
        <dl className="mt-12 divide-y divide-line border-y border-line">
          {definitions.map((d) => (
            <div key={d.term} className="grid gap-3 py-6 md:grid-cols-[minmax(0,18rem)_1fr] md:gap-10">
              <dt>
                <span className="block font-display text-2xl font-medium text-claret-deep">{d.term}</span>
                <span className="eyebrow mt-1 block text-brass-deep">{d.body}</span>
              </dt>
              <dd className="max-w-2xl leading-relaxed text-ink">{d.detail}</dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
