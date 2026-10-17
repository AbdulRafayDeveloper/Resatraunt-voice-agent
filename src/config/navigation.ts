export interface NavLink {
  href: string;
  label: string;
  icon: string;
  description?: string;
}

/** Primary header navigation (desktop + drawer). */
export const primaryNav: NavLink[] = [
  { href: "/restaurants", label: "Restaurants", icon: "restaurant", description: "Search by city, cuisine, price and occasion" },
  { href: "/collections", label: "Collections", icon: "auto_awesome", description: "Date night, tasting menus, chef's tables" },
  { href: "/cities", label: "Cities", icon: "location_city", description: "London, Edinburgh, New York, Chicago, Philadelphia" },
  { href: "/awards", label: "Awards", icon: "workspace_premium", description: "Michelin and James Beard, with sources" },
  { href: "/guides", label: "Guides", icon: "menu_book", description: "How booking, deposits and dress codes work" },
  { href: "/about", label: "About", icon: "info", description: "How we verify, how requests work" },
];

/** Secondary links shown in the drawer and footer. */
export const secondaryNav: NavLink[] = [
  { href: "/for-restaurants", label: "For restaurants", icon: "storefront" },
  { href: "/faqs", label: "FAQs", icon: "help" },
  { href: "/contact", label: "Contact", icon: "call" },
];

export const legalNav: NavLink[] = [
  { href: "/privacy-policy", label: "Privacy Policy", icon: "policy" },
  { href: "/terms", label: "Terms of Use", icon: "gavel" },
  { href: "/cookie-policy", label: "Cookie Policy", icon: "cookie" },
  { href: "/booking-policy", label: "Booking & Cancellation Policy", icon: "event_busy" },
];

export const requestHref = "/request-a-table";
