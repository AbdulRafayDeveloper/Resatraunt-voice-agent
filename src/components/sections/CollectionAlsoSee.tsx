import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Collection } from "@/types";

interface CollectionAlsoSeeProps {
  collections: Collection[];
}

/** The other collections as a ruled list of links with their intros. */
export function CollectionAlsoSee({ collections }: CollectionAlsoSeeProps) {
  if (collections.length === 0) return null;
  return (
    <section className="py-section-sm md:py-section" aria-label="Also see">
      <Container>
        <SectionHeading number="03" eyebrow="Also see" title={<>Other <em>collections</em>.</>} size="md" />
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {collections.map((collection) => (
            <li key={collection.slug}>
              <Link href={`/collections/${collection.slug}`} className="group grid gap-2 py-5 sm:grid-cols-[9rem_1fr_auto] sm:items-center sm:gap-6">
                <span className="eyebrow text-brass-deep">{collection.eyebrow}</span>
                <span>
                  <span className="block font-display text-2xl font-medium text-claret-deep group-hover:text-claret">{collection.title}</span>
                  <span className="mt-1 block text-sm text-smoke">{collection.intro}</span>
                </span>
                <Icon name="arrow_forward" className="hidden text-[22px] text-claret sm:block" />
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
