import Image from "next/image";
import type { ReactNode } from "react";
import { Hatch } from "@/components/graphics/Hatch";
import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import type { SiteImage } from "@/data/images";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  image?: SiteImage;
  /** Extra content under the lede (buttons, chips). */
  children?: ReactNode;
  /** "photo" = full-bleed photo with overlay; "band" = plain claret band; "split" = text left, plate photo right; "linen" = pale band. */
  variant?: "photo" | "band" | "split" | "linen";
  className?: string;
}

/** Inner-page hero. Four layouts so consecutive pages never feel identical. */
export function PageHero({ crumbs, eyebrow, title, lede, image, children, variant = "photo", className }: PageHeroProps) {
  if (variant === "split") {
    return (
      <section className={cn("relative overflow-hidden bg-claret-mist", className)}>
        <Container className="relative grid items-center gap-8 py-10 md:py-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14">
          <div>
            <Breadcrumbs items={crumbs} />
            {eyebrow && <p className="eyebrow mt-5 flex items-center gap-2 text-brass-deep"><span className="h-px w-8 bg-brass" aria-hidden="true" />{eyebrow}</p>}
            <h1 className="display-title mt-3 text-4xl text-claret-deep sm:text-5xl lg:text-6xl">{title}</h1>
            {lede && <p className="lede mt-4 max-w-2xl text-smoke">{lede}</p>}
            {children && <div className="mt-6">{children}</div>}
          </div>
          {image && (
            <div className="plate relative mx-auto aspect-square w-full max-w-sm lg:max-w-md">
              <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 448px, 80vw" className="object-cover" />
            </div>
          )}
        </Container>
      </section>
    );
  }

  if (variant === "linen") {
    return (
      <section className={cn("border-b border-line bg-linen", className)}>
        <Container className="py-10 md:py-14">
          <Breadcrumbs items={crumbs} />
          {eyebrow && <p className="eyebrow mt-5 flex items-center gap-2 text-brass-deep"><span className="h-px w-8 bg-brass" aria-hidden="true" />{eyebrow}</p>}
          <h1 className="display-title mt-3 max-w-4xl text-4xl text-claret-deep sm:text-5xl lg:text-6xl">{title}</h1>
          {lede && <p className="lede mt-4 max-w-2xl text-smoke">{lede}</p>}
          {children && <div className="mt-6">{children}</div>}
        </Container>
      </section>
    );
  }

  const photo = variant === "photo" && image;
  return (
    <section className={cn("relative isolate overflow-hidden bg-claret-deep text-cream", className)}>
      {photo && <Image src={image.src} alt={image.alt} fill priority sizes="100vw" quality={65} className="object-cover" />}
      <div className={cn("absolute inset-0", photo ? "hero-overlay" : "")} aria-hidden="true" />
      <Hatch color="#F5EAD3" opacity={photo ? 0.05 : 0.08} size={16} />
      <Container className="relative py-10 md:py-16">
        <Breadcrumbs items={crumbs} tone="dark" />
        {eyebrow && <p className="eyebrow mt-6 flex items-center gap-2 text-brass"><span className="h-px w-8 bg-brass" aria-hidden="true" />{eyebrow}</p>}
        <h1 className="display-title mt-3 max-w-4xl text-4xl sm:text-5xl lg:text-6xl">{title}</h1>
        {lede && <p className="lede mt-4 max-w-2xl text-cream/85">{lede}</p>}
        {children && <div className="mt-6">{children}</div>}
      </Container>
    </section>
  );
}
