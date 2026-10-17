import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Guide } from "@/types";

interface CityGuidesProps {
  guides: Guide[];
}

/** Up to three guides as a ruled list: title, excerpt and read time. */
export function CityGuides({ guides }: CityGuidesProps) {
  const shown = guides.slice(0, 3);
  if (shown.length === 0) return null;
  return (
    <section className="border-t border-line bg-linen py-section-sm md:py-section" aria-label="Guides">
      <Container>
        <SectionHeading number="06" eyebrow="Guides" title={<>Read before you <em>request</em>.</>} size="md" />
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {shown.map((guide) => (
            <li key={guide.slug}>
              <Link href={`/guides/${guide.slug}`} className="group grid gap-2 py-5 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-8">
                <span>
                  <span className="eyebrow text-brass-deep">{guide.category}</span>
                  <span className="mt-1 block font-display text-2xl font-medium text-claret-deep group-hover:text-claret">{guide.title}</span>
                  <span className="mt-1 block text-sm text-smoke">{guide.excerpt}</span>
                </span>
                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-smoke">
                  <Icon name="schedule" className="text-[18px] text-brass-deep" />
                  {guide.readMinutes} min read
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
