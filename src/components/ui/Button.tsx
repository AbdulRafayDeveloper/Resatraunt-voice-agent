import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

export type ButtonVariant = "primary" | "brass" | "outline" | "outlineLight" | "ghost" | "white" | "dark";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-bold transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-px";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-claret text-cream hover:bg-claret-deep shadow-card",
  brass: "bg-brass text-charcoal hover:bg-brass-pale shadow-card",
  outline: "border-2 border-claret text-claret hover:bg-claret hover:text-cream",
  outlineLight: "border-2 border-cream/70 text-cream hover:bg-cream hover:text-claret-deep",
  ghost: "text-claret hover:bg-claret-soft",
  white: "bg-cream text-claret-deep hover:bg-brass-pale shadow-card",
  dark: "bg-charcoal text-cream hover:bg-ink shadow-card",
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-sm md:text-base",
  lg: "px-6 py-3.5 text-base md:text-lg",
};

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: string;
  iconPosition?: "start" | "end";
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}

interface LinkButtonProps extends CommonProps {
  href: string;
  external?: boolean;
}

type NativeButtonProps = CommonProps & ButtonHTMLAttributes<HTMLButtonElement>;

function Inner({ icon, iconPosition = "end", children }: Pick<CommonProps, "icon" | "iconPosition" | "children">) {
  const glyph = icon ? <Icon name={icon} className="text-[1.25em]" /> : null;
  return (
    <>
      {iconPosition === "start" && glyph}
      <span>{children}</span>
      {iconPosition === "end" && glyph}
    </>
  );
}

function isExternal(href: string): boolean {
  return href.startsWith("http") || href.startsWith("tel:") || href.startsWith("mailto:");
}

export function LinkButton({ href, external, variant = "primary", size = "md", icon, iconPosition, fullWidth, className, children }: LinkButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);
  const inner = <Inner icon={icon} iconPosition={iconPosition}>{children}</Inner>;
  if (external || isExternal(href)) {
    const newTab = href.startsWith("http");
    return (
      <a href={href} className={classes} target={newTab ? "_blank" : undefined} rel={newTab ? "noopener noreferrer" : undefined}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={classes}>
      {inner}
    </Link>
  );
}

export function Button({ variant = "primary", size = "md", icon, iconPosition, fullWidth, className, children, type = "button", ...rest }: NativeButtonProps) {
  return (
    <button type={type} className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)} {...rest}>
      <Inner icon={icon} iconPosition={iconPosition}>
        {children}
      </Inner>
    </button>
  );
}
