import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getImage } from "@/data/images";
import type { City } from "@/types";

interface CityIntrosProps {
  cities: City[];
}

/** Two-column editorial text: each city's opening paragraph beside a small plate photo. */
export function CityIntros({ cities }: CityIntrosProps) {
  return (
    <section className="border-t border-line bg-claret-mist py-section-sm md:py-section" aria-label="About each city">
      <Container>
        <SectionHeading number="02" eyebrow="In brief" title={<>Five dining <em>cultures</em>.</>} lede="A paragraph on each city. The full page covers booking customs, service charges, the listed restaurants and the awards they hold." size="md" />
        <div className="mt-12 gap-x-14 md:columns-2">
          {cities.map((city) => {
            const image = getImage(city.image);
            return (
              <article key={city.slug} className="mb-10 break-inside-avoid border-t border-brass/40 pt-6">
                <div className="flex items-start gap-4">
                  <div className="plate relative aspect-square w-16 shrink-0 sm:w-20">
                    <Image src={image.src} alt={image.alt} fill sizes="80px" className="object-cover" />
                  </div>
                  <div>
                    <p className="eyebrow text-brass-deep">{city.countryName}</p>
                    <h3 className="mt-1 font-display text-2xl font-medium text-claret-deep">
                      <Link href={`/cities/${city.slug}`} className="hover:text-claret">{city.name}</Link>
                    </h3>
                  </div>
                </div>
                <p className="mt-4 leading-relaxed text-ink/90">{city.intro[0]}</p>
                <Link href={`/cities/${city.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-claret underline-offset-2 hover:underline">
                  Restaurants in {city.name} <Icon name="arrow_forward" className="text-[18px]" />
                </Link>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
