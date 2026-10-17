import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { LogoMark } from "@/components/graphics/LogoMark";
import { siteConfig } from "@/config/site";
import { siteImages, type SiteImageKey } from "@/data/images";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/jpeg";

interface OgOptions {
  title: string;
  eyebrow?: string;
  subtitle?: string;
  /** Key into siteImages; the photo is embedded on the right side of the card. */
  photo?: SiteImageKey;
}

const MAX_TITLE = 90;
const MAX_SUBTITLE = 140;
const MAX_EYEBROW = 60;
const PHOTO_WIDTH = 460;
const PHOTO_QUALITY = 72;
const CARD_QUALITY = 82;

const fontCache = new Map<string, Promise<ArrayBuffer | null>>();

/**
 * Fetch a Google Font as TrueType for Satori. Sending an empty User-Agent makes Google return
 * TTF rather than WOFF/WOFF2. Falls back to null (the default font) if the network is unavailable.
 */
function loadFont(family: string, weight: number, italic = false): Promise<ArrayBuffer | null> {
  const key = `${family}-${weight}-${italic}`;
  const cached = fontCache.get(key);
  if (cached) return cached;
  const promise = (async () => {
    try {
      const axis = italic ? `ital,wght@1,${weight}` : `wght@${weight}`;
      const css = await fetch(`https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:${axis}&display=swap`, {
        headers: { "User-Agent": "" },
      }).then((r) => r.text());
      const url = css.match(/src: url\(([^)]+)\) format\('(?:truetype|opentype)'\)/)?.[1];
      if (!url) return null;
      return await fetch(url).then((r) => r.arrayBuffer());
    } catch {
      return null;
    }
  })();
  fontCache.set(key, promise);
  return promise;
}

/** Read a registry photo, crop it to the photo column and embed it as a small JPEG data URL. */
async function photoDataUrl(key: SiteImageKey): Promise<string | null> {
  try {
    const file = await readFile(join(process.cwd(), "public", siteImages[key].src));
    const resized = await sharp(file).resize(PHOTO_WIDTH, OG_SIZE.height, { fit: "cover" }).jpeg({ quality: PHOTO_QUALITY }).toBuffer();
    return `data:image/jpeg;base64,${resized.toString("base64")}`;
  } catch {
    return null;
  }
}

function clamp(value: string | undefined, max: number): string | undefined {
  if (!value) return undefined;
  return value.length > max ? `${value.slice(0, max - 1).trimEnd()}…` : value;
}

/**
 * Branded 1200x630 social card: logo and wordmark, eyebrow, title, subtitle and an optional photo.
 * Shared by the root opengraph-image, the /og route and every page's metadata. The card is
 * re-encoded as JPEG so it stays well under the roughly 300 KB that messaging apps will fetch.
 */
export async function renderOgImage(options: OgOptions): Promise<Response> {
  const title = clamp(options.title, MAX_TITLE) ?? siteConfig.fullName;
  const eyebrow = clamp(options.eyebrow, MAX_EYEBROW);
  const subtitle = clamp(options.subtitle, MAX_SUBTITLE);
  const [display, body, photo] = await Promise.all([loadFont("Fraunces", 500), loadFont("Manrope", 600), options.photo ? photoDataUrl(options.photo) : Promise.resolve(null)]);

  const fonts = [
    ...(display ? [{ name: "Fraunces", data: display, weight: 500 as const, style: "normal" as const }] : []),
    ...(body ? [{ name: "Manrope", data: body, weight: 600 as const, style: "normal" as const }] : []),
  ];
  const displayFamily = display ? "Fraunces" : "serif";
  const bodyFamily = body ? "Manrope" : "sans-serif";

  const png = new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "linear-gradient(135deg, #3B0F1A 0%, #5B1D2B 60%, #17151A 100%)",
          color: "#FAF6EF",
          fontFamily: bodyFamily,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 56, width: photo ? OG_SIZE.width - PHOTO_WIDTH : OG_SIZE.width }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <LogoMark size={72} bubble="#F5EAD3" accent="#5B1D2B" />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontFamily: displayFamily, fontSize: 44, lineHeight: 1 }}>TableTalk</span>
              <span style={{ fontSize: 14, letterSpacing: 5, color: "#B8893A", marginTop: 6 }}>DINING GUIDE &amp; TABLE REQUESTS</span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {eyebrow && (
              <span style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 20, letterSpacing: 3, color: "#B8893A", textTransform: "uppercase" }}>
                <span style={{ width: 32, height: 2, background: "#B8893A" }} />
                {eyebrow}
              </span>
            )}
            <span style={{ fontFamily: displayFamily, fontSize: title.length > 48 ? 46 : 56, lineHeight: 1.08 }}>{title}</span>
            {subtitle && <span style={{ fontSize: 22, lineHeight: 1.4, color: "rgba(250,246,239,0.82)" }}>{subtitle}</span>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, color: "rgba(250,246,239,0.75)" }}>
            <span style={{ color: "#B8893A" }}>London · Edinburgh · New York · Chicago · Philadelphia</span>
            <span>Verified listings</span>
          </div>
        </div>
        {photo && (
          <div style={{ display: "flex", width: PHOTO_WIDTH, height: OG_SIZE.height, position: "relative" }}>
            {/* Satori renders plain <img>; next/image is not available inside ImageResponse */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt="" width={PHOTO_WIDTH} height={OG_SIZE.height} style={{ objectFit: "cover", width: PHOTO_WIDTH, height: OG_SIZE.height }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, #5B1D2B 0%, rgba(91,29,43,0) 40%)" }} />
          </div>
        )}
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );

  const cacheControl = "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800";
  const pngBytes = Buffer.from(await png.arrayBuffer());
  try {
    const jpeg = await sharp(pngBytes).jpeg({ quality: CARD_QUALITY }).toBuffer();
    return new Response(new Uint8Array(jpeg), { headers: { "Content-Type": OG_CONTENT_TYPE, "Cache-Control": cacheControl } });
  } catch (error) {
    // Never fail a share preview: serve the larger PNG if the JPEG step cannot run in this environment.
    console.error(JSON.stringify({ event: "og_jpeg_failed", message: error instanceof Error ? error.message : "unknown" }));
    return new Response(new Uint8Array(pngBytes), { headers: { "Content-Type": "image/png", "Cache-Control": cacheControl } });
  }
}
