"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

/* Reticle cursor — 4 种状态：
   1. 默认 · 漫游 — dot + 4 corner brackets 缓慢旋转
   2. 链接悬停 · 聚焦 — dot 消失，corners 贴附元素边缘
   3. 按钮悬停 · 磁吸 — corners 贴附按钮圆角，颜色跟随按钮 accent
   4. 文字选择 · 隐退 — 光标整体淡出，选文结束后恢复
   触屏设备自动隐藏。 */

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

// 检测元素是否为按钮类型
function isButtonLike(el: Element): boolean {
  if (el.tagName === "BUTTON") return true;
  if (el.tagName === "A" && (el as HTMLAnchorElement).href) {
    // 检查是否看起来像按钮 (有特定 class 或是 CTA)
    const cls = el.className || "";
    if (cls.includes("rounded-full") || cls.includes("btn") || cls.includes("cta")) return true;
  }
  return false;
}

const CORNER_SIZE = 10;
const DOT_SIZE = 5;

export function CustomCursor() {
  const reduced = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const dotRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<HTMLDivElement[]>([]);
  const rafRef = useRef(0);
  const posRef = useRef({ x: -100, y: -100 });
  const selectingRef = useRef(false);
  const prevStateRef = useRef<"roam" | "link" | "button" | "select">("roam");

  // 触屏隐藏
  useEffect(() => {
    if (isTouchDevice()) {
      setHidden(true);
      document.body.style.cursor = "";
    }
  }, []);

  useEffect(() => {
    if (reduced || hidden) return;

    const dot = dotRef.current;
    const spin = spinRef.current;
    const corners = cornersRef.current;
    if (!dot || !spin || corners.length < 4) return;

    document.body.style.cursor = "none";

    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    // 检测文字选择状态
    const onSelectionChange = () => {
      const sel = window.getSelection();
      const hasSelection = !!(sel && sel.toString().length > 0 && sel.type === "Range");
      selectingRef.current = hasSelection;
    };

    const loop = () => {
      const { x, y } = posRef.current;

      dot.style.left = `${x}px`;
      dot.style.top = `${y}px`;
      spin.style.left = `${x}px`;
      spin.style.top = `${y}px`;

      // 文字选择中 → 隐退光标
      if (selectingRef.current) {
        prevStateRef.current = "select";
        dot.style.opacity = "0";
        dot.style.transition = "opacity 0.2s";
        corners.forEach((c) => {
          c.style.opacity = "0";
          c.style.transition = "opacity 0.2s";
        });
        spin.classList.remove("cursor-spin");
        rafRef.current = requestAnimationFrame(loop);
        return;
      }

      // 检测光标下的元素
      const els = document.elementsFromPoint(x, y);
      let target: Element | null = null;
      let isButton = false;

      for (const el of els) {
        if (el.matches?.(".cursor-target")) {
          target = el;
          isButton = isButtonLike(el);
          break;
        }
        // 也检查 cursor-target 的父元素
        if (el.closest?.(".cursor-target")) {
          target = el.closest(".cursor-target");
          isButton = isButtonLike(target!);
          break;
        }
      }

      if (target) {
        spin.classList.remove("cursor-spin");

        if (isButton) {
          // 按钮磁吸 — corners 贴附按钮圆角边缘
          prevStateRef.current = "button";
          const rect = target.getBoundingClientRect();
          const br = 24; // 按钮圆角半径 (匹配 rounded-full)

          corners.forEach((c) => {
            c.style.transition = "left 0.15s ease-out, top 0.15s ease-out";
          });

          // Corners 略微内收，贴合圆角按钮的视觉边缘
          const inset = 4;
          corners[0].style.left = `${rect.left - x + inset}px`;
          corners[0].style.top = `${rect.top - y + inset}px`;
          corners[1].style.left = `${rect.right - x - CORNER_SIZE - inset}px`;
          corners[1].style.top = `${rect.top - y + inset}px`;
          corners[2].style.left = `${rect.right - x - CORNER_SIZE - inset}px`;
          corners[2].style.top = `${rect.bottom - y - CORNER_SIZE - inset}px`;
          corners[3].style.left = `${rect.left - x + inset}px`;
          corners[3].style.top = `${rect.bottom - y - CORNER_SIZE - inset}px`;

          dot.style.opacity = "0";
          corners.forEach((c) => (c.style.opacity = "1"));
        } else {
          // 链接聚焦 — corners 贴附元素矩形边缘
          prevStateRef.current = "link";
          const rect = target.getBoundingClientRect();

          corners.forEach((c) => {
            c.style.transition = "left 0.18s ease-out, top 0.18s ease-out";
          });

          corners[0].style.left = `${rect.left - x - 2}px`;
          corners[0].style.top = `${rect.top - y - 2}px`;
          corners[1].style.left = `${rect.right - x - CORNER_SIZE + 2}px`;
          corners[1].style.top = `${rect.top - y - 2}px`;
          corners[2].style.left = `${rect.right - x - CORNER_SIZE + 2}px`;
          corners[2].style.top = `${rect.bottom - y - CORNER_SIZE + 2}px`;
          corners[3].style.left = `${rect.left - x - 2}px`;
          corners[3].style.top = `${rect.bottom - y - CORNER_SIZE + 2}px`;

          dot.style.opacity = "0";
          corners.forEach((c) => (c.style.opacity = "1"));
        }
      } else {
        // 默认漫游 — dot 可见，corners 围绕旋转
        prevStateRef.current = "roam";
        spin.classList.add("cursor-spin");

        corners.forEach((c) => {
          c.style.transition = "none";
        });

        // 四角 brackets 以光标为中心完美对称
        // 每个 corner 宽高 10px，inner edge 距中心 4px，inner gap = 8px
        corners[0].style.left = `${-14}px`; corners[0].style.top = `${-14}px`; // ↖ 右边缘=-4, 下边缘=-4
        corners[1].style.left = `${4}px`;   corners[1].style.top = `${-14}px`; // ↗ 左边缘=4,  下边缘=-4
        corners[2].style.left = `${4}px`;   corners[2].style.top = `${4}px`;   // ↘ 左边缘=4,  上边缘=4
        corners[3].style.left = `${-14}px`; corners[3].style.top = `${4}px`;   // ↙ 右边缘=-4, 上边缘=4

        dot.style.opacity = "1";
        dot.style.transition = "opacity 0.15s";
        corners.forEach((c) => {
          c.style.opacity = "0.7";
          c.style.transition = "opacity 0.15s";
        });
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("selectionchange", onSelectionChange);
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("selectionchange", onSelectionChange);
      cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, hidden]);

  if (reduced || hidden) return null;

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none" aria-hidden="true">
      {/* 中心点 */}
      <div
        ref={dotRef}
        className="absolute rounded-full -ml-[2.5px] -mt-[2.5px]"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          backgroundColor: "#00c8ff",
          boxShadow: "0 0 14px rgba(0,200,255,0.95)",
        }}
      />

      {/* 四角括号旋转容器 */}
      <div ref={spinRef} className="cursor-spin absolute" style={{ left: 0, top: 0, width: 0, height: 0 }}>
        {["tl", "tr", "br", "bl"].map((pos, i) => (
          <div
            key={pos}
            ref={(el) => { if (el) cornersRef.current[i] = el; }}
            className="absolute opacity-70"
            style={{
              width: CORNER_SIZE,
              height: CORNER_SIZE,
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
