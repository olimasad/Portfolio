"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const TAU = Math.PI * 2;
const IDLE_SPIN = 0.0022;
/** How long a freshly selected icon holds the front before the idle drift resumes. */
const SELECTION_DWELL_MS = 1400;

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/** Wrap an angle into (-PI, PI] so idle spin never accumulates whole turns. */
function normalizeAngle(angle) {
  return angle - TAU * Math.round(angle / TAU);
}

/** Signed distance from one angle to another along the shorter arc. */
function shortestDelta(from, to) {
  return normalizeAngle(to - from);
}

/**
 * Interactive 3D tag cloud (port of the Magic UI icon-cloud component).
 * Icons sit on a Fibonacci sphere; drag to spin, click an icon to rotate it to the front.
 */
export default function IconCloud({
  images = [],
  maxSize = 420,
  selectedIndex = -1,
  onSelect,
  highlightColor = "rgba(139, 115, 85, 0.16)",
}) {
  const wrapperRef = useRef(null);
  const canvasRef = useRef(null);
  const iconCanvasesRef = useRef([]);
  const imagesLoadedRef = useRef([]);
  const rotationRef = useRef({ x: 0, y: 0 });
  const pointerRef = useRef({ x: 0, y: 0 });
  const lastPointerRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const resumeIdleAtRef = useRef(0);
  const frameRef = useRef(0);
  const cursorRef = useRef("grab");

  const [size, setSize] = useState(maxSize);
  const [iconPositions, setIconPositions] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  // Only ever set from the reduced-motion query: the drift is decoration, so it is the one
  // thing here a visitor can switch off, and they do it at the OS level.
  const [isPaused, setIsPaused] = useState(false);
  const [targetRotation, setTargetRotation] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  // Front-most icons sit at radius + half an icon from the centre, so this keeps the sphere inside the canvas.
  const radius = size * 0.33;
  const iconSize = size * 0.105;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return undefined;

    function measure() {
      const width = wrapper.clientWidth;
      if (width > 0) setSize(Math.max(220, Math.min(maxSize, width)));
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, [maxSize]);

  // Park the virtual cursor at the centre so an untouched cloud drifts instead of
  // being dragged toward the top-left corner by a (0, 0) pointer.
  useEffect(() => {
    if (!draggingRef.current) pointerRef.current = { x: size / 2, y: size / 2 };
  }, [size]);

  // A cloud that is nowhere near the viewport still costs a canvas redraw per frame,
  // and that work lands in the middle of the scroll that is carrying it off screen.
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        setIsVisible(entries[entries.length - 1].isIntersecting);
      },
      { rootMargin: "200px 0px" }
    );

    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) setIsPaused(true);

    function handleChange(event) {
      setIsPaused(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Rasterise each icon once into an offscreen canvas at device resolution.
  useEffect(() => {
    const dpr = window.devicePixelRatio || 1;
    const pixels = Math.round(iconSize * dpr);
    imagesLoadedRef.current = new Array(images.length).fill(false);

    iconCanvasesRef.current = images.map((src, index) => {
      const offscreen = document.createElement("canvas");
      offscreen.width = pixels;
      offscreen.height = pixels;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return offscreen;

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = src;
      img.onload = () => {
        offCtx.clearRect(0, 0, pixels, pixels);
        offCtx.drawImage(img, 0, 0, pixels, pixels);
        imagesLoadedRef.current[index] = true;
      };
      return offscreen;
    });
  }, [images, iconSize]);

  useEffect(() => {
    const count = images.length;
    if (!count) {
      setIconPositions([]);
      return;
    }

    const offset = 2 / count;
    const increment = Math.PI * (3 - Math.sqrt(5));

    setIconPositions(
      Array.from({ length: count }, (_, i) => {
        const y = i * offset - 1 + offset / 2;
        const r = Math.sqrt(1 - y * y);
        const phi = i * increment;
        return { x: Math.cos(phi) * r, y, z: Math.sin(phi) * r, id: i };
      }),
    );
  }, [images]);

  const project = useCallback(
    (icon) => {
      const cosX = Math.cos(rotationRef.current.x);
      const sinX = Math.sin(rotationRef.current.x);
      const cosY = Math.cos(rotationRef.current.y);
      const sinY = Math.sin(rotationRef.current.y);

      const x = icon.x * radius;
      const y = icon.y * radius;
      const z = icon.z * radius;

      const rotatedX = x * cosY - z * sinY;
      const rotatedZ = x * sinY + z * cosY;
      const rotatedY = y * cosX + rotatedZ * sinX;

      return { rotatedX, rotatedY, rotatedZ };
    },
    [radius],
  );

  const hitTest = useCallback(
    (x, y) =>
      iconPositions.findIndex((icon) => {
        const { rotatedX, rotatedY, rotatedZ } = project(icon);
        const scale = (rotatedZ + 2 * radius) / (3 * radius);
        const hitRadius = (iconSize / 2) * scale;
        const dx = x - (size / 2 + rotatedX);
        const dy = y - (size / 2 + rotatedY);
        return dx * dx + dy * dy < hitRadius * hitRadius;
      }),
    [iconPositions, iconSize, project, radius, size],
  );

  // Bring the selected icon to the front, whether it was picked on the canvas or from the legend.
  useEffect(() => {
    const icon = iconPositions[selectedIndex];
    if (!icon) return;

    const startX = rotationRef.current.x;
    const startY = rotationRef.current.y;

    // Travel the short way round. Interpolating to the raw angle would unwind every
    // turn the idle spin had already banked, which reads as the cloud flying apart.
    const deltaX = shortestDelta(startX, -Math.atan2(icon.y, Math.hypot(icon.x, icon.z)));
    const deltaY = shortestDelta(startY, Math.atan2(icon.x, icon.z));
    const distance = Math.hypot(deltaX, deltaY);

    setTargetRotation({
      deltaX,
      deltaY,
      startX,
      startY,
      startTime: performance.now(),
      duration: Math.min(1100, Math.max(520, distance * 380)),
    });
  }, [iconPositions, selectedIndex]);

  function handlePointerDown(event) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hit = hitTest(x, y);

    if (hit >= 0) {
      onSelect?.(hit);
      return;
    }

    lastPointerRef.current = { x: event.clientX, y: event.clientY };
    draggingRef.current = true;
    setIsDragging(true);
    canvasRef.current.style.cursor = "grabbing";
    canvasRef.current?.setPointerCapture?.(event.pointerId);
  }

  function handlePointerMove(event) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      pointerRef.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    }

    if (!draggingRef.current) return;

    const deltaX = event.clientX - lastPointerRef.current.x;
    const deltaY = event.clientY - lastPointerRef.current.y;
    rotationRef.current = {
      x: normalizeAngle(rotationRef.current.x + deltaY * 0.002),
      // A front icon sits at screen x of -sin(y) * radius, so a rising angle carries the near
      // face leftward. The horizontal delta is subtracted to keep the face under the pointer.
      y: normalizeAngle(rotationRef.current.y - deltaX * 0.002),
    };
    lastPointerRef.current = { x: event.clientX, y: event.clientY };
  }

  function handlePointerUp(event) {
    if (draggingRef.current) {
      canvasRef.current?.releasePointerCapture?.(event.pointerId);
      draggingRef.current = false;
      setIsDragging(false);
    }
  }

  function handlePointerLeave(event) {
    handlePointerUp(event);
    pointerRef.current = { x: size / 2, y: size / 2 };
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !iconPositions.length || !isVisible) return undefined;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);

    const half = iconSize / 2;
    const center = size / 2;
    const maxDistance = Math.hypot(center, center);

    function animate() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const dx = pointerRef.current.x - center;
      const dy = pointerRef.current.y - center;
      const speed = 0.003 + (Math.hypot(dx, dy) / maxDistance) * 0.01;

      if (targetRotation) {
        const progress = Math.min(1, (performance.now() - targetRotation.startTime) / targetRotation.duration);
        const eased = easeOutCubic(progress);
        rotationRef.current = {
          x: targetRotation.startX + targetRotation.deltaX * eased,
          y: targetRotation.startY + targetRotation.deltaY * eased,
        };
        if (progress >= 1) {
          rotationRef.current = {
            x: normalizeAngle(rotationRef.current.x),
            y: normalizeAngle(rotationRef.current.y),
          };
          resumeIdleAtRef.current = performance.now() + SELECTION_DWELL_MS;
          setTargetRotation(null);
        }
      } else if (!draggingRef.current && !isPaused && performance.now() >= resumeIdleAtRef.current) {
        // A slow constant drift keeps the cloud alive even when the cursor is elsewhere.
        rotationRef.current = {
          x: normalizeAngle(rotationRef.current.x + (dy / size) * speed),
          y: normalizeAngle(rotationRef.current.y + IDLE_SPIN + (dx / size) * speed),
        };
      }

      iconPositions.forEach((icon, index) => {
        const { rotatedX, rotatedY, rotatedZ } = project(icon);
        const scale = (rotatedZ + 2 * radius) / (3 * radius);
        const isSelected = index === selectedIndex;
        const depthOpacity = Math.max(0.2, Math.min(1, (rotatedZ + 1.5 * radius) / (2 * radius)));

        if (!iconCanvasesRef.current[index] || !imagesLoadedRef.current[index]) return;

        ctx.save();
        ctx.translate(center + rotatedX, center + rotatedY);
        ctx.scale(scale, scale);

        if (isSelected) {
          ctx.beginPath();
          ctx.arc(0, 0, iconSize * 0.85, 0, Math.PI * 2);
          ctx.fillStyle = highlightColor;
          ctx.fill();
        }

        ctx.globalAlpha = isSelected ? Math.max(0.75, depthOpacity) : depthOpacity;
        ctx.drawImage(iconCanvasesRef.current[index], -half, -half, iconSize, iconSize);
        ctx.restore();
      });

      if (!draggingRef.current) {
        // Assigning the same cursor every frame still invalidates style, so only the
        // transitions between hovering an icon and empty space are written out.
        const nextCursor = hitTest(pointerRef.current.x, pointerRef.current.y) >= 0 ? "pointer" : "grab";
        if (nextCursor !== cursorRef.current) {
          cursorRef.current = nextCursor;
          canvas.style.cursor = nextCursor;
        }
      }

      const pendingAssets = !imagesLoadedRef.current.every(Boolean);
      if (!isPaused || draggingRef.current || targetRotation || pendingAssets) {
        frameRef.current = requestAnimationFrame(animate);
      }
    }

    animate();

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [
    highlightColor,
    hitTest,
    iconPositions,
    iconSize,
    isDragging,
    isPaused,
    isVisible,
    project,
    radius,
    selectedIndex,
    size,
    targetRotation,
  ]);

  return (
    <div className="icon-cloud" ref={wrapperRef}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className="icon-cloud-canvas"
        aria-label="Interactive 3D icon cloud"
        role="img"
      />
    </div>
  );
}
