import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  as?: ElementType;
  size?: "default" | "narrow" | "wide";
}

const sizes = {
  default: "max-w-container-max",
  narrow: "max-w-3xl",
  wide: "max-w-[1400px]",
};

/** Horizontal page gutter + max width. */
export function Container({ children, className, as: Tag = "div", size = "default" }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full px-4 sm:px-6 md:px-margin-desktop", sizes[size], className)}>{children}</Tag>;
}
