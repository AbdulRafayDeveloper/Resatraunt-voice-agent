import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import type { Restaurant } from "@/types";
import { cn, formatDate } from "@/lib/utils";

interface VerificationNoteProps {
  verification: Restaurant["verification"];
  name: string;
}

/** When and how a listing was checked, with any caveats shown in full. Partial listings are flagged in ember. */
export function VerificationNote({ verification, name }: VerificationNoteProps) {
  const partial = verification.status === "partial";
  return (
    <div className={cn("rounded-xl border p-5 md:p-6", partial ? "border-ember/40 bg-ember/5" : "border-basil/30 bg-basil-soft/60")}>
      <p className={cn("flex items-center gap-2 font-bold", partial ? "text-ember" : "text-basil")}>
        <Icon name={partial ? "warning" : "verified"} filled className="text-[22px]" />
        Checked {formatDate(verification.checkedOn)} · {partial ? "Partially verified" : "Verified against the restaurant's own site"}
      </p>
      {verification.notes && verification.notes.length > 0 && (
        <ul className="mt-3 space-y-2 border-t border-line/70 pt-3 text-sm text-ink">
          {verification.notes.map((note) => (
            <li key={note} className="flex gap-2">
              <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brass" aria-hidden="true" />
              {note}
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-sm text-smoke">
        Spotted something wrong about {name}?{" "}
        <Link href="/contact" className="font-semibold text-claret underline underline-offset-2 hover:no-underline">
          Send a correction
        </Link>{" "}
        and we will check it against the restaurant&rsquo;s own site.
      </p>
    </div>
  );
}
