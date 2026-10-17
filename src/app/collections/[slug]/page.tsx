import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { CollectionAlsoSee } from "@/components/sections/CollectionAlsoSee";
import { CollectionEditorNote } from "@/components/sections/CollectionEditorNote";
import { cityNamesFor, cityPhrase, collectionRestaurants } from "@/components/sections/CollectionFacts";
import { CollectionList } from "@/components/sections/CollectionList";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/ui/JsonLd";
import { collections, findCollection } from "@/data/collections";
import { getImage, isSiteImageKey } from "@/data/images";
import { buildBreadcrumbSchema, buildCollectionSchema, buildMetadata } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Every slug is prerendered; anything else is a 404 rather than a streamed not-found shell. */
export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const collection = findCollection(slug);
  if (!collection) return {};
  const restaurants = collectionRestaurants(collection);
  return buildMetadata({
    title: `${collection.title}: ${restaurants.length} restaurants in ${cityPhrase(cityNamesFor(restaurants))}`,
    description: collection.intro,
    path: `/collections/${collection.slug}`,
    photo: isSiteImageKey(collection.image) ? collection.image : undefined,
    eyebrow: collection.eyebrow,
  });
}

export default async function CollectionPage({ params }: PageProps) {
  const { slug } = await params;
  const collection = findCollection(slug);
  if (!collection) notFound();

  const restaurants = collectionRestaurants(collection);
  const others = collections.filter((c) => c.slug !== collection.slug);
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Collections", path: "/collections" },
    { name: collection.title, path: `/collections/${collection.slug}` },
  ];

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(crumbs)} />
      <JsonLd data={buildCollectionSchema(collection, restaurants)} />

      <PageHero
        variant="photo"
        crumbs={crumbs}
        eyebrow={collection.eyebrow}
        title={collection.title}
        lede={collection.intro}
        image={getImage(collection.image)}
      />

      <CollectionEditorNote paragraphs={collection.editorNote} />
      <CollectionList restaurants={restaurants} />
      <CollectionAlsoSee collections={others} />

      <CtaBand
        image={getImage("tableLinen")}
        secondaryHref={collection.occasion ? `/restaurants?occasion=${collection.occasion}` : "/restaurants"}
        secondaryLabel={collection.occasion ? "Filter restaurants" : "Browse restaurants"}
      />
    </>
  );
}
