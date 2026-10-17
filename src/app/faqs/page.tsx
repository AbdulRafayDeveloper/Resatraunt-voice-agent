import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Accordion } from "@/components/ui/Accordion";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { allFaqs, faqGroups } from "@/data/faqs";
import { getImage } from "@/data/images";
import { buildBreadcrumbSchema, buildFaqSchema, buildMetadata } from "@/lib/seo";
import { pluralise } from "@/lib/utils";

const title = "Frequently asked questions";
const description = "Answers about table requests, listing accuracy, dining customs in the UK and US, and listing a restaurant on TableTalk.";
const path = "/faqs";

export const metadata = buildMetadata({ title, description, path, eyebrow: "FAQs" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "FAQs", path },
];

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildFaqSchema(allFaqs)} />

      <PageHero
        variant="band"
        crumbs={crumbs}
        eyebrow={`${pluralise(allFaqs.length, "question")} · ${pluralise(faqGroups.length, "topic")}`}
        title={<>Questions, <em className="text-brass">answered plainly</em>.</>}
        lede="What a request is and is not, where the facts come from, how dining customs differ between the UK and the US, and how restaurants get listed."
      />

      <div className="bg-cream py-section-sm md:py-section">
        <Container className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label="FAQ topics" className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-smoke">Topics</p>
            <ul className="mt-3 space-y-1 border-s-2 border-line">
              {faqGroups.map((group) => (
                <li key={group.id}>
                  <a href={`#${group.id}`} className="-ms-0.5 flex items-center gap-2.5 border-s-2 border-transparent py-1.5 ps-4 text-sm text-ink hover:border-brass hover:text-claret">
                    <Icon name={group.icon} className="text-[18px] text-brass-deep" />
                    <span>{group.title}</span>
                    <span className="ms-auto text-xs text-smoke">{group.items.length}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="space-y-16">
            {faqGroups.map((group, index) => (
              <section key={group.id} id={group.id} aria-label={group.title} className="scroll-mt-32">
                <SectionHeading number={String(index + 1).padStart(2, "0")} size="md" eyebrow={pluralise(group.items.length, "question")} title={group.title} />
                <Accordion items={group.items} defaultOpen={-1} className="mt-6 border-y border-line" />
              </section>
            ))}
          </div>
        </Container>
      </div>

      <CtaBand image={getImage("coupleDinner")} />
    </>
  );
}
