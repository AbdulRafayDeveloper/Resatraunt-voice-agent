import { LogoMark } from "@/components/graphics/LogoMark";

/** Route-level loading state: brand mark and a short line, no layout shift for the header. */
export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20 text-center" role="status" aria-live="polite">
      <LogoMark className="h-12 w-12 animate-pulse" />
      <p className="text-sm font-semibold text-smoke">Laying the table…</p>
    </div>
  );
}
