import Image from "next/image";
import Link from "next/link";
import { CollectionFactsLine, collectionRestaurants } from "@/components/sections/CollectionFacts";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getImage } from "@/data/images";
import type { Collection } from "@/types";
import { cn } from "@/lib/utils";

interface CollectionRowsProps {
  collections: Collection[];
}

/** Every collection as an alternating editorial row: round plate photo one side, text the other. */
export function CollectionRows({ collections }: CollectionRowsProps) {
  return (
    <section className="py-section-sm md:py-section" aria-label="All collections">
      <Container>
        <SectionHeading
          number="01"
          eyebrow="Six lists"
          title={<>Chosen for a <em>reason</em>.</>}
          lede="Each collection is a short, argued list rather than a ranking. We say why every restaurant is on it and show the published price, the booking rule and the awards with their source."
        />
        <ol className="mt-12 divide-y divide-line border-y border-line">
          {collections.map((collection, i) => {
            const image = getImage(collection.image);
            const restaurants = collectionRestaurants(collection);
            const imageRight = i % 2 === 1;
            return (
              <li key={collection.slug} className="grid items-center gap-8 py-10 md:grid-cols-[minmax(0,320px)_1fr] md:gap-14 md:py-14">
                <div className={cn("plate relative mx-auto aspect-square w-full max-w-[260px] md:max-w-none", imageRight && "md:order-2")}>
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 320px, 260px" className="object-cover" />
                </div>
                <div className={cn(imageRight && "md:order-1 md:text-end")}>
                  <p className="eyebrow text-brass-deep">{collection.eyebrow}</p>
                  <h2 className="display-title mt-3 text-3xl text-claret-deep md:text-4xl">
                    <Link href={`/collections/${collection.slug}`} className="hover:text-claret">{collection.title}</Link>
                  </h2>
                  <p className={cn("lede mt-4 max-w-xl text-smoke", imageRight && "md:ms-auto")}>{collection.intro}</p>
                  <CollectionFactsLine restaurants={restaurants} className="mt-4 text-sm text-smoke" />
                  <div className="mt-6">
                    <LinkButton href={`/collections/${collection.slug}`} variant="outline" icon="arrow_forward">Open collection</LinkButton>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
