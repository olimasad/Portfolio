"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Dock from "./dock";
import { DOCK_ICONS } from "./dock-icons";

/** Clears the fixed navbar and leaves a little air above the heading we land on. */
const SCROLL_OFFSET = 88;

/* A long row does not fit a phone at desktop sizing, so the dock shrinks below this width. */
const REGULAR = { baseItemSize: 58, magnification: 88, panelHeight: 74, distance: 200 };
const COMPACT = { baseItemSize: 44, magnification: 62, panelHeight: 58, distance: 130 };
/* Parked in the navbar: dockHeight caps the reserved headroom so it fits the 62px bar. */
const PINNED = {
  baseItemSize: 34,
  magnification: 46,
  panelHeight: 46,
  dockHeight: 46,
  distance: 130,
};

/* Below this the navbar has no room to host the row alongside the logo. */
const PIN_QUERY = "(min-width: 1024px)";

/* Hysteresis: how far back up you scroll before the parked row is released again. */
const RELEASE_SLACK = 90;

/* Matches the dockHandBack exit in the stylesheet. */
const EXIT_MS = 260;

/*
 * The parked row stands in for the navbar links, so it always carries exactly those four
 * in navbar order. Inline it carries the page's own sections plus the siblings you can
 * actually travel to, which is this list minus wherever you already are.
 */
const NAV_PAGES = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/projects", label: "Projects", icon: "projects" },
  { href: "/achievements", label: "Achievements", icon: "achievements" },
  { href: "/contact", label: "Contact", icon: "contact" },
];

export default function PageDock({ sections = [], currentHref = "/" }) {
  const router = useRouter();
  const anchorRef = useRef(null);
  const [compact, setCompact] = useState(false);
  const [canPin, setCanPin] = useState(false);
  const [pinned, setPinned] = useState(false);
  // Trails `pinned` on the way out so the parked row survives long enough to play its exit
  // instead of being yanked out of the navbar the instant it is released.
  const [parked, setParked] = useState(false);
  // Mirrors `pinned` for the scroll handler, which needs the current value without
  // re-subscribing its listeners on every change.
  const pinnedRef = useRef(false);
  const [reservedHeight, setReservedHeight] = useState(null);
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    setSlot(document.getElementById("nav-dock-slot"));
  }, []);

  useEffect(() => {
    const compactQuery = window.matchMedia("(max-width: 860px)");
    const pinQuery = window.matchMedia(PIN_QUERY);
    const sync = () => {
      setCompact(compactQuery.matches);
      setCanPin(pinQuery.matches);
    };

    sync();
    compactQuery.addEventListener("change", sync);
    pinQuery.addEventListener("change", sync);
    return () => {
      compactQuery.removeEventListener("change", sync);
      pinQuery.removeEventListener("change", sync);
    };
  }, []);

  // Remember the inline footprint so the page does not jump when the dock leaves it.
  useEffect(() => {
    if (pinned || !anchorRef.current) return;
    setReservedHeight(anchorRef.current.offsetHeight);
  }, [pinned, compact]);

  /*
   * Hand the dock to the navbar only after its own strip has scrolled up behind the bar.
   * This is a direct scroll-position test on purpose: an IntersectionObserver reports a
   * zeroed rect for its first callback in some states, which reads as "already above the
   * navbar" and pins the dock while the page is still at the top.
   */
  useEffect(() => {
    if (!canPin) {
      pinnedRef.current = false;
      setPinned(false);
      return undefined;
    }

    const anchor = anchorRef.current;
    if (!anchor) return undefined;

    const navHeight =
      parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-height"), 10) || 62;

    let frame = 0;

    function apply(next) {
      if (next === pinnedRef.current) return;
      pinnedRef.current = next;
      setPinned(next);
    }

    function evaluate() {
      frame = 0;
      // The anchor holds its footprint while pinned, so this offset stays stable.
      const anchorBottom = anchor.getBoundingClientRect().bottom + window.scrollY;
      const threshold = anchorBottom - navHeight;

      // A non-positive threshold means the strip was measured before layout settled.
      // Treating that as "scrolled past" is what parks the dock in the navbar at the top
      // of the page, so require a real, positive threshold before pinning at all.
      if (threshold <= 0) {
        apply(false);
        return;
      }

      // Release needs a little scrolling back, so resting on the boundary cannot flicker
      // the row between the two placements while the handover is still animating.
      apply(pinnedRef.current ? window.scrollY > threshold - RELEASE_SLACK : window.scrollY > threshold);
    }

    function schedule() {
      if (frame) return;
      frame = window.requestAnimationFrame(evaluate);
    }

    evaluate();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [canPin]);

  useEffect(() => {
    if (pinned) {
      setParked(true);
      return undefined;
    }
    if (!parked) return undefined;

    const timer = window.setTimeout(() => setParked(false), EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [pinned, parked]);

  function smoothScrollTo(top) {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function scrollToSection(id) {
    const target = document.getElementById(id);
    if (!target) return;
    smoothScrollTo(target.getBoundingClientRect().top + window.scrollY - SCROLL_OFFSET);
  }

  const parkedItems = NAV_PAGES.map((page) => ({
    label: page.label,
    icon: DOCK_ICONS[page.icon],
    // Home leads the row in from the right on every page, so the handover always plays the
    // same way round instead of the entrance moving with whatever page you happen to be on.
    className: page.href === "/" ? "dock-item-lead" : "",
    onClick: page.href === currentHref ? () => smoothScrollTo(0) : () => router.push(page.href),
  }));

  const inlineItems = [
    ...sections.map((section) => ({
      label: section.label,
      icon: DOCK_ICONS[section.icon],
      onClick: () => scrollToSection(section.id),
    })),
    ...NAV_PAGES.filter((page) => page.href !== currentHref).map((page) => ({
      label: page.label,
      icon: DOCK_ICONS[page.icon],
      className: "dock-item-route",
      onClick: () => router.push(page.href),
    })),
  ];

  return (
    <>
      <div
        className="dock-anchor"
        ref={anchorRef}
        style={pinned && reservedHeight ? { height: reservedHeight } : undefined}
      >
        {pinned ? null : (
          <Dock items={inlineItems} {...(compact ? COMPACT : REGULAR)} />
        )}
      </div>
      {parked && slot
        ? createPortal(
            <Dock
              items={parkedItems}
              className={`dock-pinned${pinned ? "" : " dock-leaving"}`}
              {...PINNED}
            />,
            slot,
          )
        : null}
    </>
  );
}
