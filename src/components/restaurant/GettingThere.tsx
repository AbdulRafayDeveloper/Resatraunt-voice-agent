import { Icon } from "@/components/ui/Icon";
import type { Restaurant } from "@/types";

interface GettingThereProps {
  restaurant: Restaurant;
}

/** Address, map link, directions note and contact channels as a ruled list. */
export function GettingThere({ restaurant }: GettingThereProps) {
  const { address, name } = restaurant;
  const mapsQuery = `${name}, ${address.street}, ${address.locality} ${address.postalCode}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`;
  const websiteHost = new URL(restaurant.website).hostname.replace(/^www\./, "");

  const links = [
    { icon: "map", label: "Open in Google Maps", href: mapsUrl, external: true },
    ...(restaurant.phone ? [{ icon: "call", label: restaurant.phone, href: `tel:${restaurant.phone.replace(/\s+/g, "")}`, external: false }] : []),
    { icon: "language", label: websiteHost, href: restaurant.website, external: true },
    ...(restaurant.instagram ? [{ icon: "public", label: "Instagram", href: restaurant.instagram, external: true }] : []),
  ];

  return (
    <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
      <address className="not-italic">
        <p className="flex items-start gap-2 font-display text-2xl text-claret-deep">
          <Icon name="location_on" className="mt-1 text-[24px] text-brass-deep" />
          <span>
            {address.street}
            <br />
            {address.locality}
            {address.region ? `, ${address.region}` : ""} {address.postalCode}
          </span>
        </p>
        {restaurant.gettingThere && <p className="mt-4 leading-relaxed text-ink/85">{restaurant.gettingThere}</p>}
      </address>
      <ul className="divide-y divide-line border-y border-line">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              className="flex min-h-11 items-center gap-3 py-3 font-semibold text-claret transition-colors hover:text-claret-deep"
            >
              <Icon name={link.icon} className="text-[20px] text-brass-deep" />
              <span className="flex-1">{link.label}</span>
              <Icon name={link.external ? "open_in_new" : "arrow_forward"} className="text-[18px] text-smoke" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
