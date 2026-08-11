"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import IconCloud from "./icon-cloud";
import { techIconUrl } from "../lib/tech-icons";

/** Icons are tinted to match the theme so every logo stays legible on both backgrounds. */
const THEME = {
  light: { tint: "3d3429", highlight: "rgba(139, 115, 85, 0.16)" },
  dark: { tint: "f0ebe3", highlight: "rgba(196, 168, 130, 0.2)" },
};

/**
 * An interactive icon cloud paired with a detail panel for whatever is selected.
 * Items need `id`, `label`, `icon`, `tldr`, and `usedIn`; see lib/skills.js.
 */
export default function IconCloudPanel({
  items,
  maxSize,
  // Prompt shown until something is picked. Pass null for either to leave it out.
  emptyTitle = "Pick a skill",
  emptyHint = "Drag the cloud to spin it, then click any icon to see what it is and which projects it shows up in.",
}) {
  const [theme, setTheme] = useState("light");
  const [selectedIndex, setSelectedIndex] = useState(-1);

  useEffect(() => {
    const root = document.documentElement;

    function read() {
      setTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light");
    }

    read();
    const observer = new MutationObserver(read);
    observer.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const images = useMemo(
    () => items.map((item) => techIconUrl(item, THEME[theme].tint)),
    [items, theme],
  );

  const selected = items[selectedIndex];

  return (
    <>
      <div className="home-skills-cloud">
        <IconCloud
          images={images}
          maxSize={maxSize}
          selectedIndex={selectedIndex}
          onSelect={setSelectedIndex}
          highlightColor={THEME[theme].highlight}
        />
        <ul className="icon-cloud-legend">
          {items.map((item, index) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-pressed={index === selectedIndex}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="skill-detail" aria-live="polite">
        {/* Keying on the item remounts the panel, so each selection replays the fade-in. */}
        <div className="skill-detail-body" key={selected ? selected.id : "empty"}>
          {selected ? (
            <>
              <h3>{selected.label}</h3>
              <p className="skill-detail-tldr">{selected.tldr}</p>
              <p className="skill-detail-label">Where I used it</p>
              <div className="skill-detail-links">
                {selected.usedIn.map((use, index) => (
                  <Link
                    key={use.detailId}
                    href={`/detail/${use.detailId}`}
                    className="skill-detail-link"
                    style={{ "--link-index": index }}
                  >
                    {use.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </div>
            </>
          ) : (
            <>
              {emptyTitle ? <h3>{emptyTitle}</h3> : null}
              {emptyHint ? <p className="skill-detail-tldr">{emptyHint}</p> : null}
            </>
          )}
        </div>
      </div>
    </>
  );
}
