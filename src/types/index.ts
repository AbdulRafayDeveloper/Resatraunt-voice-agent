/** Shared domain types for TableTalk. Content lives in src/data; identity in src/config. */

export type CountryCode = "GB" | "US";
export type Currency = "GBP" | "USD";

/** 1 = under 40 per person, 2 = 40 to 90, 3 = 90 to 200, 4 = 200 and above (local currency). */
export type PriceBand = 1 | 2 | 3 | 4;

export type Weekday = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export type Occasion =
  | "date-night"
  | "celebration"
  | "business"
  | "tasting-menu"
  | "chefs-table"
  | "wine"
  | "solo-counter"
  | "group"
  | "lunch"
  | "vegetarian-friendly"
  | "walk-in";

export type MenuType = "tasting" | "a-la-carte" | "set-lunch" | "set-menu" | "bar";

export interface MenuFormat {
  name: string;
  type: MenuType;
  /** Price per person in the restaurant's currency; omitted when the restaurant does not publish one. */
  price?: number;
  priceNote?: string;
  description?: string;
}

export interface MenuInfo {
  formats: MenuFormat[];
  /** ISO date the menu facts were last checked against the source. */
  asOf: string;
  sourceUrl: string;
  notes?: string[];
}

export type ReservationProvider = "Tock" | "Resy" | "SevenRooms" | "OpenTable" | "Own website" | "Phone" | "Email";

export interface ReservationInfo {
  provider: ReservationProvider;
  /** Verified public booking URL on the provider or the restaurant's own site. */
  bookingUrl?: string;
  walkIns: "yes" | "limited" | "no" | "unknown";
  maxPartyOnline?: number;
  /** Short policy facts as published by the restaurant (deposits, release windows, group rules). */
  policy: string[];
}

export interface ServiceHours {
  service: "Lunch" | "Dinner" | "All day" | "Brunch";
  days: Weekday[];
  /** 24-hour local time, e.g. "17:30". */
  opens: string;
  closes: string;
  note?: string;
}

export type AwardBody = "Michelin Guide" | "James Beard Foundation" | "National Restaurant Awards" | "Other";

export interface Award {
  title: string;
  body: AwardBody;
  year: number;
  sourceUrl: string;
  sourceLabel: string;
  /** True when confirmed against the awarding body's own site or an official announcement. */
  verified: boolean;
}

export interface Address {
  street: string;
  locality: string;
  region?: string;
  postalCode: string;
}

export interface Restaurant {
  slug: string;
  name: string;
  citySlug: string;
  neighbourhood: string;
  country: CountryCode;
  currency: Currency;
  address: Address;
  cuisine: string;
  /** One line used on cards and in metadata. */
  tagline: string;
  description: string[];
  chefs: string[];
  openedYear?: number;
  seats?: number;
  priceBand: PriceBand;
  /** Lowest published per-person price, when the restaurant publishes one. */
  priceFrom?: number;
  priceFromNote?: string;
  hours: ServiceHours[];
  hoursAsOf: string;
  hoursSourceUrl: string;
  menu: MenuInfo;
  reservations: ReservationInfo;
  dressCode?: string;
  awards: Award[];
  occasions: Occasion[];
  features: string[];
  website: string;
  instagram?: string;
  phone?: string;
  gettingThere?: string;
  /** Illustrative editorial photo key from src/data/images.ts; never a photo of the restaurant itself. */
  image: string;
  verification: {
    status: "verified" | "partial";
    checkedOn: string;
    notes?: string[];
  };
  featured: boolean;
  newOpening?: boolean;
}

export interface City {
  slug: string;
  name: string;
  country: CountryCode;
  countryName: string;
  currency: Currency;
  intro: string[];
  image: string;
  /** Short, factual notes about dining customs that affect booking (service charge, tipping, timing). */
  diningNotes: string[];
}

export interface Collection {
  slug: string;
  title: string;
  eyebrow: string;
  intro: string;
  /** Why these restaurants were chosen; shown on the collection page. */
  editorNote: string[];
  image: string;
  restaurantSlugs: string[];
  occasion?: Occasion;
}

export interface GuideSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  image: string;
  category: string;
  publishedOn: string;
  updatedOn: string;
  sections: GuideSection[];
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  icon: string;
  items: FaqItem[];
}

export interface HowItWorksStep {
  title: string;
  detail: string;
  icon: string;
}
