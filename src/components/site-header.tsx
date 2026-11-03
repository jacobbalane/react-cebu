"use client";

import { TransitionLink } from "@/components/page-transition";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FACEBOOK_URL, navLinks } from "@/data/site";
import { useLenis } from "@/components/smooth-scroll";
import { Logo } from "@/components/logo";

export function SiteHeader() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);

  // Pause smooth scrolling behind the open menu.
  useEffect(() => {
    if (open) lenis.current?.stop();
    else lenis.current?.start();
  }, [open, lenis]);

  // Every path starts with "/", so Home only counts as current on the home page itself.
  const isActive = (href: string) => !href.includes("#") && (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 py-3 sm:px-4">
        <TransitionLink href="/" aria-label="React Cebu home" className="pointer-events-auto justify-self-start">
          <Logo />
        </TransitionLink>
        <nav aria-label="Main" className="pointer-events-auto hidden gap-1 lg:flex">
          {navLinks.map((link) => (
            <TransitionLink
              key={link.href}
              href={link.href}
              className="navpill"
              aria-current={isActive(link.href) ? "page" : undefined}
            >
              {link.label}
            </TransitionLink>
          ))}
        </nav>
        {/* Pinned to the last column: below lg the nav is hidden and would otherwise leave this in the middle. */}
        <div className="pointer-events-auto col-start-3 flex gap-1 justify-self-end">
          <TransitionLink
            href="/partners"
            className="navpill hidden sm:inline-flex"
            aria-current={isActive("/partners") ? "page" : undefined}
          >
            Partner with us
          </TransitionLink>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="navpill !bg-react !text-ink hover:!bg-ink hover:!text-react"
          >
            Join
          </a>
          <button
            type="button"
            className="navpill w-10 justify-center !px-0 lg:hidden"
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M4 8h16M4 16h16" />
            </svg>
          </button>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="fixed inset-0 z-50 flex flex-col gap-6 overflow-y-auto bg-white px-3 pb-6 pt-3 lg:hidden"
        >
          <div className="flex items-center justify-between">
            <Logo />
            <button
              type="button"
              className="inline-flex size-11 items-center justify-center rounded-full bg-ink text-white"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <nav aria-label="Main" className="flex flex-col border-t border-black">
            {[...navLinks, { href: "/partners", label: "Partner with us" }].map((link) => (
              <TransitionLink
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-line px-1 py-4 text-[40px] tracking-[-0.04em]"
              >
                {link.label}
              </TransitionLink>
            ))}
          </nav>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="btn btn-primary self-start"
          >
            Join React Cebu
          </a>
        </div>
      )}
    </>
  );
}
