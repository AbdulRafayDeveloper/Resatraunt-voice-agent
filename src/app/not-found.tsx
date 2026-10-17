import type { Metadata } from "next";
import Link from "next/link";
import { LogoMark } from "@/components/graphics/LogoMark";
import { LinkButton } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { primaryNav } from "@/config/navigation";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-20 text-center">
      <LogoMark className="mb-4 h-12 w-12" />
      <p className="font-display text-7xl italic text-brass-deep md:text-8xl">404</p>
      <h1 className="display-title mt-2 text-3xl text-claret-deep md:text-5xl">This table has moved on</h1>
      <p className="lede mt-4 max-w-md text-smoke">The link may be old or mistyped. These pages are where most diners start.</p>
      <ul className="mt-8 flex flex-wrap justify-center gap-2">
        {primaryNav.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-white px-3.5 py-2 text-sm font-semibold text-claret-deep hover:border-claret">
              <Icon name={l.icon} className="text-[18px] text-brass-deep" /> {l.label}
            </Link>
          </li>
        ))}
      </ul>
      <LinkButton href="/" className="mt-8" icon="home" iconPosition="start">Back to home</LinkButton>
    </Container>
  );
}
