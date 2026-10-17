import { Breadcrumbs, type Crumb } from "@/components/ui/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/seo";
import { formatDate, slugify } from "@/lib/utils";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

interface LegalPageProps {
  title: string;
  description: string;
  path: string;
  updatedOn: string;
  intro: string;
  sections: LegalSection[];
}

/** Narrow-column legal document with a sticky table of contents and JSON-LD. */
export function LegalPage({ title, description, path, updatedOn, intro, sections }: LegalPageProps) {
  const crumbs: Crumb[] = [
    { name: "Home", path: "/" },
    { name: title, path },
  ];
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildWebPageSchema({ name: title, description, path })} />
      <section className="bg-linen">
        <Container size="narrow" className="py-10 md:py-14">
          <Breadcrumbs items={crumbs} />
          <h1 className="display-title mt-6 text-4xl text-claret-deep md:text-5xl">{title}</h1>
          <p className="mt-3 text-sm text-smoke">Last updated {formatDate(updatedOn)}</p>
          <p className="lede mt-4 text-smoke">{intro}</p>
        </Container>
      </section>
      <section className="bg-cream py-section-sm md:py-section" aria-label="Document">
        <Container className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label="Contents" className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-smoke">Contents</p>
            <ol className="mt-3 space-y-2 border-s-2 border-line ps-4 text-sm">
              {sections.map((s, i) => (
                <li key={s.heading}>
                  <a href={`#${slugify(s.heading)}`} className="text-ink hover:text-claret hover:underline"><span className="me-1.5 font-display italic text-brass-deep">{i + 1}.</span>{s.heading}</a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="prose-tt max-w-3xl">
            {sections.map((s) => (
              <section key={s.heading} id={slugify(s.heading)} className="scroll-mt-32">
                <h2>{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
                {s.bullets && (
                  <ul>
                    {s.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
