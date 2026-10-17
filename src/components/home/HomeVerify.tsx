import Image from "next/image";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verificationSteps } from "@/data/company";
import { siteImages } from "@/data/images";

/** Split: vertical timeline of the verification steps beside a tall photo. */
export function HomeVerify() {
  return (
    <section className="bg-cream py-section-sm md:py-section" aria-label="How we verify">
      <Container className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
        <div>
          <SectionHeading number="07" eyebrow="Why trust a listing" title={<>Facts with a <em>date and a source</em>.</>} lede="No star ratings, no review counts, no stock claims. What you see is what the restaurant or the awarding body has published, checked on the date shown." />
          <ol className="mt-8 space-y-6 border-s-2 border-brass/50 ps-6">
            {verificationSteps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="absolute -left-[2.05rem] top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-brass font-display text-xs italic text-charcoal">{i + 1}</span>
                <p className="font-bold text-claret-deep">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-smoke">{s.detail}</p>
              </li>
            ))}
          </ol>
          <LinkButton href="/about" variant="outline" className="mt-8" icon="arrow_forward">How we work</LinkButton>
        </div>
        <div className="carte relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden">
          <Image src={siteImages.hostStand.src} alt={siteImages.hostStand.alt} fill sizes="(min-width: 1024px) 480px, 80vw" className="object-cover" />
        </div>
      </Container>
    </section>
  );
}
