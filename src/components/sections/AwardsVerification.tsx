import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verificationSteps } from "@/data/company";

/** Numbered 01 to 04 list of how awards are checked, hung off a brass rule. */
export function AwardsVerification() {
  return (
    <section className="py-section-sm md:py-section" aria-label="How we verify">
      <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading number="03" eyebrow="How we verify" title={<>Four rules, <em>no exceptions</em>.</>} size="md" />
        <ol className="border-s-2 border-brass">
          {verificationSteps.map((step, i) => (
            <li key={step.title} className="relative ps-8 pb-8 last:pb-0 md:ps-10">
              <span className="absolute -start-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-brass bg-cream" aria-hidden="true" />
              <p className="font-display text-lg italic text-brass-deep">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-xl font-bold text-claret-deep">{step.title}</h3>
              <p className="mt-2 max-w-xl leading-relaxed text-ink">{step.detail}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
