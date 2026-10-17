import { PageHero } from "@/components/layout/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { getCity } from "@/data/cities";
import { howItWorks } from "@/data/company";
import { homeFaqs } from "@/data/faqs";
import { getImage } from "@/data/images";
import { restaurants } from "@/data/restaurants";
import { TableRequestForm, type TableRequestOption } from "@/features/requests/TableRequestForm";
import { buildBreadcrumbSchema, buildFaqSchema, buildMetadata, buildWebPageSchema } from "@/lib/seo";
import { formatDays, formatTime } from "@/lib/utils";

const title = "Request a table";
const description = `Tell us the restaurant, date, time and party size. ${siteConfig.replyPromise} A request is not a confirmed booking: the restaurant confirms under its own terms.`;

export const metadata = buildMetadata({
  title,
  description,
  path: "/request-a-table",
  photo: "requestHero",
  eyebrow: "Free, and not a booking",
});

interface PageProps {
  searchParams: Promise<{ restaurant?: string | string[] }>;
}

const options: TableRequestOption[] = restaurants.map((r) => {
  const first = r.hours[0];
  return {
    slug: r.slug,
    name: r.name,
    cityName: getCity(r.citySlug).name,
    provider: r.reservations.provider,
    bookingUrl: r.reservations.bookingUrl,
    walkIns: r.reservations.walkIns,
    policy: r.reservations.policy,
    hoursSummary: first ? `${first.service} ${formatDays(first.days)} ${formatTime(first.opens)}–${formatTime(first.closes)}` : "Hours not published",
    maxPartyOnline: r.reservations.maxPartyOnline,
  };
});

export default async function RequestATablePage({ searchParams }: PageProps) {
  const { restaurant } = await searchParams;
  const requested = Array.isArray(restaurant) ? restaurant[0] : restaurant;
  const initialRestaurant = requested && restaurants.some((r) => r.slug === requested) ? requested : "";
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Request a table", path: "/request-a-table" },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildWebPageSchema({ name: title, description, path: "/request-a-table" })} />
      <JsonLd data={buildFaqSchema(homeFaqs)} />

      <PageHero
        variant="split"
        image={getImage("requestHero")}
        crumbs={crumbs}
        eyebrow="Free · one working day"
        title={<>Request a <em>table</em>.</>}
        lede="Tell us where, when and for how many. We reply by email within one working day and either pass the request to the restaurant or point you to the fastest way to secure the table. A request is not a confirmed booking: only the restaurant can confirm, under its own terms."
      />

      <section className="py-section-sm md:py-section" aria-label="Table request">
        <Container>
          <TableRequestForm initialRestaurant={initialRestaurant} options={options} />
        </Container>
      </section>

      <section className="border-y border-line bg-linen py-section-sm md:py-section" aria-label="How it works">
        <Container>
          <SectionHeading number="02" eyebrow="How it works" title={<>From request to <em>confirmation</em>.</>} size="md" />
          <ol className="relative mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
            <span className="absolute left-5 top-0 hidden h-px w-[calc(100%-2.5rem)] border-t border-dashed border-brass/60 md:block md:top-5" aria-hidden="true" />
            {howItWorks.map((step, index) => (
              <li key={step.title} className="relative flex gap-4 md:block">
                <span className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-brass bg-linen font-display text-lg italic text-brass-deep">
                  {index + 1}
                </span>
                <div className="md:mt-5">
                  <p className="flex items-center gap-2 font-display text-xl text-claret-deep">
                    <Icon name={step.icon} className="text-[22px] text-brass-deep" />
                    {step.title}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ink/85">{step.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <FaqSection items={homeFaqs} number="03" showAllLink />
    </>
  );
}
