import { PageHero } from "@/components/layout/PageHero";
import { CollectionOccasionBand } from "@/components/sections/CollectionOccasionBand";
import { CollectionRows } from "@/components/sections/CollectionRows";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/JsonLd";
import { collections } from "@/data/collections";
import { getImage } from "@/data/images";
import { restaurants } from "@/data/restaurants";
import { buildBreadcrumbSchema, buildMetadata, buildRestaurantListSchema, buildWebPageSchema } from "@/lib/seo";

const title = "Curated Restaurant Collections: Date Night, Tasting Menus, Chef's Tables";
const description = `${collections.length} short, argued lists across ${restaurants.length} restaurants in London, Edinburgh, New York, Chicago and Philadelphia. Each says why a restaurant is included and shows published prices, booking rules and awards with sources.`;

export const metadata = buildMetadata({
  title,
  description,
  path: "/collections",
  photo: "collectionsHero",
  eyebrow: "Collections",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Collections", path: "/collections" },
];

export default function CollectionsPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildWebPageSchema({ name: title, description, path: "/collections", type: "CollectionPage" })} />
      <JsonLd data={buildRestaurantListSchema("Restaurants in TableTalk collections", restaurants)} />

      <PageHero
        variant="band"
        crumbs={crumbs}
        eyebrow="Collections"
        title={<>Curated <em>collections</em>.</>}
        lede="Six lists for six kinds of evening. Each one is chosen by hand, explained in a short note, and backed by the same verified facts as every listing: hours, published prices, booking rules and awards with their source."
      />

      <CollectionRows collections={collections} />
      <CollectionOccasionBand />
      <CtaBand image={getImage("groupToast")} />
    </>
  );
}
