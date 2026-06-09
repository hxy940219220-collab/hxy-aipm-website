"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/* Reticle cursor — dot at exact cursor position + 4 corner brackets.
   Rotates corners only (dot stays fixed). Locks onto .cursor-target elements.
   Hidden on touch devices (mobile/tablet). */

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef(0);
  const posRef = useRef({ x: -100, y: -100 });

  // Hide on touch devices
  useEffect(() => {
    if (isTouchDevice()) {
      setHidden(true);
      document.body.style.cursor = "";
    }
  }, []);

  useEffect(() => {
    if (reduced) return;

    const dot = dotRef.current;
    const spin = spinRef.current;
    const corners = cornersRef.current;
    if (!dot || !spin || corners.length < 4) return;

    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const loop = () => {
      const { x, y } = posRef.current;

      // Position dot and spin wrapper at cursor
      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      spin.style.left = `${x}px`;
      spin.style.top = `${y}px`;

      // Check for .cursor-target under cursor
      const els = document.elementsFromPoint(x, y);
      let target: Element | null = null;
      for (const el of els) {
        if (el.matches?.(".cursor-target")) {
          target = el;
          break;
        }
      }

      if (target) {
        // Locked — stop spin, corners snap to target bounds
        spin.classList.remove("cursor-spin");
        const rect = target.getBoundingClientRect();

        corners[0].style.transition = "left 0.18s ease-out, top 0.18s ease-out";
        corners[1].style.transition = "left 0.18s ease-out, top 0.18s ease-out";
        corners[2].style.transition = "left 0.18s ease-out, top 0.18s ease-out";
        corners[3].style.transition = "left 0.18s ease-out, top 0.18s ease-out";

        // Corner positions relative to spin wrapper (at cursor x,y)
        corners[0].style.left = `${rect.left - x - 2}px`; corners[0].style.top = `${rect.top - y - 2}px`;
        corners[1].style.left = `${rect.right - x - 8}px`; corners[1].style.top = `${rect.top - y - 2}px`;
        corners[2].style.left = `${rect.right - x - 8}px`; corners[2].style.top = `${rect.bottom - y - 8}px`;
        corners[3].style.left = `${rect.left - x - 2}px`; corners[3].style.top = `${rect.bottom - y - 8}px`;

        dot.style.opacity = "0";
        corners.forEach((c) => (c.style.opacity = "1"));
      } else {
        // Idle — spin corners around cursor
        spin.classList.add("cursor-spin");
        corners[0].style.transition = "none";
        corners[1].style.transition = "none";
        corners[2].style.transition = "none";
        corners[3].style.transition = "none";

        // Idle: corners offset from spin wrapper center (which is at cursor)
        corners[0].style.left = `${-14}px`; corners[0].style.top = `${-14}px`;
        corners[1].style.left = `${2}px`;   corners[1].style.top = `${-14}px`;
        corners[2].style.left = `${2}px`;   corners[2].style.top = `${2}px`;
        corners[3].style.left = `${-14}px`; corners[3].style.top = `${2}px`;

        dot.style.opacity = "1";
        corners.forEach((c) => (c.style.opacity = "0.7"));
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced]);

  if (reduced || hidden) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" aria-hidden="true">
      {/* Center dot — positioned directly at cursor */}
      <div
        ref={dotRef}
        className="absolute w-[5px] h-[5px] bg-neon-cyan rounded-full -ml-[2.5px] -mt-[2.5px]"
        style={{ boxShadow: "0 0 14px rgba(0,200,255,0.95)" }}
      />

      {/* Spinning wrapper for corner brackets */}
      <div ref={spinRef} className="cursor-spin absolute" style={{ left: 0, top: 0, width: 0, height: 0 }}>
        {["tl", "tr", "br", "bl"].map((pos, i) => (
          <div
            key={pos}
            ref={(el) => { if (el) cornersRef.current[i] = el; }}
            className="absolute opacity-70"
            style={{
              width: "10px",
              height: "10px",
              borderLeft: pos.includes("l") ? "2px solid #00c8ff" : "none",
              borderRight: !pos.includes("l") ? "2px solid #00c8ff" : "none",
              borderTop: pos.includes("t") ? "2px solid #00c8ff" : "none",
              borderBottom: !pos.includes("t") ? "2px solid #00c8ff" : "none",
              boxShadow: "0 0 9px rgba(0,200,255,0.65)",
              left: "-100px",
              top: "-100px",
            }}
          />
        ))}
      </div>
    </div>
  );
}
