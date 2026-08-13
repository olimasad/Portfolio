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

/*
 * Compact tiles are sized to whatever the strip is given rather than to a fixed number, so a
 * row that is a few pixels too wide shrinks to fit instead of dropping its last tile onto a
 * second line. The ceiling is the size the strip used to run at, and the floor is the point
 * where a tile stops being comfortable to tap: rows too long to reach it (the homepage carries
 * ten) stay at full size and wrap, which reads better than a line of unhittable specks.
 */
const COMPACT_MAX = 44;
const COMPACT_MIN = 34;

function compactSizing(baseItemSize) {
  return {
    baseItemSize,
    magnification: Math.round(baseItemSize * 1.4),
    panelHeight: baseItemSize + 14,
    distance: 130,
  };
}
/* Parked in the navbar: dockHeight caps the reserved headroom so it fits the 62px bar. */
const PINNED = {
  baseItemSize: 34,
  magnification: 46,
  panelHeight: 46,
  dockHeight: 46,
  distance: 130,
};
/* A phone bar has to fit the row beside the wordmark and the theme toggle, so it runs smaller. */
const PINNED_TIGHT = {
  baseItemSize: 30,
  magnification: 38,
  panelHeight: 38,
  dockHeight: 38,
  distance: 110,
};

/* Where the row stands in for the menu button rather than for a set of inline links. */
const TIGHT_QUERY = "(max-width: 640px)";
/* Narrower than this and even the shrunken row cannot share the bar with the logo. */
const PIN_QUERY = "(min-width: 360px)";

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
  const [tight, setTight] = useState(false);
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
  // Null until measured, and again whenever the row cannot be squeezed onto one line.
  const [fittedSize, setFittedSize] = useState(null);

  useEffect(() => {
    setSlot(document.getElementById("nav-dock-slot"));
  }, []);

  useEffect(() => {
    const queries = [
      window.matchMedia("(max-width: 860px)"),
      window.matchMedia(TIGHT_QUERY),
      window.matchMedia(PIN_QUERY),
    ];
    const sync = () => {
      setCompact(queries[0].matches);
      setTight(queries[1].matches);
      setCanPin(queries[2].matches);
    };

    sync();
    queries.forEach((query) => query.addEventListener("change", sync));
    return () => queries.forEach((query) => query.removeEventListener("change", sync));
  }, []);

  // Remember the inline footprint so the page does not jump when the dock leaves it.
  useEffect(() => {
    if (pinned || !anchorRef.current) return;
    setReservedHeight(anchorRef.current.offsetHeight);
  }, [pinned, compact, fittedSize]);

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
    // Measuring the anchor on every scroll frame forced a layout mid-scroll. The anchor
    // holds its footprint while pinned, so its offset only moves when the page reflows.
    let threshold = 0;

    function apply(next) {
      if (next === pinnedRef.current) return;
      pinnedRef.current = next;
      setPinned(next);
    }

    function remeasure() {
      threshold = anchor.getBoundingClientRect().bottom + window.scrollY - navHeight;
    }

    function evaluate() {
      frame = 0;

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

    function scheduleRemeasure() {
      remeasure();
      schedule();
    }

    remeasure();
    evaluate();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", scheduleRemeasure);

    // Fonts, images and route content settling all shift the anchor, and each of those
    // changes the page height, so this refreshes the cached offset without touching scroll.
    let bodyObserver;
    if (typeof ResizeObserver !== "undefined") {
      bodyObserver = new ResizeObserver(scheduleRemeasure);
      bodyObserver.observe(document.body);
    }

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      if (bodyObserver) bodyObserver.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", scheduleRemeasure);
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

  /*
   * Work out the largest tile that still leaves the whole row on one line. The panel's own
   * padding, borders and gap are read back from the stylesheet rather than repeated here, so
   * the two cannot drift apart. The anchor is measured instead of the panel because the panel
   * is only as wide as its contents, which is the very thing being sized.
   */
  useEffect(() => {
    const anchor = anchorRef.current;
    if (!compact || !anchor || typeof ResizeObserver === "undefined") {
      setFittedSize(null);
      return undefined;
    }

    function measure() {
      const panel = anchor.querySelector(".dock-panel");
      if (!panel) return;

      const styles = window.getComputedStyle(panel);
      const frame =
        parseFloat(styles.paddingLeft) +
        parseFloat(styles.paddingRight) +
        parseFloat(styles.borderLeftWidth) +
        parseFloat(styles.borderRightWidth);
      const gap = parseFloat(styles.columnGap) || 0;
      const room = anchor.clientWidth - frame - gap * (inlineItems.length - 1);
      const perItem = Math.floor(room / inlineItems.length);

      setFittedSize(perItem >= COMPACT_MIN ? Math.min(perItem, COMPACT_MAX) : null);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [compact, inlineItems.length, pinned]);

  return (
    <>
      <div
        className="dock-anchor"
        ref={anchorRef}
        style={pinned && reservedHeight ? { height: reservedHeight } : undefined}
      >
        {pinned ? null : (
          <Dock
            items={inlineItems}
            {...(compact ? compactSizing(fittedSize ?? COMPACT_MAX) : REGULAR)}
          />
        )}
      </div>
      {parked && slot
        ? createPortal(
            <Dock
              items={parkedItems}
              className={`dock-pinned${pinned ? "" : " dock-leaving"}`}
              {...(tight ? PINNED_TIGHT : PINNED)}
            />,
            slot,
          )
        : null}
    </>
  );
}
