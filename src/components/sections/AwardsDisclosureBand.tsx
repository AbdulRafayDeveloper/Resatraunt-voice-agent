import { Hatch } from "@/components/graphics/Hatch";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";

/** Trademark and affiliation disclosure on a dark band, with a route for corrections. */
export function AwardsDisclosureBand() {
  return (
    <section className="relative overflow-hidden bg-charcoal py-section-sm text-cream md:py-section" aria-label="Trademarks and corrections">
      <Hatch />
      <Container className="relative grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-center lg:gap-16">
        <div>
          <p className="eyebrow text-brass">Disclosure</p>
          <p className="mt-4 max-w-2xl font-display text-2xl leading-snug text-cream md:text-3xl">
            Michelin and James Beard are trademarks of their owners; TableTalk is not affiliated with either. Each entry links to the source we checked on {formatDate(siteConfig.dataCheckedOn)}.
          </p>
          <p className="mt-4 max-w-xl text-cream/75">If an award has been gained, lost or misattributed since that date, tell us and we will correct the register.</p>
        </div>
        <div className="lg:justify-self-end">
          <LinkButton href="/contact" variant="outlineLight" size="lg" icon="arrow_forward">Report a correction</LinkButton>
        </div>
      </Container>
    </section>
  );
}
