import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Hatch } from "@/components/graphics/Hatch";
import { QuickFinder } from "@/features/search/QuickFinder";
import { requestHref } from "@/config/navigation";
import { cities } from "@/data/cities";
import { siteImages } from "@/data/images";
import { occasionLabels, restaurants } from "@/data/restaurants";
import type { Occasion } from "@/types";

const occasionOptions = (Object.keys(occasionLabels) as Occasion[]).map((value) => ({ value, label: occasionLabels[value] }));
const awardCount = restaurants.reduce((n, r) => n + r.awards.length, 0);

const trustChips = [
  { icon: "fact_check", text: "Hours and prices as published" },
  { icon: "workspace_premium", text: `${awardCount} awards, each with a source` },
  { icon: "event_available", text: "Booking rules before you ask" },
  { icon: "mail", text: "Reply within one working day" },
];

/**
 * Hero sized to fit the first viewport on every device (capped so an artificially tall viewport,
 * e.g. a full-page screenshot, cannot stretch it). On phones the finder card is rendered directly
 * below the hero (overlapping its edge) so the hero itself fits above the fold; from lg the finder
 * sits inside the hero's right column.
 */
export function HomeHero() {
  const finder = <QuickFinder cities={cities.map((c) => ({ slug: c.slug, name: c.name }))} occasions={occasionOptions} />;
  return (
    <>
      <section
        className="relative isolate flex min-h-[min(calc(100svh-140px),900px)] items-center overflow-hidden bg-charcoal text-cream lg:min-h-[min(calc(100svh-112px),960px)]"
        aria-labelledby="hero-title"
      >
        <Image src={siteImages.homeHero.src} alt={siteImages.homeHero.alt} fill priority fetchPriority="high" sizes="100vw" quality={60} className="object-cover object-center" />
        <div className="hero-overlay absolute inset-0" aria-hidden="true" />
        <Hatch color="#F5EAD3" opacity={0.06} size={18} className="mix-blend-soft-light" />

        <div className="relative mx-auto grid w-full max-w-container-max items-center gap-8 px-4 py-6 sm:px-6 md:px-margin-desktop lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 lg:py-8">
          <div className="rise">
            <p className="eyebrow flex items-center gap-2 text-brass">
              <span className="h-px w-8 bg-brass" aria-hidden="true" /> London · Edinburgh · New York · Chicago · Philadelphia
            </p>
            <h1 id="hero-title" className="display-title mt-3 text-[2.35rem] leading-[1.02] sm:text-5xl lg:text-6xl">
              Find the table worth <em className="text-brass">talking</em> about.
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-cream/85 sm:text-lg lg:mt-4 lg:text-xl">
              A dining guide that shows its sources. Every listing carries verified hours, menu prices as published, the restaurant&apos;s own booking rules and its awards with a year and a link. Then request a table in a minute.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:flex sm:flex-wrap">
              <LinkButton href="/restaurants" variant="brass" size="md" icon="arrow_forward" className="!px-3 sm:!px-6">
                Browse restaurants
              </LinkButton>
              <LinkButton href={requestHref} variant="outlineLight" size="md" icon="table_restaurant" iconPosition="start" className="!px-3 sm:!px-6">
                Request a table
              </LinkButton>
            </div>
            <ul className="mt-5 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs text-cream/85 sm:flex sm:flex-wrap sm:gap-x-6 sm:text-sm">
              {trustChips.map((c) => (
                <li key={c.text} className="flex items-center gap-1.5">
                  <Icon name={c.icon} filled className="text-[16px] text-brass sm:text-[18px]" />
                  {c.text}
                </li>
              ))}
            </ul>
          </div>

          <div className="rise rise-delay-2 hidden lg:block lg:w-full lg:max-w-md lg:justify-self-end">
            {finder}
            <p className="mt-3 text-center text-xs text-cream/70">A request is not a confirmed booking. The restaurant confirms under its own terms.</p>
          </div>
        </div>
      </section>

      {/* Phone / tablet: finder directly under the hero, overlapping its bottom edge */}
      <div className="relative z-10 -mt-5 px-4 pb-6 sm:px-6 lg:hidden">
        <div className="mx-auto max-w-xl">{finder}</div>
      </div>
    </>
  );
}
