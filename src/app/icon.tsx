import { ImageResponse } from "next/og";
import { LogoMark } from "@/components/graphics/LogoMark";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#5B1D2B", borderRadius: 7 }}>
        <LogoMark size={26} bubble="#F5EAD3" accent="#5B1D2B" />
      </div>
    ),
    { ...size },
  );
}
