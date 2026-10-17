import { RestaurantCard } from "@/components/cards/RestaurantCard";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { City, Restaurant } from "@/types";
import { pluralise } from "@/lib/utils";

interface CityRestaurantsProps {
  city: City;
  restaurants: Restaurant[];
}

/** The only card grid on the site: numbered carte cards for the city's listings. */
export function CityRestaurants({ city, restaurants }: CityRestaurantsProps) {
  return (
    <section className="py-section-sm md:py-section" aria-label="The restaurants">
      <Container>
        <SectionHeading
          number="03"
          eyebrow="The restaurants"
          title={<>{pluralise(restaurants.length, "listing")} in <em>{city.name}</em>.</>}
          lede="Every listing shows hours, menu formats and prices as published, booking rules and awards with their source. Photography is illustrative."
          size="md"
        />
        {restaurants.length ? (
          <ol className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((restaurant, i) => (
              <li key={restaurant.slug}>
                <RestaurantCard restaurant={restaurant} index={String(i + 1).padStart(2, "0")} />
              </li>
            ))}
          </ol>
        ) : (
          <div className="mt-10 max-w-xl border-s-2 border-brass ps-6">
            <p className="font-display text-2xl text-claret-deep">No listings yet.</p>
            <p className="mt-2 text-smoke">We add restaurants only after checking their published hours, menus and booking rules. If you run a restaurant in {city.name}, tell us about it.</p>
            <LinkButton href="/for-restaurants" variant="outline" className="mt-5" icon="arrow_forward">For restaurants</LinkButton>
          </div>
        )}
      </Container>
    </section>
  );
}
