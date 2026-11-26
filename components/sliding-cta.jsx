"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

const ACTIONS = [
  { key: "projects", href: "/projects", label: "View Projects", kind: "link" },
  { key: "achievements", href: "/achievements", label: "Achievements", kind: "link" },
  { key: "contact", href: "/contact", label: "Get in Touch", kind: "link" },
];

export default function SlidingCta() {
  const rowRef = useRef(null);
  const itemRefs = useRef([]);
  const activeIndexRef = useRef(0);
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });
  const [activeKey, setActiveKey] = useState(ACTIONS[0].key);

  const moveTo = useCallback((index, { animate = true } = {}) => {
    const row = rowRef.current;
    const item = itemRefs.current[index];
    if (!row || !item) return;

    // offsetLeft/Width are layout coords — immune to the reveal transform that
    // makes getBoundingClientRect lie about size while the entrance is in flight.
    const left = item.offsetLeft;
    const width = item.offsetWidth;
    if (width < 8) return;

    activeIndexRef.current = index;
    setActiveKey(ACTIONS[index].key);
    setPill({
      left,
      width,
      ready: true,
      // Skip the width slide on cold measure so a wrong first size never eases in
      instant: !animate,
    });
  }, []);

  useLayoutEffect(() => {
    moveTo(0, { animate: false });
  }, [moveTo]);

  useEffect(() => {
    let cancelled = false;

    const sync = (animate = false) => {
      if (cancelled) return;
      moveTo(activeIndexRef.current, { animate });
    };

    // Remeasure after webfonts settle — fallback metrics are what made the pill too wide.
    const fontsReady =
      document.fonts && document.fonts.ready
        ? document.fonts.ready.then(() => sync(false))
        : Promise.resolve();

    const onResize = () => sync(false);
    window.addEventListener("resize", onResize);

    const row = rowRef.current;
    const observer =
      typeof ResizeObserver !== "undefined" && row
        ? new ResizeObserver(() => sync(false))
        : null;
    if (observer && row) observer.observe(row);
    itemRefs.current.forEach((item) => {
      if (observer && item) observer.observe(item);
    });

    // One late pass after reveal/layout paint
    const late = window.setTimeout(() => sync(false), 420);

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      observer?.disconnect();
      window.clearTimeout(late);
      void fontsReady;
    };
  }, [moveTo]);

  return (
    <div ref={rowRef} className="apple-cta-row apple-cta-slide intro-item" data-reveal="bottom">
      <span
        className={`apple-cta-pill${pill.ready ? " is-ready" : ""}${pill.instant ? " is-instant" : ""}`}
        aria-hidden="true"
        style={{
          transform: `translate3d(${pill.left}px, 0, 0)`,
          width: `${pill.width}px`,
        }}
      />
      {ACTIONS.map((action, index) => {
        const className = `apple-cta-item${activeKey === action.key ? " is-active" : ""}`;
        const sharedProps = {
          className,
          onMouseEnter: () => moveTo(index, { animate: true }),
          onFocus: () => moveTo(index, { animate: true }),
        };
        const setRef = (node) => {
          itemRefs.current[index] = node;
        };

        return (
          <Link key={action.key} ref={setRef} href={action.href} {...sharedProps}>
            {action.label}
          </Link>
        );
      })}
    </div>
  );
}
