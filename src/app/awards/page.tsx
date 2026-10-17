import { PageHero } from "@/components/layout/PageHero";
import { AwardsDefinitions } from "@/components/sections/AwardsDefinitions";
import { AwardsDisclosureBand } from "@/components/sections/AwardsDisclosureBand";
import { awardEntries, AwardsRegister } from "@/components/sections/AwardsRegister";
import { AwardsVerification } from "@/components/sections/AwardsVerification";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { getImage } from "@/data/images";
import { restaurants } from "@/data/restaurants";
import { BASE_URL, buildBreadcrumbSchema, buildMetadata, buildWebPageSchema } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

const title = "Michelin Stars and James Beard Awards, With Sources";
const entries = awardEntries(restaurants);
const description = `${entries.length} awards held by ${restaurants.length} listed restaurants, each with its year and a link to the source we checked on ${formatDate(siteConfig.dataCheckedOn)}. Michelin Guide, James Beard Foundation and National Restaurant Awards.`;

export const metadata = buildMetadata({
  title,
  description,
  path: "/awards",
  photo: "awardsHero",
  eyebrow: "Awards",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Awards", path: "/awards" },
];

const awardListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Awards held by TableTalk-listed restaurants",
  itemListElement: entries.map(({ restaurant, award }, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: `${award.title}, ${restaurant.name} (${award.year})`,
    url: `${BASE_URL}/restaurants/${restaurant.slug}`,
  })),
};

export default function AwardsPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildWebPageSchema({ name: title, description, path: "/awards" })} />
      <JsonLd data={awardListSchema} />

      <PageHero
        variant="photo"
        crumbs={crumbs}
        eyebrow="Awards"
        title={<>Awards, <em>with sources</em>.</>}
        lede="Every star and award on this site carries a year and a link to where we read it. No ratings, no review scores, no logos: just the register and the evidence."
        image={getImage("awardsHero")}
      />

      <AwardsDefinitions />
      <AwardsRegister restaurants={restaurants} />
      <AwardsVerification />
      <AwardsDisclosureBand />
      <CtaBand image={getImage("chefPlating")} secondaryHref="/restaurants?occasion=tasting-menu" secondaryLabel="Tasting-menu restaurants" />
    </>
  );
}
