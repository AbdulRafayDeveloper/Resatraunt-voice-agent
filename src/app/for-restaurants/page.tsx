import { Hatch } from "@/components/graphics/Hatch";
import { PageHero } from "@/components/layout/PageHero";
import { FaqSection } from "@/components/sections/FaqSection";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { siteConfig } from "@/config/site";
import { faqGroups } from "@/data/faqs";
import { getImage } from "@/data/images";
import { ListingForm } from "@/features/listing/ListingForm";
import { buildBreadcrumbSchema, buildFaqSchema, buildMetadata, buildWebPageSchema } from "@/lib/seo";

const title = "List your restaurant";
const description = "List your restaurant on TableTalk: verified hours, menu formats with published prices, booking rules, awards with sources and a link to your own booking system. Listings from public information are free.";
const path = "/for-restaurants";

export const metadata = buildMetadata({ title, description, path, photo: "forRestaurantsHero", eyebrow: "For restaurants" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "For restaurants", path },
];

const listingIncludes = [
  { label: "Verified hours", value: "Per service, with the date we checked them against your site" },
  { label: "Menu formats", value: "Tasting, à la carte, set lunch and bar menus with prices as you publish them" },
  { label: "Booking rules", value: "Release windows, deposits, party limits and dress code, in your words" },
  { label: "Awards with sources", value: "Michelin and James Beard recognition with the year and a link to the source" },
  { label: "Your own booking system", value: "A direct link to your site, Tock, Resy, SevenRooms or OpenTable page" },
  { label: "Table requests", value: "Forwarded to the contact you name, with the diner's date, party size and notes" },
];

const weAskFor = [
  { title: "Your official website URL", detail: "The page we should treat as the source of truth for hours, menus and policies." },
  { title: "A named contact", detail: "One person and one email address for corrections and forwarded table requests." },
  { title: "Current hours", detail: "By service, including seasonal changes and closures you already know about." },
  { title: "Menus and prices", detail: "Each format you sell and its published price per person, or a note that the price is only shown at booking." },
  { title: "Awards with dates", detail: "The award, the year and where it was announced. We verify against the awarding body before showing it." },
];

const whatHappensNext = [
  { title: "We read your site", detail: "Hours, menus, prices and booking rules are taken from the pages you point us to, and the check date is recorded." },
  { title: "We reply with a draft", detail: "You see the listing before it is published, with every fact marked by its source, and tell us what to change." },
  { title: "It goes live, and stays yours", detail: "Corrections are made on request and the listing links to your own booking system first." },
];

const restaurantFaqs = faqGroups.find((group) => group.id === "restaurants")?.items ?? [];

export default function ForRestaurantsPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildWebPageSchema({ name: title, description, path })} />
      {restaurantFaqs.length > 0 && <JsonLd data={buildFaqSchema(restaurantFaqs)} />}

      <PageHero
        variant="photo"
        crumbs={crumbs}
        eyebrow="For restaurants"
        title={<>List your <em className="text-brass">restaurant</em>.</>}
        lede="A listing built from your own published facts, checked before it goes live, and a table-request channel that always sends diners to you. Listings created from public information are free."
        image={getImage("forRestaurantsHero")}
      />

      <section className="bg-cream py-section-sm md:py-section" aria-label="What a listing includes">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading number="01" eyebrow="What a listing includes" title={<>The facts a diner <em>needs</em>.</>} lede="No ratings, no reviews, no photographs of your rooms unless you give them. Just what you publish, with the date we checked it." size="md" />
          </div>
          <dl className="divide-y divide-line border-y border-line">
            {listingIncludes.map((row) => (
              <div key={row.label} className="leader py-4">
                <dt className="font-bold text-claret-deep">{row.label}</dt>
                <dd className="max-w-[55%] text-end text-sm text-smoke md:text-base">{row.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="border-y border-line bg-linen py-section-sm md:py-section" aria-label="What we ask for">
        <Container>
          <SectionHeading number="02" eyebrow="What we ask for" title={<>Five things, <em>once</em>.</>} lede="Everything below is something you already have. Send what you can in the form and we will ask for the rest." size="md" />
          <ol className="mt-10 grid gap-x-12 lg:grid-cols-2">
            {weAskFor.map((item, index) => (
              <li key={item.title} className="flex gap-5 border-t border-line py-5">
                <span className="font-display text-3xl italic leading-none text-brass-deep">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-bold text-claret-deep">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-smoke md:text-base">{item.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="bg-cream py-section-sm md:py-section" aria-label="Commercial terms">
        <Container size="narrow">
          <SectionHeading number="03" eyebrow="Commercial terms" title={<>Not finalised, <em>and we say so</em>.</>} size="md" />
          <div className="mt-6 border-s-4 border-brass bg-brass-pale/60 px-5 py-5 md:px-7">
            <p className="flex items-start gap-3 leading-relaxed text-ink">
              <Icon name="info" className="mt-1 text-[22px] text-brass-deep" />
              <span>
                Commercial terms for restaurants are not finalised. Listings created from public information are free, and no restaurant is charged until terms are published on this page. If that changes, every listed restaurant will be told in writing first.
              </span>
            </p>
          </div>
        </Container>
      </section>

      <section className="border-t border-line bg-claret-mist py-section-sm md:py-section" aria-label="Listing enquiry">
        <Container className="grid gap-12 lg:grid-cols-[1fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading number="04" eyebrow="List your restaurant" title={<>Tell us where to <em>look</em>.</>} size="md" />
            <div className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-card md:p-8">
              <ListingForm />
            </div>
          </div>
          <aside className="relative overflow-hidden rounded-2xl bg-charcoal p-6 text-cream md:p-8 lg:sticky lg:top-32 lg:self-start" aria-label="What happens next">
            <Hatch />
            <div className="relative">
              <p className="eyebrow text-brass">What happens next</p>
              <ol className="mt-5 divide-y divide-cream/15">
                {whatHappensNext.map((step, index) => (
                  <li key={step.title} className="flex gap-4 py-4">
                    <span className="font-display text-2xl italic leading-none text-brass">{String(index + 1).padStart(2, "0")}</span>
                    <div>
                      <h3 className="font-bold text-cream">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-cream/75">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <p className="mt-5 flex items-start gap-2 border-t border-cream/15 pt-5 text-sm text-cream/80">
                <Icon name="mark_email_read" className="mt-0.5 text-[18px] text-brass" />
                <span>{siteConfig.replyPromise} Listing enquiries get the same promise.</span>
              </p>
            </div>
          </aside>
        </Container>
      </section>

      {restaurantFaqs.length > 0 && <FaqSection items={restaurantFaqs} number="05" eyebrow="Restaurant FAQs" title={<>Questions restaurants <em>ask</em>.</>} showAllLink />}
    </>
  );
}
