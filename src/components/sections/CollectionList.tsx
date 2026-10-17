import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Restaurant } from "@/types";
import { pluralise } from "@/lib/utils";

interface CollectionListProps {
  restaurants: Restaurant[];
}

function indexLabel(i: number): string {
  return String(i + 1).padStart(2, "0");
}

/** Numbered ledger of restaurant rows in the collection's order. */
export function CollectionList({ restaurants }: CollectionListProps) {
  return (
    <section className="border-t border-line bg-linen py-section-sm md:py-section" aria-label="The list">
      <Container>
        <SectionHeading
          number="02"
          eyebrow="The list"
          title={<>{pluralise(restaurants.length, "restaurant")}, <em>in order</em>.</>}
          lede="Prices are the restaurant's own published figures per person; hours and booking rules are checked on the date shown on each listing."
          size="md"
        />
        {restaurants.length ? (
          <ol className="mt-10 border-t border-line">
            {restaurants.map((restaurant, i) => (
              <li key={restaurant.slug} className="grid grid-cols-[2.5rem_1fr] gap-2 sm:grid-cols-[3.5rem_1fr]">
                <span className="pt-6 font-display text-2xl italic text-brass-deep sm:text-3xl" aria-hidden="true">{indexLabel(i)}</span>
                <RestaurantCard restaurant={restaurant} layout="row" index={indexLabel(i)} />
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-10 text-smoke">No listings yet in this collection.</p>
        )}
      </Container>
    </section>
  );
}
