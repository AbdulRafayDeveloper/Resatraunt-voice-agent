import { walkInLabels } from "@/lib/utils";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { siteConfig } from "@/config/site";
import { requestHref } from "@/config/navigation";
import type { Restaurant } from "@/types";
import { formatDays, formatMoney, formatTime, priceBandLabels, priceBandSymbol } from "@/lib/utils";

interface RestaurantAsideProps {
  restaurant: Restaurant;
}

/** Sticky booking panel: price, request button, direct booking link, walk-ins and the first service block. */
export function RestaurantAside({ restaurant }: RestaurantAsideProps) {
  const { reservations, currency } = restaurant;
  const nextService = restaurant.hours[0];

  return (
    <aside role="complementary" aria-label={`Book ${restaurant.name}`} className="rounded-2xl border border-line bg-white p-6 shadow-card lg:sticky lg:top-32">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-display text-3xl text-brass-deep" title={priceBandLabels[restaurant.priceBand]}>
          {priceBandSymbol(restaurant.priceBand, currency)}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-smoke">{priceBandLabels[restaurant.priceBand]}</span>
      </div>
      <p className="mt-3 font-display text-3xl font-medium text-claret-deep">{restaurant.priceFrom ? `From ${formatMoney(restaurant.priceFrom, currency)}` : "Priced on the menu"}</p>
      {restaurant.priceFromNote && <p className="mt-1 text-sm text-smoke">{restaurant.priceFromNote}</p>}

      <div className="mt-5 grid gap-2">
        <LinkButton href={`${requestHref}?restaurant=${restaurant.slug}`} icon="arrow_forward" fullWidth>
          Request a table
        </LinkButton>
        {reservations.bookingUrl && (
          <LinkButton href={reservations.bookingUrl} variant="outline" icon="open_in_new" fullWidth>
            Book direct on {reservations.provider}
          </LinkButton>
        )}
      </div>

      <ul className="mt-5 space-y-2 border-t border-line pt-4 text-sm text-ink">
        <li className="flex items-start gap-2">
          <Icon name="directions_walk" className="mt-0.5 text-[18px] text-brass-deep" />
          <span>{walkInLabels[reservations.walkIns]}</span>
        </li>
        {nextService && (
          <li className="flex items-start gap-2">
            <Icon name="schedule" className="mt-0.5 text-[18px] text-brass-deep" />
            <span>
              {nextService.service} {formatDays(nextService.days)}, {formatTime(nextService.opens)} to {formatTime(nextService.closes)}
            </span>
          </li>
        )}
      </ul>

      <p className="mt-4 text-xs leading-relaxed text-smoke">A request is not a confirmed booking. {siteConfig.replyPromise}</p>
    </aside>
  );
}
