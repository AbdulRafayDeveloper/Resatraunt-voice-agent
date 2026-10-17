import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { collections } from "@/data/collections";
import { getImage } from "@/data/images";
import { findRestaurant } from "@/data/restaurants";

/** Collections as a numbered ledger beside one sticky arched photo. */
export function HomeCollections() {
  const lead = collections[0];
  const image = getImage(lead.image);
  return (
    <section className="bg-cream py-section-sm md:py-section" aria-label="Collections">
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading number="04" eyebrow="Collections" title={<>Pick by the <em>evening</em> you want.</>} lede="Six short lists, each with a note on why the restaurants are there and what booking them involves." />
          <Link href={`/collections/${lead.slug}`} className="carte relative mt-8 block aspect-[4/5] w-full max-w-sm overflow-hidden" aria-label={`${lead.title} collection`}>
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 380px, 80vw" className="object-cover" />
          </Link>
        </div>
        <ol className="divide-y divide-line border-y border-line">
          {collections.map((c, i) => {
            const count = c.restaurantSlugs.filter((s) => findRestaurant(s)).length;
            return (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-5 transition-colors hover:bg-claret-mist">
                  <span className="font-display text-xl italic text-brass-deep">{String(i + 1).padStart(2, "0")}</span>
                  <span>
                    <span className="block font-display text-2xl font-medium text-claret-deep group-hover:text-claret">{c.title}</span>
                    <span className="mt-1 block text-sm text-smoke">{c.intro}</span>
                    <span className="mt-1 block text-xs font-semibold uppercase tracking-wider text-brass-deep">{count} restaurants</span>
                  </span>
                  <Icon name="arrow_forward" className="text-[22px] text-claret transition-transform group-hover:translate-x-1" />
                </Link>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
