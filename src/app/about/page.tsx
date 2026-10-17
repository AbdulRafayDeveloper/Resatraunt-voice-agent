import Link from "next/link";
import { Hatch } from "@/components/graphics/Hatch";
import { PageHero } from "@/components/layout/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { cities } from "@/data/cities";
import { verificationSteps } from "@/data/company";
import { getImage } from "@/data/images";
import { restaurants } from "@/data/restaurants";
import { buildBreadcrumbSchema, buildMetadata, buildWebPageSchema } from "@/lib/seo";
import { cn, formatDate } from "@/lib/utils";

const title = "About TableTalk";
const description = "TableTalk is a dining guide that shows its sources and a table-request service that never pretends to be a booking. How we verify listings, what we never do, and who runs it.";
const path = "/about";

export const metadata = buildMetadata({ title, description, path, photo: "aboutHero", eyebrow: "About" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "About", path },
];

const neverDo = [
  { title: "No invented ratings or review counts", detail: "There are no star ratings, scores or testimonials on the site. We will only add reviews once we can verify who wrote them." },
  { title: "No restaurant photos without permission", detail: "Every photograph is licensed editorial stock and says so. None was taken at a listed restaurant." },
  { title: "No 'instant confirmation' claims", detail: "A request is a request. Only the restaurant confirms a booking, under its own terms, and we say that on every form." },
  { title: "No hidden fees", detail: "Diners are not charged by TableTalk. Any deposit or prepayment is the restaurant's, and it is summarised on the listing before you ask." },
];

export default function AboutPage() {
  const awards = restaurants.flatMap((r) => r.awards);
  const sourcedAwards = awards.filter((a) => a.sourceUrl).length;
  const figures = [
    { value: String(restaurants.length), label: "Restaurants listed", detail: "Each with hours, menu formats, booking rules and a verification date", compact: false },
    { value: String(cities.length), label: "Cities", detail: cities.map((c) => c.name).join(", "), compact: false },
    { value: String(sourcedAwards), label: "Awards with a source", detail: "Michelin and James Beard recognition, each with a year and a link", compact: false },
    { value: formatDate(siteConfig.dataCheckedOn), label: "Listings last checked", detail: "Against each restaurant's own website", compact: true },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildWebPageSchema({ name: title, description, path, type: "AboutPage" })} />

      <PageHero
        variant="split"
        crumbs={crumbs}
        eyebrow="About TableTalk"
        title={<>A guide that <em>shows its sources</em>.</>}
        lede="Restaurant listings built from the restaurants' own published facts and the awarding bodies, plus a request service that tells you plainly what it can and cannot do."
        image={getImage("aboutHero")}
      />

      <section className="bg-cream py-section-sm md:py-section" aria-label="What TableTalk is">
        <Container>
          <SectionHeading number="01" eyebrow="What TableTalk is" title={<>Two things, <em>and only two</em>.</>} />
          <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div className="prose-tt border-t-2 border-brass pt-6">
              <p className="eyebrow text-claret">A dining guide</p>
              <p>
                TableTalk lists restaurants in {cities.map((c) => c.name).join(", ")} with the facts a diner needs before booking: service hours, every menu format with its price as published, booking rules such as release windows and deposits, dress codes, and awards from the Michelin Guide and the James Beard Foundation.
              </p>
              <p>
                Every fact is read from the restaurant&rsquo;s own website or the awarding body on the date shown on the listing. Where we could not confirm something, the listing says &ldquo;to be confirmed&rdquo; and explains why.
              </p>
            </div>
            <div className="prose-tt border-t-2 border-brass pt-6">
              <p className="eyebrow text-claret">A table-request service</p>
              <p>
                If you would rather not work out the release windows yourself, send us a request with the date, time and party size. {siteConfig.replyPromise} We either pass the request to the restaurant or point you to the quickest way to secure the table.
              </p>
              <p>
                A request is never a booking. The restaurant confirms, under its own deposit and cancellation terms, and we show those terms before you ask.
              </p>
            </div>
          </div>
          <div className="mt-12 max-w-3xl border-t border-line">
            <p className="eyebrow pt-6 text-smoke">What we are not</p>
            <ul className="mt-2 divide-y divide-line">
              <li className="flex items-start gap-3 py-4">
                <Icon name="info" className="mt-0.5 text-[20px] text-brass-deep" />
                <p className="text-ink/90"><strong className="font-bold text-claret-deep">Not a booking platform, yet.</strong> We do not hold diaries or take payment for tables. Bookings happen on the restaurant&rsquo;s own system or with its team.</p>
              </li>
              <li className="flex items-start gap-3 py-4">
                <Icon name="payments" className="mt-0.5 text-[20px] text-brass-deep" />
                <p className="text-ink/90"><strong className="font-bold text-claret-deep">No commission today.</strong> Diners are not charged. Commercial terms for restaurants have not been finalised, and no restaurant is charged until they are published.</p>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-linen py-section-sm md:py-section" aria-label="By the numbers">
        <Container>
          <SectionHeading number="02" eyebrow="By the numbers" title={<>Counted, <em>not estimated</em>.</>} lede="These figures are derived from the listings themselves and change only when the data does." size="md" />
          <dl className="mt-10 grid divide-y divide-line border-y border-line sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {figures.map((figure) => (
              <div key={figure.label} className="flex flex-col py-6 sm:px-6 sm:first:ps-0 sm:last:pe-0">
                <dt className="order-2 mt-3 text-sm font-bold uppercase tracking-wider text-claret">{figure.label}</dt>
                <dd className={cn("order-1 font-display font-medium leading-none text-claret-deep", figure.compact ? "text-3xl md:text-4xl" : "text-5xl md:text-6xl")}>{figure.value}</dd>
                <dd className="order-3 mt-1 text-sm text-smoke">{figure.detail}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="bg-cream py-section-sm md:py-section" aria-label="How we verify">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading number="03" eyebrow="How we verify" title={<>Official site <em>first</em>.</>} lede="The same four steps for every listing, in the same order, with the date recorded on the page." size="md" />
          </div>
          <ol className="relative border-s-2 border-line">
            {verificationSteps.map((step, index) => (
              <li key={step.title} className="relative ps-8 pb-10 last:pb-0">
                <span className="absolute -start-[13px] top-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-brass bg-cream font-display text-xs italic text-brass-deep" aria-hidden="true">
                  {index + 1}
                </span>
                <p className="eyebrow text-brass-deep">Step {String(index + 1).padStart(2, "0")}</p>
                <h3 className="mt-1 font-display text-2xl font-medium text-claret-deep">{step.title}</h3>
                <p className="mt-2 max-w-xl leading-relaxed text-ink/85">{step.detail}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-line bg-claret-mist py-section-sm md:py-section" aria-label="What we never do">
        <Container>
          <SectionHeading number="04" eyebrow="What we never do" title={<>Four <em>promises</em>.</>} size="md" />
          <ul className="mt-8 max-w-3xl divide-y divide-line border-y border-line">
            {neverDo.map((item) => (
              <li key={item.title} className="grid gap-2 py-5 sm:grid-cols-[auto_1fr] sm:gap-5">
                <Icon name="close" className="mt-1 hidden text-[22px] text-claret sm:block" />
                <div>
                  <h3 className="font-bold text-claret-deep">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-smoke md:text-base">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="bg-cream py-section-sm md:py-section" aria-label="Who runs it">
        <Container size="narrow">
          <SectionHeading number="05" eyebrow="Who runs it" title={<>A small team, <em>published before launch</em>.</>} size="md" />
          <div className="prose-tt mt-6">
            <p>
              TableTalk is a new service, founded in {siteConfig.foundedYear} and run online. The founding team and the company details, including the legal entity and its registered address, will be published here before launch rather than invented for this page. Until then, the operator is {siteConfig.legalName}.
            </p>
            <p>
              If you need to reach a person now, including press and privacy enquiries, the <Link href="/contact">contact page</Link> lists the channels we run.
            </p>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-charcoal py-section-sm text-cream md:py-section" aria-label="For restaurants">
        <Hatch />
        <Container className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <SectionHeading
            number="06"
            eyebrow="For restaurants"
            title={<>Your listing, <em className="text-brass">checked against your site</em>.</>}
            lede="Listings created from public information are free. Tell us the official source for your hours, menus and awards and we will verify them before publishing, and link to your own booking system."
            tone="dark"
            size="md"
          />
          <div className="lg:justify-self-end">
            <LinkButton href="/for-restaurants" variant="brass" icon="arrow_forward">List your restaurant</LinkButton>
          </div>
        </Container>
      </section>

      <CtaBand image={getImage("hostStand")} />
    </>
  );
}
