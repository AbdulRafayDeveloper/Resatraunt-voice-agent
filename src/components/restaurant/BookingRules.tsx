import { Icon } from "@/components/ui/Icon";
import type { ReservationInfo } from "@/types";
import { walkInLabels } from "@/lib/utils";

interface BookingRulesProps {
  reservations: ReservationInfo;
  dressCode?: string;
}

/** Policy facts as a numbered list, a three-column facts strip and an optional dress-code callout. */
export function BookingRules({ reservations, dressCode }: BookingRulesProps) {
  const strip = [
    { label: "Provider", value: reservations.provider, icon: "event_available" },
    { label: "Walk-ins", value: walkInLabels[reservations.walkIns], icon: "directions_walk" },
    { label: "Online party size", value: reservations.maxPartyOnline ? `Up to ${reservations.maxPartyOnline} guests` : "Not stated", icon: "groups" },
  ];

  return (
    <div>
      {reservations.policy.length > 0 ? (
        <ol className="divide-y divide-line border-y border-line">
          {reservations.policy.map((rule, index) => (
            <li key={rule} className="grid grid-cols-[2.5rem_1fr] gap-3 py-4">
              <span className="font-display text-2xl italic leading-none text-brass-deep">{String(index + 1).padStart(2, "0")}</span>
              <p className="leading-relaxed text-ink">{rule}</p>
            </li>
          ))}
        </ol>
      ) : (
        <p className="border-y border-line py-4 text-smoke">The restaurant does not publish booking rules beyond its booking page.</p>
      )}

      <dl className="mt-6 grid gap-px overflow-hidden rounded-xl border border-line bg-line sm:grid-cols-3">
        {strip.map((cell) => (
          <div key={cell.label} className="bg-white px-4 py-4">
            <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-smoke">
              <Icon name={cell.icon} className="text-[16px] text-brass-deep" />
              {cell.label}
            </dt>
            <dd className="mt-1.5 font-semibold text-claret-deep">{cell.value}</dd>
          </div>
        ))}
      </dl>

      {dressCode && (
        <aside className="mt-6 flex items-start gap-3 rounded-xl bg-brass-pale px-4 py-3.5 text-sm text-brass-deep" aria-label="Dress code">
          <Icon name="info" className="mt-0.5 text-[20px]" />
          <p>
            <span className="font-bold">Dress code:</span> {dressCode}
          </p>
        </aside>
      )}
    </div>
  );
}
