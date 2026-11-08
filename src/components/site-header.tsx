"use client";

import { TransitionLink } from "@/components/page-transition";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { FACEBOOK_URL, navLinks } from "@/data/site";
import { useLenis } from "@/components/smooth-scroll";
import { Logo } from "@/components/logo";
import { isActive as activeOn, MobileMenu } from "@/components/mobile-menu";

export function SiteHeader() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  // A new page closes the menu, however it was reached.
  const [shownPath, setShownPath] = useState(pathname);
  if (shownPath !== pathname) {
    setShownPath(pathname);
    setOpen(false);
  }

  // Pause smooth scrolling behind the open menu.
  useEffect(() => {
    if (open) lenis.current?.stop();
    else lenis.current?.start();
  }, [open, lenis]);

  // While the menu is open the page behind it can't scroll or take focus. Escape closes it, and so
  // does widening the screen to where the menu isn't used.
  useEffect(() => {
    if (!open) return;
    const page = document.querySelectorAll<HTMLElement>("main, main ~ footer");
    page.forEach((el) => (el.inert = true));
    const html = document.documentElement;
    const overflow = html.style.overflow;
    html.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false);
      toggle.current?.focus();
    };
    const wide = window.matchMedia("(min-width: 64rem)");
    const onWide = () => {
      if (wide.matches) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    wide.addEventListener("change", onWide);
    return () => {
      page.forEach((el) => (el.inert = false));
      html.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      wide.removeEventListener("change", onWide);
    };
  }, [open]);

  const isActive = (href: string) => activeOn(pathname, href);
  // Over an open menu the header keeps only the logo and the close button; the menu has the rest.
  // They come back once the closing menu has shrunk out of their way.
  const tucked = open ?"max-lg:pointer-events-none max-lg:opacity-0" : "max-lg:[transition-delay:200ms,0s,0s]";

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-3 py-3 sm:px-4">
        <TransitionLink href="/" aria-label="React Cebu home" className="pointer-events-auto justify-self-start" onClick={() => setOpen(false)}>
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
            className={`navpill hidden max-lg:transition-[opacity,background-color,color] max-lg:duration-300 sm:inline-flex ${tucked}`}
            aria-current={isActive("/partners") ? "page" : undefined}
          >
            Partner with us
          </TransitionLink>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`navpill !bg-react !text-ink hover:!bg-ink hover:!text-react max-lg:transition-[opacity,background-color,color] max-lg:duration-300 ${tucked}`}
          >
            Join
          </a>
          <button
            ref={toggle}
            type="button"
            className="navpill w-10 justify-center !px-0 aria-expanded:bg-ink aria-expanded:text-white lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((was) => !was)}
          >
            {/* Two lines that meet in the middle and turn into a cross, and back. */}
            <span aria-hidden="true" className="flex size-[1.125rem] flex-col items-center justify-center gap-[4.5px]">
              <span
                className={`h-[1.5px] w-3 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-200 ${open ? "translate-y-[3px] rotate-45" : ""}`}
              />
              <span
                className={`h-[1.5px] w-3 rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:duration-200 ${open ? "-translate-y-[3px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </header>

      <MobileMenu open={open} pathname={pathname} onClose={() => setOpen(false)} toggle={toggle} />
    </>
  );
}
