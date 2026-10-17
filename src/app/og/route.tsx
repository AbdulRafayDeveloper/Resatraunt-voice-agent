import type { NextRequest } from "next/server";
import { isSiteImageKey } from "@/data/images";
import { siteConfig } from "@/config/site";
import { renderOgImage } from "@/lib/og";

export const runtime = "nodejs";

/**
 * Branded social preview card for any page: /og?t=Title&e=Eyebrow&s=Subtitle&p=photoKey
 * Unknown or missing parameters fall back to the brand card, so a share never shows an empty image.
 */
export async function GET(request: NextRequest): Promise<Response> {
  const params = request.nextUrl.searchParams;
  const title = params.get("t")?.trim() || siteConfig.tagline;
  const eyebrow = params.get("e")?.trim() || undefined;
  const subtitle = params.get("s")?.trim() || undefined;
  const photoParam = params.get("p")?.trim() ?? "";
  const photo = isSiteImageKey(photoParam) ? photoParam : undefined;
  return renderOgImage({ title, eyebrow, subtitle, photo });
}
