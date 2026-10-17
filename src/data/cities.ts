import type { City } from "@/types";

/** Cities with at least one listed restaurant. Add a city before adding a restaurant in it. */
export const cities: City[] = [
  {
    slug: "london",
    name: "London",
    country: "GB",
    countryName: "United Kingdom",
    currency: "GBP",
    intro: [
      "London's best tables range from a bare-walled Smithfield dining room that has held a Michelin star since 2009 to a two-star Mayfair newcomer that opened with a £225 tasting menu.",
      "Most serious restaurants here release tables one to three months ahead, take a card to hold the booking, and add a discretionary service charge of 12.5% to the bill.",
    ],
    image: "cityStreet",
    diningNotes: [
      "A discretionary service charge, usually 12.5%, is added to most bills; it is lawful to ask for it to be removed.",
      "Menu prices include VAT.",
      "Lunch services are short, typically 12:00 to 14:30, and several top kitchens close on Sunday evening and Monday.",
      "Dress codes still exist at a handful of classic dining rooms; The Ritz asks for a jacket and tie.",
    ],
  },
  {
    slug: "edinburgh",
    name: "Edinburgh",
    country: "GB",
    countryName: "United Kingdom",
    currency: "GBP",
    intro: [
      "Edinburgh's dining scene is built on Scottish produce: Shetland fish, Highland game and east-coast shellfish, cooked by chefs who name their suppliers on the menu.",
      "The city's most celebrated kitchens are in Leith and the New Town, and most are closed on Sunday and Monday.",
    ],
    image: "diningClassic",
    diningNotes: [
      "A discretionary service charge of 10% to 12.5% is common.",
      "Lunch is often the best-value way into a Michelin-starred kitchen, with set menus well below dinner prices.",
      "Book early for August: the Festival fills the city for the whole month.",
    ],
  },
  {
    slug: "new-york",
    name: "New York",
    country: "US",
    countryName: "United States",
    currency: "USD",
    intro: [
      "New York still sets the pace for American fine dining, from three-star Midtown institutions to a 28-seat Chinatown wine bar that was named the country's best new restaurant in 2026.",
      "The booking culture is fast: Resy and Tock drops at a fixed time of day, with walk-in bars as the pressure valve.",
    ],
    image: "exteriorNight",
    diningNotes: [
      "Menu prices exclude sales tax (8.875% in the city). Tip 18% to 20% unless a service charge is already included.",
      "Many restaurants release reservations exactly 14 or 30 days ahead at a set time, often 9 or 10 am Eastern.",
      "Tasting-menu restaurants frequently sell prepaid tickets through Tock; those are rarely refundable.",
      "Walk-in counter and bar seats are a real option at most places, including some starred ones.",
    ],
  },
  {
    slug: "chicago",
    name: "Chicago",
    country: "US",
    countryName: "United States",
    currency: "USD",
    intro: [
      "Chicago's tasting-menu scene runs from the theatre of Alinea to a 20-seat West Town room where the menu is written each morning around what arrived from the farms.",
      "Tock was invented here, so expect to prepay for the most sought-after seats.",
    ],
    image: "chefPass",
    diningNotes: [
      "Chicago's combined sales tax on restaurant meals is above 11%; menu prices exclude it.",
      "Tip 20% unless the restaurant states that service is included.",
      "Prepaid Tock reservations usually cannot be refunded, but can often be transferred to another guest.",
      "Winter weather affects openings; check the restaurant's own site before travelling in January and February.",
    ],
  },
  {
    slug: "philadelphia",
    name: "Philadelphia",
    country: "US",
    countryName: "United States",
    currency: "USD",
    intro: [
      "Philadelphia's reputation has risen with chef-owned neighbourhood restaurants, led by a southern Thai kitchen in Fishtown that took the James Beard Foundation's Outstanding Restaurant award in 2026.",
      "The city is relaxed about dress and format, and many of the best rooms still take walk-ins at the bar.",
    ],
    image: "groupToast",
    diningNotes: [
      "Sales tax on meals is 8%; menu prices exclude it.",
      "Tip 20% unless a service charge is stated on the menu.",
      "Several restaurants add a small kitchen service charge (Kalaya adds 3%) that goes to the back-of-house team.",
      "Many restaurants are BYOB or started that way; check the drinks policy before you arrive.",
    ],
  },
];

export function getCity(slug: string): City {
  const city = cities.find((c) => c.slug === slug);
  if (!city) throw new Error(`Unknown city: ${slug}`);
  return city;
}

export function findCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}
