import type { Collection } from "@/types";

/** Editorial collections. Each slug must exist in src/data/restaurants.ts. */
export const collections: Collection[] = [
  {
    slug: "date-night",
    title: "Date Night",
    eyebrow: "Collection 01",
    intro: "Rooms with low light, tables for two and kitchens worth talking about afterwards.",
    editorNote: [
      "We picked these for the room as much as the food: candlelit, close-set and quiet enough to hear each other. Every one takes bookings for two online.",
      "Where a restaurant is tasting-menu only, the price shown is the per-person menu price as published; drinks are extra.",
    ],
    image: "coupleDinner",
    restaurantSlugs: ["bonheur-by-matt-abe", "lei", "gymkhana", "the-ritz-restaurant", "core-by-clare-smyth", "atomix"],
    occasion: "date-night",
  },
  {
    slug: "tasting-menus",
    title: "The Best Tasting Menus",
    eyebrow: "Collection 02",
    intro: "Multi-course menus where the kitchen decides, from £165 fixed-price cartes to prepaid Tock tickets.",
    editorNote: [
      "A tasting menu is a commitment: two to four hours, a fixed price and often a deposit or full prepayment. We list the published price for each, the number of courses where the restaurant states it, and whether the whole table has to take the same menu.",
      "Several of these restaurants release tables on a fixed day each month. Our guide to booking starred restaurants explains the release windows.",
    ],
    image: "dishDark2",
    restaurantSlugs: ["bonheur-by-matt-abe", "the-ritz-restaurant", "feld", "alinea", "atomix", "core-by-clare-smyth", "ikoyi"],
    occasion: "tasting-menu",
  },
  {
    slug: "chefs-table",
    title: "Chef's Tables and Counters",
    eyebrow: "Collection 03",
    intro: "Seats where the kitchen is the view: counters, open passes and whole-table chef's tables.",
    editorNote: [
      "Counter dining ranges from a 20-seat room where the cooks work in the middle of the floor to a six-seat chef's table sold as a single £1,350 booking. We note how each is booked, because most are not available online.",
    ],
    image: "chefsTable",
    restaurantSlugs: ["feld", "bonheur-by-matt-abe", "atomix", "alinea"],
    occasion: "chefs-table",
  },
  {
    slug: "business-dinners",
    title: "Business Dinners",
    eyebrow: "Collection 04",
    intro: "Discreet rooms, dependable kitchens and private dining for when the conversation matters.",
    editorNote: [
      "For a working dinner you want a table that is easy to book, a room where you can talk, and a kitchen that does not insist on a three-hour tasting menu. These have private rooms or quiet corners, and all take bookings for six or more.",
    ],
    image: "businessDinner",
    restaurantSlugs: ["gymkhana", "the-ritz-restaurant", "st-john-smithfield", "le-bernardin", "the-kitchin"],
    occasion: "business",
  },
  {
    slug: "wine-led",
    title: "Wine-Led Dining",
    eyebrow: "Collection 05",
    intro: "Lists worth the trip: sommelier-run rooms, published cellars and bars where the food follows the bottle.",
    editorNote: [
      "Each restaurant here publishes its wine list or has a sommelier recognised by the Michelin Guide or the Court of Master Sommeliers. Prices quoted are from the published lists on the date shown on each page.",
    ],
    image: "winePour",
    restaurantSlugs: ["lei", "bonheur-by-matt-abe", "st-john-smithfield", "le-bernardin", "core-by-clare-smyth"],
    occasion: "wine",
  },
  {
    slug: "new-openings",
    title: "New Openings and Rising Stars",
    eyebrow: "Collection 06",
    intro: "Restaurants that opened within the last two years and have already been recognised by Michelin or the James Beard Foundation.",
    editorNote: [
      "New restaurants change their hours and menus often. We re-check these listings more frequently than the rest of the site and show the date each was last checked.",
    ],
    image: "exteriorNight",
    restaurantSlugs: ["bonheur-by-matt-abe", "lei"],
  },
];

export function getCollection(slug: string): Collection {
  const collection = collections.find((c) => c.slug === slug);
  if (!collection) throw new Error(`Unknown collection: ${slug}`);
  return collection;
}

export function findCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}
