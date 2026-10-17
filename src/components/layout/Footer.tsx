import Link from "next/link";
import { Logo } from "@/components/graphics/Logo";
import { Hatch } from "@/components/graphics/Hatch";
import { Icon } from "@/components/ui/Icon";
import { siteConfig, whatsappUrl } from "@/config/site";
import { legalNav, primaryNav, requestHref, secondaryNav } from "@/config/navigation";
import { cities } from "@/data/cities";
import { collections } from "@/data/collections";
import { NewsletterForm } from "@/features/newsletter/NewsletterForm";
import { formatDate } from "@/lib/utils";

const headingClass = "eyebrow mb-4 text-brass";
const linkClass = "text-sm text-cream/75 transition-colors hover:text-cream";

export function Footer() {
  const whatsapp = whatsappUrl("Hello TableTalk, I would like help with a table request.");
  return (
    <footer className="relative overflow-hidden bg-charcoal text-cream">
      <Hatch color="#B8893A" opacity={0.08} size={16} />

      {/* Newsletter band */}
      <div className="relative border-b border-cream/10">
        <div className="mx-auto grid max-w-container-max gap-8 px-4 py-12 sm:px-6 md:px-margin-desktop lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
          <div>
            <p className="eyebrow text-brass">New openings and releases</p>
            <p className="display-title mt-2 text-3xl text-cream md:text-4xl">
              Know when the <em className="text-brass">diary opens</em>.
            </p>
            <p className="mt-3 max-w-md text-cream/75">One email a month: new listings, release dates for hard-to-book tables, and menu price changes we have verified. Unsubscribe in one click.</p>
          </div>
          <NewsletterForm />
        </div>
      </div>

      {/* Link columns */}
      <div className="relative mx-auto grid max-w-container-max gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:px-margin-desktop lg:grid-cols-[1.3fr_0.8fr_0.9fr_0.9fr_1.1fr]">
        <div className="space-y-5">
          <Logo tone="light" size="md" />
          <p className="max-w-xs text-sm leading-relaxed text-cream/75">{siteConfig.tagline} A dining guide with verified hours, published prices, booking rules and awards with their sources, and a table-request service that never pretends to be a booking.</p>
          <ul className="space-y-1.5 text-sm text-cream/80">
            <li className="flex items-start gap-2">
              <Icon name="fact_check" className="mt-0.5 text-[16px] text-brass" />
              <span>Listings checked {formatDate(siteConfig.dataCheckedOn)}</span>
            </li>
            <li className="flex items-start gap-2">
              <Icon name="visibility" className="mt-0.5 text-[16px] text-brass" />
              <span>Illustrative photography; not of the restaurants</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Explore</h3>
          <ul className="space-y-2.5">
            {primaryNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>{l.label}</Link>
              </li>
            ))}
            <li>
              <Link href={requestHref} className={linkClass}>Request a table</Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Cities</h3>
          <ul className="space-y-2.5">
            {cities.map((c) => (
              <li key={c.slug}>
                <Link href={`/cities/${c.slug}`} className={linkClass}>{c.name}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Collections</h3>
          <ul className="space-y-2.5">
            {collections.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className={linkClass}>{c.title}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={headingClass}>Company</h3>
          <ul className="space-y-2.5">
            {secondaryNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>{l.label}</Link>
              </li>
            ))}
            {legalNav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className={linkClass}>{l.label}</Link>
              </li>
            ))}
          </ul>
          <address className="mt-5 space-y-2 text-sm not-italic text-cream/80">
            <p className="flex items-start gap-2">
              <Icon name="mail" className="mt-0.5 text-[18px] text-brass" />
              <a href={`mailto:${siteConfig.email}`} className="hover:text-cream">{siteConfig.email}</a>
            </p>
            {whatsapp && (
              <p className="flex items-start gap-2">
                <Icon name="chat" className="mt-0.5 text-[18px] text-brass" />
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-cream">WhatsApp</a>
              </p>
            )}
            {siteConfig.instagramUrl && (
              <p className="flex items-start gap-2">
                <Icon name="public" className="mt-0.5 text-[18px] text-brass" />
                <a href={siteConfig.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-cream">Instagram</a>
              </p>
            )}
          </address>
        </div>
      </div>

      {/* Legal line */}
      <div className="relative border-t border-cream/10">
        <div className="mx-auto flex max-w-container-max flex-col gap-3 px-4 py-5 text-xs text-cream/60 sm:px-6 md:px-margin-desktop lg:flex-row lg:items-center lg:justify-between">
          <p>© {new Date().getFullYear()} {siteConfig.legalName}. Prices and hours are shown as published by each restaurant on the date stated on its listing.</p>
          <p>Michelin and James Beard are trademarks of their owners; TableTalk is not affiliated with either.</p>
        </div>
      </div>
    </footer>
  );
}
