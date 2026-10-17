import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type BadgeTone = "claret" | "brass" | "linen" | "ember" | "charcoal" | "outline" | "basil";

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  icon?: string;
  className?: string;
}

const tones: Record<BadgeTone, string> = {
  claret: "bg-claret text-cream",
  brass: "bg-brass-pale text-brass-deep",
  linen: "bg-linen text-ink",
  ember: "bg-ember text-white",
  charcoal: "bg-charcoal text-brass-pale",
  outline: "border border-line text-smoke",
  basil: "bg-basil-soft text-basil",
};

export function Badge({ children, tone = "linen", icon, className }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wider", tones[tone], className)}>
      {icon && <Icon name={icon} className="text-[14px]" />}
      {children}
    </span>
  );
}
