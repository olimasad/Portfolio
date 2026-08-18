"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { cvHref } from "../lib/data";
import PlantDecor from "./plant-decor";
import ThemeToggle from "./theme-toggle";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/achievements", label: "Achievements" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export default function SiteFrame({ children }) {
  const pathname = usePathname();
  const menuRef = useRef(null);
  // Position of the sliding underline, in pixels relative to the menu. Null until measured,
  // which is also the state the server renders, so the links keep their own underline until
  // the indicator can take over.
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    window.dispatchEvent(new Event("pageshow"));
  }, [pathname]);

  const measure = useCallback((link) => {
    const menu = menuRef.current;
    if (!menu || !link) return null;
    // Pointless below the mobile breakpoint, where the menu becomes a stacked panel.
    if (window.matchMedia("(max-width: 640px)").matches) return null;

    const menuBox = menu.getBoundingClientRect();
    const linkBox = link.getBoundingClientRect();
    if (!linkBox.width) return null;
    return { x: linkBox.left - menuBox.left, w: linkBox.width };
  }, []);

  // Where the underline rests when nothing is being pointed at: the current page.
  const settle = useCallback(() => {
    const menu = menuRef.current;
    setMarker(menu ? measure(menu.querySelector("a.active")) : null);
  }, [measure]);

  useEffect(() => {
    settle();
    window.addEventListener("resize", settle);
    // Label widths shift when the webfont swaps in, which would leave a stale measurement.
    if (document.fonts?.ready) document.fonts.ready.then(settle);
    return () => window.removeEventListener("resize", settle);
  }, [pathname, settle]);

  function trackLink(event) {
    const link = event.target.closest?.("a");
    if (!link || !menuRef.current?.contains(link) || link.closest(".nav-socials")) return;

    const next = measure(link);
    if (next) setMarker(next);
  }

  return (
    <>
      <PlantDecor />
      <header className="nav-wrap">
        <nav>
          <Link href="/" className="logo">
            <img src="/logo.svg" alt="" width="34" height="34" />
            <span>Oliver Massaad</span>
          </Link>
          {/*
           * The links and the parked dock live in one cell so they can trade places
           * without resizing the bar around them.
           */}
          <div className="nav-swap">
            <ul
              id="nav-menu"
              ref={menuRef}
              data-nav-marker={marker ? "on" : "off"}
              style={
                marker ? { "--nav-pill-x": `${marker.x}px`, "--nav-pill-w": `${marker.w}px` } : undefined
              }
              onPointerOver={trackLink}
              onFocus={trackLink}
              onPointerLeave={settle}
              onBlur={settle}
            >
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={isActive(pathname, item.href) ? "active" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
              <li className="nav-socials">
                <div className="nav-socials-row">
                  <a
                    className="footer-icon-link"
                    href="https://github.com/olimasad"
                    target="_blank"
                    rel="noopener"
                    aria-label="GitHub"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.8-.25.8-.57v-2.1c-3.24.7-3.92-1.38-3.92-1.38-.53-1.35-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.75.4-1.24.72-1.53-2.59-.3-5.3-1.3-5.3-5.75 0-1.27.45-2.3 1.18-3.12-.12-.29-.51-1.49.11-3.1 0 0 .97-.31 3.17 1.19a10.9 10.9 0 0 1 5.78 0c2.2-1.5 3.17-1.2 3.17-1.2.63 1.62.23 2.82.12 3.11.73.81 1.18 1.85 1.18 3.12 0 4.47-2.72 5.45-5.31 5.74.42.36.79 1.05.79 2.12v3.13c0 .32.21.68.81.57A11.5 11.5 0 0 0 12 .5z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                  <a
                    className="footer-icon-link"
                    href="https://www.linkedin.com/in/oliver-massaad-9765a0276/"
                    target="_blank"
                    rel="noopener"
                    aria-label="LinkedIn"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path
                        d="M4 3.5a2.25 2.25 0 1 0 0 4.5A2.25 2.25 0 0 0 4 3.5zM2 9h4v13H2zM9 9h3.8v1.8h.1c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V22h-4v-6.2c0-1.48-.03-3.37-2.05-3.37-2.06 0-2.38 1.6-2.38 3.27V22H9z"
                        fill="currentColor"
                      />
                    </svg>
                  </a>
                  <a
                    className="footer-icon-link"
                    href="https://www.instagram.com/oliver_massaad/"
                    target="_blank"
                    rel="noopener"
                    aria-label="Instagram"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
                    </svg>
                  </a>
                  <Link className="footer-icon-link" href="/contact" aria-label="Email">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.8" />
                      <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
                    </svg>
                  </Link>
                </div>
              </li>
            </ul>
            {/* Stays empty until a page dock scrolls up and parks itself here. */}
            <div id="nav-dock-slot" className="nav-dock-slot" />
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <button className="nav-toggle" type="button" aria-label="Toggle menu" aria-expanded="false">
              <span aria-hidden="true">☰</span>
            </button>
          </div>
        </nav>
      </header>
      <main key={pathname} className="page-shell">
        {children}
      </main>
      <footer>
        <p>&copy; 2026 Oliver Massaad</p>
        <a className="footer-cv-link" href={cvHref} download>
          CV
        </a>
        <div className="footer-links">
          <a className="footer-icon-link" href="https://github.com/olimasad" target="_blank" rel="noopener" aria-label="GitHub">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 .5a11.5 11.5 0 0 0-3.64 22.4c.58.1.8-.25.8-.57v-2.1c-3.24.7-3.92-1.38-3.92-1.38-.53-1.35-1.28-1.7-1.28-1.7-1.04-.72.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.68 1.24 3.33.95.1-.75.4-1.24.72-1.53-2.59-.3-5.3-1.3-5.3-5.75 0-1.27.45-2.3 1.18-3.12-.12-.29-.51-1.49.11-3.1 0 0 .97-.31 3.17 1.19a10.9 10.9 0 0 1 5.78 0c2.2-1.5 3.17-1.2 3.17-1.2.63 1.62.23 2.82.12 3.11.73.81 1.18 1.85 1.18 3.12 0 4.47-2.72 5.45-5.31 5.74.42.36.79 1.05.79 2.12v3.13c0 .32.21.68.81.57A11.5 11.5 0 0 0 12 .5z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a
            className="footer-icon-link"
            href="https://www.linkedin.com/in/oliver-massaad-9765a0276/"
            target="_blank"
            rel="noopener"
            aria-label="LinkedIn"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M4 3.5a2.25 2.25 0 1 0 0 4.5A2.25 2.25 0 0 0 4 3.5zM2 9h4v13H2zM9 9h3.8v1.8h.1c.53-1 1.84-2.1 3.79-2.1 4.05 0 4.8 2.67 4.8 6.14V22h-4v-6.2c0-1.48-.03-3.37-2.05-3.37-2.06 0-2.38 1.6-2.38 3.27V22H9z"
                fill="currentColor"
              />
            </svg>
          </a>
          <a
            className="footer-icon-link"
            href="https://www.instagram.com/oliver_massaad/"
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
            </svg>
          </a>
          <Link className="footer-icon-link" href="/contact" aria-label="Contact">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 6h16v12H4z" fill="none" stroke="currentColor" strokeWidth="1.8" />
              <path d="M4 7l8 6 8-6" fill="none" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </Link>
        </div>
      </footer>
    </>
  );
}
