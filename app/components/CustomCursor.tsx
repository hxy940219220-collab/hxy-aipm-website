"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";

/* Custom neon cursor — small glowing dot + larger halo ring with spring follow.
   Expands on interactive elements (links, buttons). */

export function CustomCursor() {
  const reduced = useReducedMotion();
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const haloX = useSpring(cursorX, { damping: 25, stiffness: 150, mass: 0.5 });
  const haloY = useSpring(cursorY, { damping: 25, stiffness: 150, mass: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const isVisible = useRef(false);

  useEffect(() => {
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible.current) {
        isVisible.current = true;
      }
    };

    const onEnter = () => { isVisible.current = true; };
    const onLeave = () => { isVisible.current = false; };

    // Detect hover over interactive elements
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor-expand]")
      ) {
        setIsHovering(true);
        document.body.style.cursor = "none";
      }
    };

    const onOut = () => {
      setIsHovering(false);
      document.body.style.cursor = "none";
    };

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseenter", onEnter);
    window.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseenter", onEnter);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [reduced, cursorX, cursorY]);

  if (reduced) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" aria-hidden="true">
      {/* Halo ring — spring-follows with delay */}
      <motion.div
        className="absolute top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border border-neon-cyan/30"
        style={{
          x: haloX,
          y: haloY,
        }}
        animate={{
          scale: isHovering ? 2.5 : 1,
          borderColor: isHovering
            ? "rgba(216, 76, 255, 0.5)"
            : "rgba(0, 200, 255, 0.3)",
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Core dot — direct follow */}
      <motion.div
        className="absolute top-0 left-0 w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-neon-cyan"
        style={{
          x: cursorX,
          y: cursorY,
        }}
        animate={{
          scale: isHovering ? 3 : 1,
          backgroundColor: isHovering ? "#d84cff" : "#00c8ff",
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Outer glow */}
      <motion.div
        className="absolute top-0 left-0 w-16 h-16 -ml-8 -mt-8 rounded-full blur-xl opacity-20"
        style={{
          x: cursorX,
          y: cursorY,
          backgroundColor: isHovering ? "#d84cff" : "#00c8ff",
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
