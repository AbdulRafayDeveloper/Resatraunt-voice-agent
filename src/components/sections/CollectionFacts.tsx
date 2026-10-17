import { cities } from "@/data/cities";
import { findRestaurant } from "@/data/restaurants";
import type { Collection, Restaurant } from "@/types";
import { pluralise } from "@/lib/utils";

/** Restaurants in a collection, in the collection's own order; unknown slugs are skipped silently. */
export function collectionRestaurants(collection: Collection): Restaurant[] {
  return collection.restaurantSlugs.map(findRestaurant).filter((r): r is Restaurant => r !== undefined);
}

/** City names covered by a set of restaurants, in the order cities are listed in src/data/cities.ts. */
export function cityNamesFor(restaurants: Restaurant[]): string[] {
  const slugs = new Set(restaurants.map((r) => r.citySlug));
  return cities.filter((c) => slugs.has(c.slug)).map((c) => c.name);
}

/** "London, New York and more" style phrase for titles and metadata. */
export function cityPhrase(names: string[]): string {
  if (names.length === 0) return "our cities";
  if (names.length === 1) return names[0];
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names[0]}, ${names[1]} and more`;
}

interface CollectionFactsLineProps {
  restaurants: Restaurant[];
  className?: string;
}

/** "6 restaurants · cities: London, New York" derived from the data. */
export function CollectionFactsLine({ restaurants, className }: CollectionFactsLineProps) {
  const names = cityNamesFor(restaurants);
  return (
    <p className={className}>
      <span className="font-semibold text-ink">{pluralise(restaurants.length, "restaurant")}</span>
      <span aria-hidden="true"> · </span>
      <span>cities: {names.length ? names.join(", ") : "none yet"}</span>
    </p>
  );
}
