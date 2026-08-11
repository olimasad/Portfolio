"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { Children, cloneElement, useEffect, useMemo, useRef, useState } from "react";

/** Room above the panel for a magnified icon plus its floating label. */
const LABEL_HEADROOM = 46;

function DockItem({
  children,
  className = "",
  onClick,
  mouseX,
  spring,
  distance,
  magnification,
  baseItemSize,
  label,
  index,
}) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);

  // Horizontal gap between the pointer and this item's centre, in viewport space.
  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return val - rect.x - baseItemSize / 2;
  });

  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize],
  );
  const size = useSpring(targetSize, spring);
  // The glyph grows with its tile, otherwise a magnified item reads as an empty box.
  // The clamped upper bound keeps the input range valid when magnification is disabled.
  const iconScale = useTransform(
    size,
    [baseItemSize, Math.max(magnification, baseItemSize + 1)],
    [1, 1.32],
  );

  return (
    <motion.button
      ref={ref}
      type="button"
      // Exposed so stylesheets can stagger entrances by position in the row.
      style={{ width: size, height: size, "--dock-index": index }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className={`dock-item ${className}`.trim()}
      aria-label={label}
    >
      {Children.map(children, (child) => cloneElement(child, { isHovered, iconScale }))}
    </motion.button>
  );
}

function DockLabel({ children, className = "", ...rest }) {
  const { isHovered } = rest;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isHovered) return undefined;
    const unsubscribe = isHovered.on("change", (latest) => setIsVisible(latest === 1));
    return () => unsubscribe();
  }, [isHovered]);

  return (
    <AnimatePresence>
      {isVisible ? (
        <motion.span
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: -10 }}
          exit={{ opacity: 0, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`dock-label ${className}`.trim()}
          role="tooltip"
          style={{ x: "-50%" }}
        >
          {children}
        </motion.span>
      ) : null}
    </AnimatePresence>
  );
}

function DockIcon({ children, className = "", ...rest }) {
  const { iconScale } = rest;

  return (
    <motion.span className={`dock-icon ${className}`.trim()} style={{ scale: iconScale }}>
      {children}
    </motion.span>
  );
}

export default function Dock({
  items = [],
  className = "",
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 68,
  dockHeight = 256,
  baseItemSize = 50,
}) {
  const mouseX = useMotionValue(Infinity);
  const reduceMotion = useReducedMotion();

  // Flat tiles when the visitor asked for less motion: the dock still works as buttons.
  const peakSize = reduceMotion ? baseItemSize : magnification;

  /*
   * The container reserves its tallest state up front instead of springing its own
   * height. Animating the height would shove the rest of the page down every time the
   * pointer crossed the dock, which is not something an inline nav strip should do.
   */
  const outerHeight = useMemo(
    () => Math.min(dockHeight, Math.max(panelHeight, peakSize + LABEL_HEADROOM)),
    [dockHeight, panelHeight, peakSize],
  );

  return (
    <div className="dock-outer" style={{ height: outerHeight }}>
      <div
        onMouseMove={({ clientX }) => mouseX.set(clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className={`dock-panel ${className}`.trim()}
        style={{ height: panelHeight }}
        role="toolbar"
        aria-label="Section navigation"
      >
        {items.map((item, index) => (
          <DockItem
            key={item.label}
            index={index}
            onClick={item.onClick}
            className={item.className}
            mouseX={mouseX}
            spring={spring}
            distance={distance}
            magnification={peakSize}
            baseItemSize={baseItemSize}
            label={item.label}
          >
            <DockIcon>{item.icon}</DockIcon>
            <DockLabel>{item.label}</DockLabel>
          </DockItem>
        ))}
      </div>
    </div>
  );
}
