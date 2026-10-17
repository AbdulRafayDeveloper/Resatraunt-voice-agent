import Image from "next/image";
import Link from "next/link";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getImage } from "@/data/images";
import type { Guide } from "@/types";
import { cn, formatDate } from "@/lib/utils";

interface GuideCardProps {
  guide: Guide;
  /** "feature": large plate photo beside the text; "row": hairline-ruled ledger row for lists. */
  layout?: "feature" | "row";
  priority?: boolean;
  className?: string;
}

/** Guide summary that links to the article. Photography is illustrative stock. */
export function GuideCard({ guide, layout = "row", priority = false, className }: GuideCardProps) {
  const href = `/guides/${guide.slug}`;
  const meta = `${guide.readMinutes} min read`;

  if (layout === "feature") {
    const image = getImage(guide.image);
    return (
      <article className={cn("grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14", className)}>
        <Link href={href} className="plate relative mx-auto block aspect-square w-full max-w-xs lg:max-w-sm" aria-label={`${guide.title} (guide)`}>
          <Image src={image.src} alt={image.alt} fill priority={priority} sizes="(min-width: 1024px) 384px, 70vw" className="object-cover" />
        </Link>
        <div>
          <p className="eyebrow flex items-center gap-2 text-brass-deep">
            <span className="h-px w-8 bg-brass" aria-hidden="true" />
            {guide.category}
          </p>
          <h3 className="display-title mt-3 text-3xl text-claret-deep md:text-4xl lg:text-5xl">
            <Link href={href} className="hover:text-claret">{guide.title}</Link>
          </h3>
          <p className="lede mt-4 max-w-xl text-smoke">{guide.excerpt}</p>
          <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-smoke">
            <span className="inline-flex items-center gap-1.5"><Icon name="schedule" className="text-[18px] text-brass-deep" /> {meta}</span>
            <span className="inline-flex items-center gap-1.5"><Icon name="update" className="text-[18px] text-brass-deep" /> Updated {formatDate(guide.updatedOn)}</span>
          </p>
          <LinkButton href={href} className="mt-6" icon="arrow_forward">Read the guide</LinkButton>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group grid gap-3 border-b border-line py-6 sm:grid-cols-[1fr_auto] sm:items-end sm:gap-6", className)}>
      <div className="min-w-0">
        <p className="eyebrow text-brass-deep">{guide.category} · {meta}</p>
        <h3 className="mt-2 font-display text-2xl font-medium leading-tight text-claret-deep md:text-3xl">
          <Link href={href} className="hover:text-claret">{guide.title}</Link>
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/85 md:text-base">{guide.excerpt}</p>
        <p className="mt-2 text-xs text-smoke">Updated {formatDate(guide.updatedOn)}</p>
      </div>
      <Link href={href} className="inline-flex items-center gap-1 text-sm font-bold text-claret underline-offset-2 hover:underline">
        Read <Icon name="arrow_forward" className="text-[18px] transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  );
}
