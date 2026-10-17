import { siteConfig } from "@/config/site";
import { OG_CONTENT_TYPE, OG_SIZE, renderOgImage } from "@/lib/og";

export const alt = `${siteConfig.fullName}: restaurant guide and table requests for London and US cities`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

/** Default social card: used by the home page and as the fallback for every page without its own. */
export default function OpenGraphImage() {
  return renderOgImage({
    eyebrow: "Dining guide and table requests",
    title: siteConfig.tagline,
    subtitle: "Verified hours, published prices, booking rules and awards with their sources. London, Edinburgh, New York, Chicago and Philadelphia.",
    photo: "homeHero",
  });
}
