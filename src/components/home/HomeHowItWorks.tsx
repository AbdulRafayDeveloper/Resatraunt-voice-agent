import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { LinkButton } from "@/components/ui/Button";
import { requestHref } from "@/config/navigation";
import { howItWorks } from "@/data/company";

/** Four steps on a horizontal route line; stacks vertically on phones. */
export function HomeHowItWorks() {
  return (
    <section className="bg-claret-mist py-section-sm md:py-section" aria-label="How it works">
      <Container>
        <SectionHeading number="02" eyebrow="How a request works" title={<>A request, <em>honestly</em> handled.</>} lede="We do not sell seats and we do not pretend to. Here is exactly what happens between your form and the restaurant's confirmation." align="center" />
        <ol className="relative mt-12 grid gap-10 md:grid-cols-4 md:gap-6">
          <span className="perforated absolute left-6 top-6 hidden h-px w-[calc(100%-3rem)] md:block" aria-hidden="true" />
          {howItWorks.map((step, i) => (
            <li key={step.title} className="relative flex gap-4 md:block">
              <span className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-brass bg-cream font-display text-lg italic text-claret-deep">{i + 1}</span>
              <div className="md:mt-4">
                <p className="flex items-center gap-2 font-bold text-claret-deep">
                  <Icon name={step.icon} className="text-[20px] text-brass-deep" /> {step.title}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-smoke">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <LinkButton href={requestHref} icon="arrow_forward">Start a request</LinkButton>
        </div>
      </Container>
    </section>
  );
}
