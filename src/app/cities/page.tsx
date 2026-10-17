import { PageHero } from "@/components/layout/PageHero";
import { CityIntros } from "@/components/sections/CityIntros";
import { CityLedger } from "@/components/sections/CityLedger";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/JsonLd";
import { cities } from "@/data/cities";
import { getImage } from "@/data/images";
import { restaurants } from "@/data/restaurants";
import { buildBreadcrumbSchema, buildMetadata, buildRestaurantListSchema, buildWebPageSchema } from "@/lib/seo";

const cityNames = cities.map((c) => c.name);
const title = `Restaurants by City: ${cityNames.join(", ")}`;
const description = `${restaurants.length} restaurants across ${cities.length} cities in the United Kingdom and the United States, each with verified hours, published prices, booking rules and awards with their source.`;

export const metadata = buildMetadata({
  title,
  description,
  path: "/cities",
  photo: "citiesHero",
  eyebrow: "Cities",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Cities", path: "/cities" },
];

export default function CitiesPage() {
  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildWebPageSchema({ name: title, description, path: "/cities", type: "CollectionPage" })} />
      <JsonLd data={buildRestaurantListSchema("Restaurants by city", restaurants)} />

      <PageHero
        variant="linen"
        crumbs={crumbs}
        eyebrow="Cities"
        title={<>Five cities, <em>one standard</em>.</>}
        lede="London, Edinburgh, New York, Chicago and Philadelphia. Different booking cultures, service charges and dress codes; the same rule for every listing: facts from the restaurant, awards from the source, nothing invented."
      />

      <CityLedger cities={cities} />
      <CityIntros cities={cities} />
      <CtaBand image={getImage("cityStreet")} />
    </>
  );
}
