import type { ReactNode } from "react";
import { Accordion } from "@/components/ui/Accordion";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { FaqItem } from "@/types";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  items: FaqItem[];
  title?: ReactNode;
  eyebrow?: string;
  number?: string;
  lede?: string;
  tone?: "light" | "dark";
  showAllLink?: boolean;
  className?: string;
}

/** Two-column FAQ band: heading left, accordion right. Pair with buildFaqSchema on the page. */
export function FaqSection({ items, title = <>Questions, <em>answered</em>.</>, eyebrow = "FAQ", number, lede, tone = "light", showAllLink = true, className }: FaqSectionProps) {
  const dark = tone === "dark";
  return (
    <section className={cn(dark ? "bg-charcoal text-cream" : "bg-claret-mist", "py-section-sm md:py-section", className)} aria-label="Frequently asked questions">
      <Container className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading number={number} eyebrow={eyebrow} title={title} lede={lede} tone={tone} size="md" />
          {showAllLink && <LinkButton href="/faqs" variant={dark ? "outlineLight" : "outline"} className="mt-6" icon="arrow_forward">All FAQs</LinkButton>}
        </div>
        <Accordion items={items} tone={tone} className={cn("border-y", dark ? "border-cream/15" : "border-line")} />
      </Container>
    </section>
  );
}
