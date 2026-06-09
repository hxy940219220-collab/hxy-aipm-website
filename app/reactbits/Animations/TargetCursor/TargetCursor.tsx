"use client";

import { useEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "gsap";
import "./TargetCursor.css";

const getContainingBlock = (element: HTMLElement | null): HTMLElement | null => {
  let node: HTMLElement | null = element?.parentElement ?? null;
  while (node && node !== document.documentElement) {
    const style = getComputedStyle(node);
    if (
      style.transform !== "none" ||
      style.perspective !== "none" ||
      style.filter !== "none" ||
      style.willChange.includes("transform") ||
      style.willChange.includes("perspective") ||
      style.willChange.includes("filter") ||
      /paint|layout|strict|content/.test(style.contain)
    ) {
      return node;
    }
    node = node.parentElement;
  }
  return null;
};

const getContainingBlockOffset = (block: HTMLElement | null) => {
  if (!block) return { x: 0, y: 0 };
  const rect = block.getBoundingClientRect();
  return { x: rect.left + block.clientLeft, y: rect.top + block.clientTop };
};

interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
  proximityRadius?: number;
}

export default function TargetCursor({
  targetSelector = ".cursor-target",
  spinDuration = 3,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
  proximityRadius = 80,
}: TargetCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<Element> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const containingBlockRef = useRef<HTMLElement | null>(null);
  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<Array<{ x: number; y: number }> | null>(null);
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const small = window.innerWidth <= 768;
    const ua = (navigator.userAgent || "").toLowerCase();
    return (hasTouch && small) || /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
  }, []);

  const borderWidth = 3;
  const cornerSize = 10;

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) return;
    const { x: ox, y: oy } = getContainingBlockOffset(containingBlockRef.current);
    gsap.to(cursorRef.current, { x: x - ox, y: y - oy, duration: 0.1, ease: "power3.out" });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) document.body.style.cursor = "none";

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll(".target-cursor-corner");
    containingBlockRef.current = getContainingBlock(cursor);
    const getOffset = () => getContainingBlockOffset(containingBlockRef.current);

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener("mouseleave", currentLeaveHandler);
        currentLeaveHandler = null;
      }
    };

    const initOffset = getOffset();
    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2 - initOffset.x,
      y: window.innerHeight / 2 - initOffset.y,
    });

    const createSpin = () => {
      spinTl.current?.kill();
      spinTl.current = gsap.timeline({ repeat: -1 }).to(cursor, {
        rotation: "+=360",
        duration: spinDuration,
        ease: "none",
      });
    };
    createSpin();

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) return;
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;

      const cx = gsap.getProperty(cursorRef.current, "x") as number;
      const cy = gsap.getProperty(cursorRef.current, "y") as number;
      const corners = Array.from(cornersRef.current);

      corners.forEach((corner, i) => {
        const curX = gsap.getProperty(corner, "x") as number;
        const curY = gsap.getProperty(corner, "y") as number;
        const tx = targetCornerPositionsRef.current![i].x - cx;
        const ty = targetCornerPositionsRef.current![i].y - cy;
        const fx = curX + (tx - curX) * strength;
        const fy = curY + (ty - curY) * strength;
        const dur = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        gsap.to(corner, { x: fx, y: fy, duration: dur, ease: dur === 0 ? "none" : "power1.out", overwrite: "auto" });
      });
    };
    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => {
      moveCursor(e.clientX, e.clientY);

      // Proximity detection: pre-lock nearby targets / release when far away
      let closest: Element | null = null;
      let closestDist = Infinity;

      document.querySelectorAll(targetSelector).forEach((el) => {
        const rect = el.getBoundingClientRect();
        const cx = e.clientX;
        const cy = e.clientY;
        const nearX = Math.max(rect.left - proximityRadius, Math.min(cx, rect.right + proximityRadius));
        const nearY = Math.max(rect.top - proximityRadius, Math.min(cy, rect.bottom + proximityRadius));
        const dist = Math.hypot(cx - nearX, cy - nearY);
        if (dist < closestDist && dist <= proximityRadius) {
          closestDist = dist;
          closest = el;
        }
      });

      if (closest && !isActiveRef.current) {
        const fakeEvent = { target: closest } as unknown as MouseEvent;
        enterHandler(fakeEvent);
      } else if (!closest && isActiveRef.current && currentLeaveHandler) {
        currentLeaveHandler();
      }
    };
    window.addEventListener("mousemove", moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const { x: ox, y: oy } = getOffset();
      const mx = (gsap.getProperty(cursorRef.current, "x") as number) + ox;
      const my = (gsap.getProperty(cursorRef.current, "y") as number) + oy;
      const elUnder = document.elementFromPoint(mx, my);
      if (elUnder && elUnder !== activeTarget && elUnder.closest(targetSelector) !== activeTarget) {
        currentLeaveHandler?.();
      }
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    const mouseDown = () => {
      if (dotRef.current) gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };
    const mouseUp = () => {
      if (dotRef.current) gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };
    window.addEventListener("mousedown", mouseDown);
    window.addEventListener("mouseup", mouseUp);

    const enterHandler = (e: Event) => {
      const evt = e as MouseEvent;
      const directTarget = evt.target as Element;
      const allTargets: Element[] = [];
      let cur: Element | null = directTarget;
      while (cur && cur !== document.body) {
        if (cur.matches(targetSelector)) allTargets.push(cur);
        cur = cur.parentElement;
      }
      const target = allTargets[0] ?? null;
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null; }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach((c) => gsap.killTweensOf(c));
      gsap.killTweensOf(cursorRef.current, "rotation");
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      const rect = target.getBoundingClientRect();
      const { x: ox, y: oy } = getOffset();
      const cx = gsap.getProperty(cursorRef.current, "x") as number;
      const cy = gsap.getProperty(cursorRef.current, "y") as number;

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth - ox, y: rect.top - borderWidth - oy },
        { x: rect.right + borderWidth - cornerSize - ox, y: rect.top - borderWidth - oy },
        { x: rect.right + borderWidth - cornerSize - ox, y: rect.bottom + borderWidth - cornerSize - oy },
        { x: rect.left - borderWidth - ox, y: rect.bottom + borderWidth - cornerSize - oy },
      ];

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current!);
      gsap.to(activeStrengthRef, { current: 1, duration: hoverDuration, ease: "power2.out" });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current![i].x - cx,
          y: targetCornerPositionsRef.current![i].y - cy,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current!);
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef, { current: 0, overwrite: true });
        activeTarget = null;

        if (cornersRef.current) {
          const cs = Array.from(cornersRef.current);
          gsap.killTweensOf(cs);
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 },
          ];
          cs.forEach((corner, idx) => {
            gsap.to(corner, { x: positions[idx].x, y: positions[idx].y, duration: 0.3, ease: "power3.out" });
          });
        }

        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current) {
            const curRot = gsap.getProperty(cursorRef.current, "rotation") as number;
            const norm = ((curRot % 360) + 360) % 360;
            spinTl.current?.kill();
            spinTl.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, {
              rotation: "+=360", duration: spinDuration, ease: "none",
            });
            gsap.to(cursorRef.current, {
              rotation: norm + 360,
              duration: spinDuration * (1 - norm / 360),
              ease: "none",
              onComplete: () => spinTl.current?.restart(),
            });
          }
          resumeTimeout = null;
        }, 50);
        cleanupTarget(target);
      };

      currentLeaveHandler = leaveHandler;
      target.addEventListener("mouseleave", leaveHandler);
    };

    window.addEventListener("mouseover", enterHandler, { passive: true });

    const resizeHandler = () => { containingBlockRef.current = getContainingBlock(cursor); };
    window.addEventListener("resize", resizeHandler);

    return () => {
      tickerFnRef.current && gsap.ticker.remove(tickerFnRef.current);
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseover", enterHandler);
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", resizeHandler);
      window.removeEventListener("mousedown", mouseDown);
      window.removeEventListener("mouseup", mouseUp);
      if (activeTarget) cleanupTarget(activeTarget);
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current = { current: 0 };
    };
  }, [targetSelector, spinDuration, moveCursor, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  useEffect(() => {
    if (isMobile || !cursorRef.current || !spinTl.current) return;
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap.timeline({ repeat: -1 }).to(cursorRef.current, {
        rotation: "+=360", duration: spinDuration, ease: "none",
      });
    }
  }, [spinDuration, isMobile]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} className="target-cursor-wrapper">
      <div ref={dotRef} className="target-cursor-dot" />
      <div className="target-cursor-corner corner-tl" />
      <div className="target-cursor-corner corner-tr" />
      <div className="target-cursor-corner corner-br" />
      <div className="target-cursor-corner corner-bl" />
    </div>
  );
}
