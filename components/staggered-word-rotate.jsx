"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// No blur: an incoming and an outgoing word animate at the same time, so a blur here means
// forty separately blurred characters re-rasterising every frame, twice every few seconds.
const letterVariants = {
  initial: {
    y: -8,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
  exit: {
    y: 8,
    opacity: 0,
  },
};

const wordVariants = {
  animate: {
    transition: {
      staggerChildren: 0.02,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.02,
    },
  },
};

function splitToChars(text) {
  return Array.from(text);
}

export default function StaggeredWordRotate({
  words = [],
  interval = 2300,
  className = "",
}) {
  const [index, setIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const wrapperRef = useRef(null);

  // This sits in the hero, so it is off screen for most of the page. Left running it kept
  // mutating inline styles on every character while the visitor scrolled somewhere else,
  // and that dirty style state made every scroll frame more expensive than it had to be.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver((entries) => {
      setIsVisible(entries[entries.length - 1].isIntersecting);
    });

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  // A swap re-renders every character and animates two words at once. Starting one in the
  // middle of a scroll costs a frame exactly when the visitor would notice, so swaps wait
  // for the page to settle. Nobody is reading the tagline while the page is moving anyway.
  useEffect(() => {
    let idleTimer = 0;

    function handleScroll() {
      setIsScrolling(true);
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => setIsScrolling(false), 180);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (words.length < 2 || !isVisible || isScrolling) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return undefined;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, interval);

    return () => window.clearInterval(timer);
  }, [words, interval, isVisible, isScrolling]);

  if (!words.length) return null;

  const current = words[index % words.length];
  const chars = splitToChars(current);

  return (
    <span ref={wrapperRef} className={`staggered-word-rotate ${className}`.trim()} aria-live="polite">
      <span className="staggered-word-rotate-sizer" aria-hidden="true">
        {words.map((word) => (
          <span key={word} className="staggered-word-rotate-sizer-item">
            {word}
          </span>
        ))}
      </span>

      <AnimatePresence mode="sync" initial={false}>
        <motion.span
          key={current}
          className="staggered-word-rotate-word"
          variants={wordVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {chars.map((char, charIndex) => (
            <motion.span
              key={`${current}-${charIndex}`}
              className="staggered-word-rotate-char"
              variants={letterVariants}
              transition={{
                duration: 0.38,
                ease: [0.33, 1, 0.32, 1],
              }}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
