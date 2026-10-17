import type { Metadata } from "next";
import { HomeCities } from "@/components/home/HomeCities";
import { HomeCollections } from "@/components/home/HomeCollections";
import { HomeFacts } from "@/components/home/HomeFacts";
import { HomeFeatured } from "@/components/home/HomeFeatured";
import { HomeGuides } from "@/components/home/HomeGuides";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeHowItWorks } from "@/components/home/HomeHowItWorks";
import { HomeNewOpenings } from "@/components/home/HomeNewOpenings";
import { HomeVerify } from "@/components/home/HomeVerify";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqSection } from "@/components/sections/FaqSection";
import { JsonLd } from "@/components/ui/JsonLd";
import { siteConfig } from "@/config/site";
import { homeFaqs } from "@/data/faqs";
import { siteImages } from "@/data/images";
import { buildFaqSchema, buildWebPageSchema } from "@/lib/seo";

const title = `${siteConfig.fullName} | Restaurant Guide and Table Requests for London and US Cities`;

export const metadata: Metadata = {
  title: { absolute: title },
  description: siteConfig.description,
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={buildWebPageSchema({ name: title, description: siteConfig.description, path: "" })} />
      <JsonLd data={buildFaqSchema(homeFaqs)} />
      <HomeHero />
      <HomeFacts />
      <HomeFeatured />
      <HomeHowItWorks />
      <HomeCollections />
      <HomeNewOpenings />
      <HomeCities />
      <HomeVerify />
      <HomeGuides />
      <FaqSection items={homeFaqs} number="08" />
      <CtaBand image={siteImages.coupleDinner} />
    </>
  );
}
