import Image from "next/image";
import type { ReactNode } from "react";
import { Hatch } from "@/components/graphics/Hatch";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { requestHref } from "@/config/navigation";
import type { SiteImage } from "@/data/images";

interface CtaBandProps {
  title?: ReactNode;
  text?: string;
  image?: SiteImage;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

/** Closing band for inner pages: round photo on the left, actions on the right. */
export function CtaBand({
  title = <>Ready to <em className="text-brass">book</em>?</>,
  text = "Tell us the restaurant, date and party size. We reply within one working day with the quickest route to the table, and the restaurant confirms under its own terms.",
  image,
  primaryHref = requestHref,
  primaryLabel = "Request a table",
  secondaryHref = "/restaurants",
  secondaryLabel = "Browse restaurants",
}: CtaBandProps) {
  return (
    <section className="relative overflow-hidden bg-claret py-section-sm text-cream md:py-section" aria-label="Request a table">
      <Hatch color="#F5EAD3" opacity={0.07} size={16} />
      <Container className="relative grid items-center gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        {image ? (
          <div className="plate relative mx-auto aspect-square w-full max-w-xs lg:max-w-sm">
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 1024px) 384px, 70vw" className="object-cover" />
          </div>
        ) : (
          <div className="hidden lg:block">
            <p className="font-display text-7xl italic text-brass/80">{siteConfig.name}</p>
          </div>
        )}
        <div>
          <h2 className="display-title text-4xl md:text-5xl">{title}</h2>
          <p className="lede mt-4 max-w-xl text-cream/85">{text}</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <LinkButton href={primaryHref} variant="brass" size="lg" icon="arrow_forward">{primaryLabel}</LinkButton>
            <LinkButton href={secondaryHref} variant="outlineLight" size="lg">{secondaryLabel}</LinkButton>
          </div>
          <p className="mt-4 text-sm text-cream/70">A request is not a confirmed booking. {siteConfig.replyPromise}</p>
        </div>
      </Container>
    </section>
  );
}
