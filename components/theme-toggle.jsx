"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "theme";
const TRANSITION_MS = 700;

function getStoredTheme() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "dark" || stored === "light") return stored;
  } catch {
    /* ignore */
  }
  return "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "dark" ? "#171512" : "#f7f7f4");
  }
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function setThemeVars(nextTheme) {
  try {
    localStorage.setItem(STORAGE_KEY, nextTheme);
  } catch {
    /* ignore */
  }
  applyTheme(nextTheme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState("dark");
  const [animating, setAnimating] = useState(false);
  const transitionTimer = useRef(null);

  useEffect(() => {
    const next = getStoredTheme();
    setTheme(next);
    applyTheme(next);

    return () => {
      if (transitionTimer.current) {
        window.clearTimeout(transitionTimer.current);
      }
    };
  }, []);

  function finishSoftTransition(root) {
    if (transitionTimer.current) {
      window.clearTimeout(transitionTimer.current);
    }
    transitionTimer.current = window.setTimeout(() => {
      root.classList.remove("theme-transition");
      setAnimating(false);
      transitionTimer.current = null;
    }, TRANSITION_MS);
  }

  async function toggleTheme(event) {
    if (animating) return;

    const root = document.documentElement;
    const next = theme === "dark" ? "light" : "dark";
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    ) * 1.06;

    setAnimating(true);
    root.style.setProperty("--theme-x", `${x}px`);
    root.style.setProperty("--theme-y", `${y}px`);
    root.style.setProperty("--theme-r", `${endRadius}px`);

    const commit = () => {
      setTheme(next);
      setThemeVars(next);
    };

    if (prefersReducedMotion() || typeof document.startViewTransition !== "function") {
      root.classList.add("theme-transition");
      commit();
      finishSoftTransition(root);
      return;
    }

    root.classList.add("theme-revealing");

    try {
      const transition = document.startViewTransition(commit);
      await transition.ready;

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: TRANSITION_MS,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );

      await transition.finished;
    } catch {
      root.classList.add("theme-transition");
      commit();
      finishSoftTransition(root);
      return;
    } finally {
      root.classList.remove("theme-revealing");
      setAnimating(false);
    }
  }

  return (
    <button
      type="button"
      className={`theme-toggle${animating ? " is-animating" : ""}`}
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span className="theme-toggle-glow" aria-hidden="true" />
      <svg className="theme-toggle-icon-moon" viewBox="0 0 24 24" aria-hidden="true">
        <path
          d="M21 14.3A8.5 8.5 0 0 1 9.7 3 7.2 7.2 0 1 0 21 14.3z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <svg className="theme-toggle-icon-sun" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="M12 2.5v2.2M12 19.3v2.2M4.7 4.7l1.6 1.6M17.7 17.7l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.7 19.3l1.6-1.6M17.7 6.3l1.6-1.6"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
