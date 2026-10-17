import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface CollectionEditorNoteProps {
  paragraphs: string[];
}

/** The editor's reasoning in a narrow column against a brass vertical rule. */
export function CollectionEditorNote({ paragraphs }: CollectionEditorNoteProps) {
  return (
    <section className="py-section-sm md:py-section" aria-label="Why these restaurants">
      <Container className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading number="01" eyebrow="Why these" title={<>How the list was <em>chosen</em>.</>} size="md" />
        <div className="max-w-xl space-y-5 border-s-2 border-brass ps-6 text-lg leading-relaxed text-ink md:ps-8">
          {paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </Container>
    </section>
  );
}
