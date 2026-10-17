import Image from "next/image";
import Link from "next/link";
import { AwardChips } from "@/components/restaurant/AwardChips";
import { Icon } from "@/components/ui/Icon";
import { getCity } from "@/data/cities";
import { getImage } from "@/data/images";
import type { Restaurant } from "@/types";
import { cn, formatMoney, priceBandSymbol } from "@/lib/utils";

interface RestaurantCardProps {
  restaurant: Restaurant;
  /** "carte": tall card with arched photo; "row": horizontal ledger row for dense lists. */
  layout?: "carte" | "row";
  /** Rank or index label shown in the corner, e.g. "01". */
  index?: string;
  priority?: boolean;
  className?: string;
}

/** Restaurant summary that links to the listing. Photography is illustrative and says so. */
export function RestaurantCard({ restaurant, layout = "carte", index, priority = false, className }: RestaurantCardProps) {
  const image = getImage(restaurant.image);
  const city = getCity(restaurant.citySlug);
  const href = `/restaurants/${restaurant.slug}`;
  const topAward = restaurant.awards[0];

  if (layout === "row") {
    return (
      <article className={cn("group grid gap-4 border-b border-line py-5 sm:grid-cols-[96px_1fr_auto] sm:items-center", className)}>
        <Link href={href} className="relative block aspect-[4/3] w-full overflow-hidden rounded-lg sm:aspect-square" aria-label={`${restaurant.name} listing`}>
          <Image src={image.src} alt={image.alt} fill sizes="(min-width: 640px) 96px, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        </Link>
        <div className="min-w-0">
          <p className="eyebrow text-brass-deep">{restaurant.neighbourhood}, {city.name}</p>
          <h3 className="mt-1 font-display text-2xl font-medium text-claret-deep">
            <Link href={href} className="hover:text-claret">{restaurant.name}</Link>
          </h3>
          <p className="mt-1 text-sm text-smoke">{restaurant.cuisine} · {priceBandSymbol(restaurant.priceBand, restaurant.currency)}{restaurant.priceFrom ? ` · from ${formatMoney(restaurant.priceFrom, restaurant.currency)}` : ""}</p>
          {topAward && <p className="mt-1 text-xs font-semibold text-brass-deep">{topAward.title} · {topAward.body} {topAward.year}</p>}
        </div>
        <Link href={href} className="inline-flex items-center gap-1 text-sm font-bold text-claret underline-offset-2 hover:underline">
          View listing <Icon name="arrow_forward" className="text-[18px]" />
        </Link>
      </article>
    );
  }

  return (
    <article className={cn("group relative flex h-full flex-col", className)}>
      <Link href={href} className="carte relative block aspect-[4/5] w-full overflow-hidden bg-linen" aria-label={`${restaurant.name} listing`}>
        <Image src={image.src} alt={image.alt} fill priority={priority} sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="hero-overlay-bottom absolute inset-0" aria-hidden="true" />
        {index && <span className="absolute left-4 top-4 font-display text-2xl italic text-cream/90">{index}</span>}
        <span className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-cream">
          <span className="text-xs font-semibold uppercase tracking-wider text-cream/80">{restaurant.neighbourhood}, {city.name}</span>
          <span className="rounded-md bg-cream/15 px-2 py-0.5 text-xs font-bold backdrop-blur">{priceBandSymbol(restaurant.priceBand, restaurant.currency)}</span>
        </span>
      </Link>
      <div className="flex flex-1 flex-col pt-4">
        <h3 className="font-display text-2xl font-medium leading-tight text-claret-deep">
          <Link href={href} className="hover:text-claret">{restaurant.name}</Link>
        </h3>
        <p className="mt-1 text-sm font-semibold text-smoke">{restaurant.cuisine}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink/85">{restaurant.tagline}</p>
        <div className="mt-3">
          <AwardChips awards={restaurant.awards.slice(0, 2)} />
        </div>
        <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-1 border-t border-line pt-3 text-xs text-smoke">
          <dt className="sr-only">Booking</dt>
          <dd className="flex items-center gap-1"><Icon name="event_available" className="text-[16px] text-brass-deep" /> {restaurant.reservations.provider}</dd>
          <dt className="sr-only">Starting price</dt>
          <dd className="flex items-center gap-1">
            <Icon name="payments" className="text-[16px] text-brass-deep" /> {restaurant.priceFrom ? `From ${formatMoney(restaurant.priceFrom, restaurant.currency)}` : "Priced on the menu"}
          </dd>
        </dl>
        <p className="mt-2 text-[0.68rem] text-smoke/80">Illustrative photo, not of the restaurant.</p>
      </div>
    </article>
  );
}
