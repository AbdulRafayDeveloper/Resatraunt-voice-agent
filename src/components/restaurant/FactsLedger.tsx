import { cn } from "@/lib/utils";

export interface FactRow {
  label: string;
  /** Rows with an undefined or empty value are not rendered. */
  value?: string | number;
}

interface FactsLedgerProps {
  rows: FactRow[];
  className?: string;
}

/** Key facts as a printed-carte ledger: label, dotted leader, value. Only defined values appear. */
export function FactsLedger({ rows, className }: FactsLedgerProps) {
  const listed = rows.filter((r) => r.value !== undefined && r.value !== "");
  if (listed.length === 0) return null;
  return (
    <dl className={cn("divide-y divide-line border-y border-line", className)}>
      {listed.map((row) => (
        <div key={row.label} className="leader py-3 text-sm">
          <dt className="font-semibold text-ink">{row.label}</dt>
          <dd className="text-end text-smoke">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
