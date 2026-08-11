"use client";

import { useEffect, useRef, useState } from "react";

const COUNT_MS = 1100;

function easeOutExpo(t) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function StatsBand({ stats }) {
  const bandRef = useRef(null);
  const frameRef = useRef(0);
  const [counts, setCounts] = useState(() => stats.map(() => 0));

  useEffect(() => {
    const band = bandRef.current;
    if (!band) return undefined;

    const targets = stats.map((stat) => stat.value);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCounts(targets);
      return undefined;
    }

    function run() {
      const start = performance.now();

      function step(now) {
        const progress = Math.min(1, (now - start) / COUNT_MS);
        const eased = easeOutExpo(progress);
        setCounts(targets.map((target) => Math.round(target * eased)));
        if (progress < 1) frameRef.current = requestAnimationFrame(step);
      }

      frameRef.current = requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          observer.unobserve(entry.target);
          run();
        });
      },
      { threshold: 0.4 },
    );

    observer.observe(band);

    return () => {
      observer.disconnect();
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [stats]);

  return (
    <div className="stats-band" ref={bandRef} data-reveal="bottom">
      {stats.map((stat, index) => (
        <div key={stat.label} className="stats-band-item" style={{ "--stat-index": index }}>
          <span className="stats-band-value">
            {counts[index]}
            {stat.suffix ? <span className="stats-band-suffix">{stat.suffix}</span> : null}
          </span>
          <span className="stats-band-label">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}
