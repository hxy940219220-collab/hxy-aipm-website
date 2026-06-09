"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

/* Simple reticle cursor — dot follows mouse, 4 corner brackets lock onto .cursor-target elements.
   Uses elementsFromPoint for reliable hit detection, no event delegation issues. */

export function CustomCursor() {
  const reduced = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement[]>([]);
  const lockedRef = useRef<DOMRect | null>(null);
  const rafRef = useRef(0);
  const posRef = useRef({ x: -100, y: -100 });

  useEffect(() => {
    if (reduced) return;

    const wrapper = wrapperRef.current;
    const dot = dotRef.current;
    const corners = cornersRef.current;
    if (!wrapper || !dot || corners.length < 4) return;

    document.body.style.cursor = "none";

    // Position elements
    wrapper.style.transform = "translate(-50%, -50%) rotate(0deg)";
    dot.style.transform = "translate(-50%, -50%)";
    let idleAngle = 0;

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const loop = () => {
      const { x, y } = posRef.current;

      // Move the whole wrapper (dot + corners follow together)
      wrapper.style.left = `${x}px`;
      wrapper.style.top = `${y}px`;

      // Check if we're over a .cursor-target
      const els = document.elementsFromPoint(x, y);
      let target: Element | null = null;
      for (const el of els) {
        if (el.matches?.(".cursor-target") || el.closest?.(".cursor-target")) {
          target = el.matches?.(".cursor-target") ? el : el.closest(".cursor-target");
          break;
        }
      }

      if (target) {
        // Locked: stop rotation, snap to 0deg
        wrapper.style.transition = "transform 0.25s ease-out";
        wrapper.style.transform = `translate(-50%, -50%) rotate(0deg)`;
        idleAngle = 0;

        const rect = target.getBoundingClientRect();
        lockedRef.current = rect;

        // Animate corners to target bounds
        const tl = { x: rect.left - x, y: rect.top - y };
        const tr = { x: rect.right - x, y: rect.top - y };
        const br = { x: rect.right - x, y: rect.bottom - y };
        const bl = { x: rect.left - x, y: rect.bottom - y };

        corners[0].style.transition = "transform 0.18s ease-out";
        corners[1].style.transition = "transform 0.18s ease-out";
        corners[2].style.transition = "transform 0.18s ease-out";
        corners[3].style.transition = "transform 0.18s ease-out";

        corners[0].style.transform = `translate(${tl.x - 8}px, ${tl.y - 8}px)`;
        corners[1].style.transform = `translate(${tr.x}px, ${tr.y - 8}px)`;
        corners[2].style.transform = `translate(${br.x}px, ${br.y}px)`;
        corners[3].style.transform = `translate(${bl.x - 8}px, ${bl.y}px)`;

        dot.style.opacity = "0";
        corners.forEach((c) => (c.style.opacity = "1"));
      } else {
        // Idle: slow continuous rotation
        idleAngle += 0.8;
        wrapper.style.transition = "none";
        wrapper.style.transform = `translate(-50%, -50%) rotate(${idleAngle}deg)`;

        lockedRef.current = null;
        // Return corners to cursor
        corners[0].style.transition = "transform 0.25s ease-out";
        corners[1].style.transition = "transform 0.25s ease-out";
        corners[2].style.transition = "transform 0.25s ease-out";
        corners[3].style.transition = "transform 0.25s ease-out";

        corners[0].style.transform = "translate(-14px, -14px)";
        corners[1].style.transform = "translate(2px, -14px)";
        corners[2].style.transform = "translate(2px, 2px)";
        corners[3].style.transform = "translate(-14px, 2px)";

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

  if (reduced) return null;

  return (
    <div
      ref={wrapperRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none"
      style={{ width: 0, height: 0 }}
      aria-hidden="true"
    >
      {/* Center dot */}
      <div
        ref={dotRef}
        className="absolute w-[5px] h-[5px] bg-neon-cyan rounded-full"
        style={{ left: "50%", top: "50%", boxShadow: "0 0 14px rgba(0,200,255,0.95)" }}
      />

      {/* 4 corner brackets */}
      {["tl", "tr", "br", "bl"].map((pos, i) => {
        const isLeft = pos.includes("l");
        const isTop = pos.includes("t");
        return (
          <div
            key={pos}
            ref={(el) => { if (el) cornersRef.current[i] = el; }}
            className="absolute opacity-70"
            style={{
              left: "50%",
              top: "50%",
              width: "10px",
              height: "10px",
              borderLeft: isLeft ? "2px solid #00c8ff" : "none",
              borderRight: !isLeft ? "2px solid #00c8ff" : "none",
              borderTop: isTop ? "2px solid #00c8ff" : "none",
              borderBottom: !isTop ? "2px solid #00c8ff" : "none",
              boxShadow: "0 0 9px rgba(0,200,255,0.65)",
              transform:
                i === 0 ? "translate(-14px, -14px)" :
                i === 1 ? "translate(2px, -14px)" :
                i === 2 ? "translate(2px, 2px)" :
                "translate(-14px, 2px)",
            }}
          />
        );
      })}
    </div>
  );
}
