import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/ui/JsonLd";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { requestHref } from "@/config/navigation";
import { isPlaceholderEmail, mailtoUrl, siteConfig, whatsappUrl } from "@/config/site";
import { ContactForm } from "@/features/contact/ContactForm";
import { buildBreadcrumbSchema, buildMetadata, buildWebPageSchema } from "@/lib/seo";

const title = "Contact TableTalk";
const description = "Email, WhatsApp where available, table requests and listing corrections. TableTalk operates online; a person replies by email within one working day.";
const path = "/contact";

export const metadata = buildMetadata({ title, description, path, photo: "contactHero", eyebrow: "Contact" });

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Contact", path },
];

const responseNotes = [
  { icon: "mark_email_read", title: "Table requests", detail: siteConfig.replyPromise },
  { icon: "fact_check", title: "Listing corrections", detail: "Checked against the restaurant's own site before a listing changes. We reply with what we found, and the check date on the listing is updated." },
  { icon: "mail", title: "Press and privacy", detail: "Answered by email. Privacy requests are handled as described in the privacy policy, and we will confirm your identity before releasing or deleting data." },
];

export default function ContactPage() {
  const email = siteConfig.email;
  const whatsapp = whatsappUrl("Hello TableTalk, I have a question.");
  const placeholder = isPlaceholderEmail();

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildWebPageSchema({ name: title, description, path, type: "ContactPage" })} />

      <PageHero
        variant="band"
        crumbs={crumbs}
        eyebrow="Contact"
        title={<>Talk to a <em className="text-brass">person</em>.</>}
        lede="Every message is read and answered by a person, by email. TableTalk operates online; there is no walk-in office and no phone line."
      />

      <section className="bg-cream py-section-sm md:py-section" aria-label="Channels">
        <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading number="01" eyebrow="Channels" title={<>Where to <em>write</em>.</>} lede="Use the channel that matches what you need; it reaches the right person faster." size="md" />
            <p className="mt-6 text-sm text-smoke">TableTalk operates online; there is no walk-in office.</p>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            <li className="grid gap-3 py-5 sm:grid-cols-[auto_1fr] sm:gap-5">
              <Icon name="mail" className="text-[26px] text-brass-deep" />
              <div className="min-w-0">
                <h3 className="font-bold text-claret-deep">Email</h3>
                <a href={mailtoUrl()} className="mt-1 block break-all font-display text-xl text-claret underline-offset-2 hover:underline md:text-2xl">{email}</a>
                {placeholder && (
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-smoke">
                    <Icon name="info" className="mt-0.5 text-[14px]" /> Placeholder address until the inbox is live.
                  </p>
                )}
                <p className="mt-2 text-sm text-smoke">For anything that does not fit the form, including press and privacy requests.</p>
              </div>
            </li>
            {whatsapp && (
              <li className="grid gap-3 py-5 sm:grid-cols-[auto_1fr] sm:gap-5">
                <Icon name="chat" className="text-[26px] text-brass-deep" />
                <div>
                  <h3 className="font-bold text-claret-deep">WhatsApp</h3>
                  <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 font-semibold text-claret underline-offset-2 hover:underline">
                    Message us on WhatsApp <Icon name="open_in_new" className="text-[16px]" />
                  </a>
                  <p className="mt-2 text-sm text-smoke">Quick questions about an existing request. Confirmations still arrive by email.</p>
                </div>
              </li>
            )}
            <li className="grid gap-3 py-5 sm:grid-cols-[auto_1fr] sm:gap-5">
              <Icon name="table_restaurant" className="text-[26px] text-brass-deep" />
              <div>
                <h3 className="font-bold text-claret-deep">Table requests</h3>
                <Link href={requestHref} className="mt-1 inline-flex items-center gap-1 font-semibold text-claret underline-offset-2 hover:underline">
                  Request a table <Icon name="arrow_forward" className="text-[16px]" />
                </Link>
                <p className="mt-2 text-sm text-smoke">New requests go through the request form so nothing is missed. To change or cancel one, use the contact form below with your reference.</p>
              </div>
            </li>
            <li className="grid gap-3 py-5 sm:grid-cols-[auto_1fr] sm:gap-5">
              <Icon name="edit_note" className="text-[26px] text-brass-deep" />
              <div>
                <h3 className="font-bold text-claret-deep">Listing corrections</h3>
                <a href="#contact-form" className="mt-1 inline-flex items-center gap-1 font-semibold text-claret underline-offset-2 hover:underline">
                  Use the form and choose &ldquo;A listing correction&rdquo; <Icon name="arrow_forward" className="text-[16px]" />
                </a>
                <p className="mt-2 text-sm text-smoke">Name the restaurant, say what is wrong and include a link to the source if you have one.</p>
              </div>
            </li>
          </ul>
        </Container>
      </section>

      <section id="contact-form" className="scroll-mt-28 border-t border-line bg-claret-mist py-section-sm md:py-section" aria-label="Contact form section">
        <Container className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-16">
          <div>
            <SectionHeading number="02" eyebrow="Write to us" title={<>Send a <em>message</em>.</>} size="md" />
            <div className="mt-8 rounded-2xl border border-line bg-white p-5 shadow-card md:p-8">
              <ContactForm />
            </div>
          </div>
          <aside className="lg:sticky lg:top-32 lg:self-start" aria-label="Response times">
            <p className="eyebrow text-brass-deep">Response times</p>
            <dl className="mt-4 divide-y divide-line border-y border-line">
              {responseNotes.map((note) => (
                <div key={note.title} className="flex gap-4 py-4">
                  <Icon name={note.icon} className="mt-0.5 text-[22px] text-brass-deep" />
                  <div>
                    <dt className="font-bold text-claret-deep">{note.title}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-smoke">{note.detail}</dd>
                  </div>
                </div>
              ))}
            </dl>
            <p className="mt-5 text-xs text-smoke">
              Working days are Monday to Friday. Same-day table requests are better placed directly with the restaurant.
            </p>
          </aside>
        </Container>
      </section>
    </>
  );
}
