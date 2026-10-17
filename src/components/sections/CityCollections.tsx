import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { City, Collection, Restaurant } from "@/types";

interface CityCollectionsProps {
  city: City;
  collections: Collection[];
  restaurants: Restaurant[];
}

/** Collections that include at least one of the given restaurants. */
export function collectionsFeaturing(collections: Collection[], restaurants: Restaurant[]): Collection[] {
  const slugs = new Set(restaurants.map((r) => r.slug));
  return collections.filter((c) => c.restaurantSlugs.some((s) => slugs.has(s)));
}

/** Ruled list of collections that feature the city's restaurants. */
export function CityCollections({ city, collections, restaurants }: CityCollectionsProps) {
  const featuring = collectionsFeaturing(collections, restaurants);
  if (featuring.length === 0) return null;
  const slugs = new Set(restaurants.map((r) => r.slug));
  return (
    <section className="py-section-sm md:py-section" aria-label={`Collections featuring ${city.name}`}>
      <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading number="05" eyebrow="Collections" title={<>Lists that feature <em>{city.name}</em>.</>} size="md" />
        <ul className="divide-y divide-line border-y border-line self-start">
          {featuring.map((collection) => {
            const count = collection.restaurantSlugs.filter((s) => slugs.has(s)).length;
            return (
              <li key={collection.slug}>
                <Link href={`/collections/${collection.slug}`} className="group flex items-center justify-between gap-4 py-4">
                  <span>
                    <span className="block font-display text-xl font-medium text-claret-deep group-hover:text-claret">{collection.title}</span>
                    <span className="mt-0.5 block text-sm text-smoke">{count} from {city.name} · {collection.intro}</span>
                  </span>
                  <Icon name="arrow_forward" className="shrink-0 text-[22px] text-claret" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
