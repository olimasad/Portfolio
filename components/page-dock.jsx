"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Dock from "./dock";
import { DOCK_ICONS } from "./dock-icons";

/*
 * Mid-page icon strip retired — the dock only parks in the navbar after you scroll
 * past a zero-height sentinel. Text nav links + sliding pod stay untouched until then.
 */

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
 * in navbar order.
 */
const NAV_PAGES = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/projects", label: "Projects", icon: "projects" },
  { href: "/achievements", label: "Achievements", icon: "achievements" },
  { href: "/contact", label: "Contact", icon: "contact" },
];

export default function PageDock({ currentHref = "/" }) {
  const router = useRouter();
  const anchorRef = useRef(null);
  const [tight, setTight] = useState(false);
  const [canPin, setCanPin] = useState(false);
  const [pinned, setPinned] = useState(false);
  // Trails `pinned` on the way out so the parked row survives long enough to play its exit
  // instead of being yanked out of the navbar the instant it is released.
  const [parked, setParked] = useState(false);
  // Mirrors `pinned` for the scroll handler, which needs the current value without
  // re-subscribing its listeners on every change.
  const pinnedRef = useRef(false);
  const [slot, setSlot] = useState(null);

  useEffect(() => {
    setSlot(document.getElementById("nav-dock-slot"));
  }, []);

  useEffect(() => {
    const queries = [window.matchMedia(TIGHT_QUERY), window.matchMedia(PIN_QUERY)];
    const sync = () => {
      setTight(queries[0].matches);
      setCanPin(queries[1].matches);
    };

    sync();
    queries.forEach((query) => query.addEventListener("change", sync));
    return () => queries.forEach((query) => query.removeEventListener("change", sync));
  }, []);

  /*
   * Hand the dock to the navbar only after the sentinel has scrolled up behind the bar.
   * Same scroll-position test as before — IntersectionObserver can false-pin at the top.
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

      if (threshold <= 0) {
        apply(false);
        return;
      }

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

  const parkedItems = NAV_PAGES.map((page) => ({
    label: page.label,
    icon: DOCK_ICONS[page.icon],
    // Home leads the row in from the right on every page, so the handover always plays the
    // same way round instead of the entrance moving with whatever page you happen to be on.
    className: page.href === "/" ? "dock-item-lead" : "",
    onClick: page.href === currentHref ? () => smoothScrollTo(0) : () => router.push(page.href),
  }));

  return (
    <>
      {/* Invisible sentinel — pin threshold only; no mid-page icon strip */}
      <div className="dock-anchor dock-anchor-sentinel" ref={anchorRef} aria-hidden="true" />
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
