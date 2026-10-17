import { Hatch } from "@/components/graphics/Hatch";
import { GuideCard } from "@/components/cards/GuideCard";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { guides } from "@/data/guides";
import { getImage } from "@/data/images";
import { buildBreadcrumbSchema, buildMetadata, buildWebPageSchema } from "@/lib/seo";
import { pluralise } from "@/lib/utils";

const title = "Guides to booking and dining out";
const description = "Plain-English guides to how fine dining actually works: release windows, deposits and cancellation fees, tasting menus, dress codes and which seat to book.";
const path = "/guides";

export const metadata = buildMetadata({ title, description, path, photo: "guidesHero", eyebrow: "Guides" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Guides", path },
];

export default function GuidesPage() {
  const [featured, ...rest] = guides;
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildWebPageSchema({ name: title, description, path, type: "CollectionPage" })} />

      <PageHero
        variant="linen"
        crumbs={crumbs}
        eyebrow={pluralise(guides.length, "guide")}
        title={<>How dining out <em>actually works</em>.</>}
        lede="Short, sourced explanations of the rules that decide whether you get the table: when diaries open, what a card on file means, and what you are agreeing to when you book a tasting menu."
      />

      <section className="bg-cream py-section-sm md:py-section" aria-label="Guides">
        <Container>
          <SectionHeading
            number="01"
            eyebrow="Start here"
            title={<>Read this <em>first</em>.</>}
            lede="Everything in these guides comes from the restaurants' own published terms or from the awarding bodies. Where a restaurant is named, the figure is the one on its site on the date shown."
          />
          <div className="mt-12">
            <GuideCard guide={featured} layout="feature" priority />
          </div>
          {rest.length > 0 && (
            <div className="mt-16 border-t border-line">
              <p className="eyebrow pt-6 text-smoke">More guides</p>
              <div className="mt-2">
                {rest.map((guide) => (
                  <GuideCard key={guide.slug} guide={guide} layout="row" />
                ))}
              </div>
            </div>
          )}
        </Container>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-section-sm text-cream md:py-section" aria-label="More help">
        <Hatch />
        <Container className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <SectionHeading
            number="02"
            eyebrow="Still unsure"
            title={<>Have a question we have <em className="text-brass">not answered</em>?</>}
            lede="The FAQs cover requests, listings and dining customs in both countries. If it is not there, write to us and a person will answer."
            tone="dark"
            size="md"
          />
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <LinkButton href="/faqs" variant="brass" icon="arrow_forward">Read the FAQs</LinkButton>
            <LinkButton href="/contact" variant="outlineLight" icon="mail" iconPosition="start">Contact us</LinkButton>
          </div>
        </Container>
      </section>

      <CtaBand image={getImage("menuHands")} />
    </>
  );
}
