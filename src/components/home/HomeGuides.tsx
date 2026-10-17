import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { guides } from "@/data/guides";

/** Three guides as a ruled editorial list. */
export function HomeGuides() {
  const picks = guides.slice(0, 3);
  return (
    <section className="bg-linen py-section-sm md:py-section" aria-label="Guides">
      <Container className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading number="07" eyebrow="Guides" title={<>Know before <em>you book</em>.</>} lede="Release windows, deposits, dress codes and what a tasting menu commits you to, with real examples from the listings." size="md" />
          <LinkButton href="/guides" variant="outline" className="mt-6" icon="arrow_forward">All guides</LinkButton>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {picks.map((g) => (
            <li key={g.slug}>
              <Link href={`/guides/${g.slug}`} className="group flex items-start justify-between gap-4 py-5">
                <span>
                  <span className="eyebrow text-brass-deep">{g.category} · {g.readMinutes} min read</span>
                  <span className="mt-1 block font-display text-2xl font-medium text-claret-deep group-hover:text-claret">{g.title}</span>
                  <span className="mt-1 block text-sm text-smoke">{g.excerpt}</span>
                </span>
                <Icon name="arrow_forward" className="mt-2 shrink-0 text-[22px] text-claret transition-transform group-hover:translate-x-1" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
