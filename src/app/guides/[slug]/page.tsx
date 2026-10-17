import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideCard } from "@/components/cards/GuideCard";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { findGuide, guides } from "@/data/guides";
import { getImage, isSiteImageKey } from "@/data/images";
import { buildArticleSchema, buildBreadcrumbSchema, buildMetadata } from "@/lib/seo";
import { formatDate, slugify } from "@/lib/utils";

interface GuidePageProps {
  params: Promise<{ slug: string }>;
}

/** Every slug is prerendered; anything else is a 404 rather than a streamed not-found shell. */
export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) return { title: "Guide not found", robots: { index: false, follow: false } };
  return buildMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${guide.slug}`,
    photo: isSiteImageKey(guide.image) ? guide.image : undefined,
    eyebrow: guide.category,
    type: "article",
  });
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = findGuide(slug);
  if (!guide) notFound();

  const path = `/guides/${guide.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: guide.title, path },
  ];
  const others = guides.filter((g) => g.slug !== guide.slug);

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildArticleSchema(guide)} />

      <PageHero
        variant="band"
        crumbs={crumbs}
        eyebrow={`${guide.category} · ${guide.readMinutes} min read · Updated ${formatDate(guide.updatedOn)}`}
        title={guide.title}
        lede={guide.excerpt}
      />

      <section className="bg-cream py-section-sm md:py-section" aria-label="Guide">
        <Container className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label="In this guide" className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-smoke">In this guide</p>
            <ol className="mt-3 space-y-2 border-s-2 border-line ps-4 text-sm">
              {guide.sections.map((section, index) => (
                <li key={section.heading}>
                  <a href={`#${slugify(section.heading)}`} className="text-ink hover:text-claret hover:underline">
                    <span className="me-1.5 font-display italic text-brass-deep">{index + 1}.</span>
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-xs leading-relaxed text-smoke">
              Restaurant figures are as published on each restaurant&rsquo;s own site on {formatDate(guide.updatedOn)}. The terms are the restaurant&rsquo;s, not ours.
            </p>
          </nav>
          <article className="prose-tt max-w-3xl">
            {guide.sections.map((section) => (
              <section key={section.heading} id={slugify(section.heading)} className="scroll-mt-32">
                <h2>{section.heading}</h2>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                ))}
                {section.bullets && (
                  <ul>
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </article>
        </Container>
      </section>

      {others.length > 0 && (
        <section className="border-t border-line bg-linen py-section-sm md:py-section" aria-label="Keep reading">
          <Container>
            <SectionHeading eyebrow="Keep reading" title={<>More <em>guides</em>.</>} size="md" />
            <div className="mt-6 border-t border-line">
              {others.map((other) => (
                <GuideCard key={other.slug} guide={other} layout="row" />
              ))}
            </div>
          </Container>
        </section>
      )}

      <CtaBand image={getImage(guide.image)} />
    </>
  );
}
