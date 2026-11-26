"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

/**
 * Viewport-fixed ambient film for the homepage hero only.
 * Fades out (and pauses) once you scroll past the front-page messages.
 */
export default function HomeAtmosphere() {
  const [mountNode, setMountNode] = useState(null);
  const [opacity, setOpacity] = useState(1);
  const videoRef = useRef(null);
  const frameRef = useRef(0);

  useEffect(() => {
    setMountNode(document.body);
  }, []);

  useEffect(() => {
    if (!mountNode) return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function measure() {
      const hero = document.querySelector(".apple-hero");
      if (!hero) {
        setOpacity(1);
        return;
      }

      const rect = hero.getBoundingClientRect();
      // Stay fully visible while the hero fills most of the screen; fade as it leaves.
      const fadeStart = Math.min(window.innerHeight * 0.35, rect.height * 0.45);
      const fadeEnd = Math.min(window.innerHeight * 0.92, rect.height * 0.95);
      const gone = -rect.top;
      let next = 1;
      if (gone <= fadeStart) next = 1;
      else if (gone >= fadeEnd) next = 0;
      else next = 1 - (gone - fadeStart) / (fadeEnd - fadeStart);

      next = Math.max(0, Math.min(1, next));
      setOpacity(next);

      const video = videoRef.current;
      if (!video || reduced) return;
      if (next <= 0.02) {
        if (!video.paused) video.pause();
      } else if (video.paused) {
        video.play().catch(() => {});
      }
    }

    function onScroll() {
      if (frameRef.current) return;
      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = 0;
        measure();
      });
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current);
    };
  }, [mountNode]);

  if (!mountNode) return null;

  return createPortal(
    <div
      className="home-atmosphere"
      aria-hidden="true"
      style={{ opacity, visibility: opacity <= 0.01 ? "hidden" : "visible" }}
      data-faded={opacity <= 0.01 ? "true" : "false"}
    >
      <video
        ref={videoRef}
        className="home-atmosphere-video"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/media/home-atmosphere-poster.jpg"
      >
        <source src="/media/home-atmosphere.mp4" type="video/mp4" />
      </video>
      <div className="home-atmosphere-wash" />
    </div>,
    mountNode
  );
}
