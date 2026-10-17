import type { Currency, MenuFormat } from "@/types";
import { cn, formatMoney } from "@/lib/utils";

interface MenuLedgerProps {
  formats: MenuFormat[];
  currency: Currency;
  className?: string;
}

const typeLabels: Record<MenuFormat["type"], string> = {
  tasting: "Tasting",
  "a-la-carte": "À la carte",
  "set-lunch": "Set lunch",
  "set-menu": "Set menu",
  bar: "Bar",
};

/** Menu formats as a printed-carte ledger: name, type, dotted leader, price or note. */
export function MenuLedger({ formats, currency, className }: MenuLedgerProps) {
  return (
    <ul className={cn("divide-y divide-line", className)} aria-label="Menu formats">
      {formats.map((f) => (
        <li key={f.name} className="py-3">
          <div className="leader">
            <span className="font-semibold text-ink">
              {f.name}
              <span className="ms-2 rounded bg-linen px-1.5 py-0.5 align-middle text-[0.65rem] font-bold uppercase tracking-wider text-smoke">{typeLabels[f.type]}</span>
            </span>
            <span className="whitespace-nowrap font-display text-lg text-claret-deep">{f.price !== undefined ? formatMoney(f.price, currency) : "See menu"}</span>
          </div>
          {(f.priceNote || f.description) && <p className="mt-1 text-xs text-smoke">{[f.description, f.priceNote].filter(Boolean).join(" ")}</p>}
        </li>
      ))}
    </ul>
  );
}
