"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/graphics/Logo";
import { Icon } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/Button";
import { siteConfig, telUrl } from "@/config/site";
import { primaryNav, requestHref, secondaryNav } from "@/config/navigation";
import { cn, formatDate } from "@/lib/utils";

const DRAWER_ID = "mobile-navigation";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while the drawer is open and close it on Escape.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50 transition-shadow", scrolled ? "shadow-soft" : "")}>
      {/* Utility strip */}
      <div className="hidden bg-claret-deep text-cream lg:block">
        <div className="mx-auto flex h-9 max-w-container-max items-center justify-between px-margin-desktop text-xs">
          <p className="flex items-center gap-2 text-cream/85">
            <Icon name="fact_check" className="text-[16px] text-brass" />
            London · Edinburgh · New York · Chicago · Philadelphia · Listings checked {formatDate(siteConfig.dataCheckedOn)}
          </p>
          <div className="flex items-center gap-5">
            <a href={telUrl()} className="flex items-center gap-1.5 font-bold text-brass hover:text-cream">
              <Icon name="call" className="text-[16px]" /> Call to book: {siteConfig.phone}
            </a>
            <Link href="/about" className="text-cream/85 hover:text-brass">How we verify</Link>
            <Link href="/for-restaurants" className="font-bold hover:text-brass">List your restaurant</Link>
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-claret-deep/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/85">
        <div className="mx-auto flex h-[68px] max-w-container-max items-center justify-between gap-4 px-4 sm:px-6 md:px-margin-desktop lg:h-[76px]">
          <Logo size="md" />

          <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
            {primaryNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative rounded-md px-3 py-2 text-[0.9rem] font-semibold text-ink transition-colors hover:text-claret xl:px-3.5",
                  isActive(link.href) && "text-claret after:absolute after:inset-x-3 after:-bottom-0.5 after:h-0.5 after:rounded-full after:bg-brass",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/restaurants" aria-label="Open restaurant search" className="flex h-11 w-11 items-center justify-center rounded-lg border border-line text-claret transition-colors hover:border-claret hover:bg-claret-soft">
              <Icon name="search" className="text-[22px]" />
            </Link>
            <LinkButton href={requestHref} variant="primary" size="sm" icon="arrow_forward">
              Request a table
            </LinkButton>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <a href={telUrl()} aria-label={`Call to book: ${siteConfig.phone}`} className="flex h-11 w-11 items-center justify-center rounded-lg border border-claret/25 text-claret">
              <Icon name="call" className="text-[22px]" />
            </a>
            <Link href="/restaurants" aria-label="Open restaurant search" className="flex h-11 w-11 items-center justify-center rounded-lg bg-claret text-cream">
              <Icon name="search" className="text-[22px]" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls={DRAWER_ID}
              aria-label="Open menu"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-claret/25 text-claret-deep cursor-pointer"
            >
              <Icon name="menu" className="text-[26px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer */}
      <div
        id={DRAWER_ID}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        className={cn("fixed inset-0 z-[60] lg:hidden", open ? "pointer-events-auto" : "pointer-events-none")}
        aria-hidden={!open}
      >
        <button
          type="button"
          aria-label="Close menu"
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className={cn("absolute inset-0 bg-charcoal/70 backdrop-blur-sm transition-opacity duration-300", open ? "opacity-100" : "opacity-0")}
        />
        <div
          className={cn(
            "absolute inset-y-0 end-0 flex w-[86%] max-w-sm flex-col bg-cream shadow-2xl transition-transform duration-300 ease-out",
            open ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-[68px] items-center justify-between border-b border-line px-5">
            <Logo size="sm" />
            <button type="button" onClick={() => setOpen(false)} aria-label="Close menu" className="flex h-10 w-10 items-center justify-center rounded-lg text-claret-deep hover:bg-linen cursor-pointer">
              <Icon name="close" className="text-[26px]" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-3 py-4">
            <ul className="space-y-0.5">
              {primaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn("flex items-center gap-3 rounded-lg px-3 py-3 font-semibold text-ink", isActive(link.href) ? "bg-claret text-cream" : "hover:bg-linen")}
                  >
                    <Icon name={link.icon} className={cn("text-[22px]", isActive(link.href) ? "text-brass" : "text-claret")} />
                    <span className="flex flex-col">
                      {link.label}
                      {link.description && <span className={cn("text-xs font-normal", isActive(link.href) ? "text-cream/80" : "text-smoke")}>{link.description}</span>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-6 mb-2 px-3 text-smoke">More</p>
            <ul className="grid grid-cols-2 gap-1">
              {secondaryNav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn("flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold", isActive(link.href) ? "bg-claret-soft text-claret-deep" : "text-ink hover:bg-linen")}
                  >
                    <Icon name={link.icon} className="text-[18px] text-brass-deep" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Any click inside the footer closes the drawer before navigation */}
          <div className="space-y-2 border-t border-line bg-linen px-5 py-4" onClickCapture={() => setOpen(false)}>
            <LinkButton href={requestHref} variant="primary" fullWidth icon="arrow_forward">
              Request a table
            </LinkButton>
            <LinkButton href={telUrl()} variant="outline" fullWidth icon="call" iconPosition="start">
              Call to book: {siteConfig.phone}
            </LinkButton>
            <LinkButton href="/restaurants" variant="outline" fullWidth icon="search" iconPosition="start">
              Search restaurants
            </LinkButton>
            <p className="pt-1 text-center text-xs text-smoke">{siteConfig.replyPromise}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
