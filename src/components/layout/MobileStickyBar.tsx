import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { requestHref } from "@/config/navigation";

/** Fixed bottom action bar on phones: Restaurants · Request a table · Collections. Hidden from lg up. */
export function MobileStickyBar() {
  return (
    <nav aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-cream/95 backdrop-blur lg:hidden" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <Link href="/restaurants" className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-bold text-claret-deep">
        <Icon name="search" className="text-[22px] text-claret" />
        Restaurants
      </Link>
      <Link href={requestHref} className="flex flex-col items-center justify-center gap-0.5 bg-claret py-2.5 text-xs font-bold text-cream">
        <Icon name="table_restaurant" filled className="text-[22px] text-brass" />
        Request a table
      </Link>
      <Link href="/collections" className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-bold text-claret-deep">
        <Icon name="auto_awesome" className="text-[22px] text-claret" />
        Collections
      </Link>
    </nav>
  );
}
