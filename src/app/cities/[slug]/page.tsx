import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { CityAbout } from "@/components/sections/CityAbout";
import { CityCollections } from "@/components/sections/CityCollections";
import { CityGuides } from "@/components/sections/CityGuides";
import { CityRecognition } from "@/components/sections/CityRecognition";
import { CityRestaurants } from "@/components/sections/CityRestaurants";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/JsonLd";
import { cities, findCity } from "@/data/cities";
import { collections } from "@/data/collections";
import { guides } from "@/data/guides";
import { getImage, isSiteImageKey } from "@/data/images";
import { restaurantsInCity } from "@/data/restaurants";
import { buildBreadcrumbSchema, buildCitySchema, buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Every slug is prerendered; anything else is a 404 rather than a streamed not-found shell. */
export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = findCity(slug);
  if (!city) return {};
  return buildMetadata({
    title: `Restaurants in ${city.name}: verified hours, prices and booking rules`,
    description: city.intro[0],
    path: `/cities/${city.slug}`,
    photo: isSiteImageKey(city.image) ? city.image : undefined,
    eyebrow: city.countryName,
  });
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = findCity(slug);
  if (!city) notFound();

  const restaurants = restaurantsInCity(city.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Cities", path: "/cities" },
    { name: city.name, path: `/cities/${city.slug}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildCitySchema(city, restaurants)} />

      <PageHero
        variant="split"
        crumbs={crumbs}
        eyebrow={city.countryName}
        title={<>Restaurants in <em>{city.name}</em>.</>}
        lede={city.intro[0]}
        image={getImage(city.image)}
      />

      <CityAbout city={city} />
      <CityRestaurants city={city} restaurants={restaurants} />
      <CityRecognition city={city} restaurants={restaurants} />
      <CityCollections city={city} collections={collections} restaurants={restaurants} />
      <CityGuides guides={guides} />
      <CtaBand image={getImage("hostStand")} text={`Tell us the restaurant in ${city.name}, the date and the party size. We reply within one working day with the quickest route to the table, and the restaurant confirms under its own terms.`} />
    </>
  );
}
