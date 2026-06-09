"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion } from "motion/react";

/* Clean spotlight cursor — translucent circle tracking mouse via motionValue (no re-renders).
   Expands smoothly on interactive elements. No delay, no spring. */

export function CustomCursor() {
  const reduced = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const [hover, setHover] = useState(false);

  useEffect(() => {
    if (reduced) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };

    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.tagName === "A" || el.tagName === "BUTTON" || el.closest("a") || el.closest("button")) {
        setHover(true);
      }
    };
    const onOut = () => setHover(false);

    document.body.style.cursor = "none";
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
    };
  }, [reduced, x, y]);

  if (reduced) return null;

  return (
    <motion.div
      className="fixed top-0 left-0 z-[9999] pointer-events-none rounded-full"
      style={{
        x,
        y,
        translateX: "-50%",
        translateY: "-50%",
      }}
      animate={{
        width: hover ? 56 : 18,
        height: hover ? 56 : 18,
        backgroundColor: hover ? "rgba(216, 76, 255, 0.12)" : "rgba(0, 200, 255, 0.08)",
        boxShadow: hover
          ? "0 0 48px rgba(216, 76, 255, 0.22), 0 0 96px rgba(216, 76, 255, 0.08)"
          : "0 0 20px rgba(0, 200, 255, 0.15), 0 0 48px rgba(0, 200, 255, 0.04)",
      }}
      transition={{ duration: 0.18, ease: "easeOut" }}
    />
  );
}
