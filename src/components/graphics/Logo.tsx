import Link from "next/link";
import { LogoMark } from "@/components/graphics/LogoMark";
import { cn } from "@/lib/utils";

interface LogoProps {
  tone?: "light" | "dark";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const markSize = { sm: "w-8 h-8", md: "w-10 h-10", lg: "w-14 h-14" };
const wordSize = { sm: "text-xl", md: "text-2xl", lg: "text-4xl" };

/** Logo mark + wordmark, linking home. `tone="light"` is for dark backgrounds. */
export function Logo({ tone = "dark", size = "md", className }: LogoProps) {
  const light = tone === "light";
  return (
    <Link href="/" title="TableTalk home" className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={markSize[size]} bubble={light ? "#F5EAD3" : "#5B1D2B"} accent={light ? "#5B1D2B" : "#B8893A"} />
      <span className={cn("font-display font-medium tracking-tight leading-none", wordSize[size], light ? "text-cream" : "text-claret-deep")}>
        Table<em className={cn("not-italic font-normal italic", light ? "text-brass" : "text-brass-deep")}>Talk</em>
      </span>
    </Link>
  );
}
