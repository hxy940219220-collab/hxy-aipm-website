"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/* Reusable scroll-reveal wrapper.
   Uses Motion whileInView with blur + y-offset entry.
   Degrades to static under reduced-motion.

   variant 预设:
   - "heading" — 大标题，大位移 + 强模糊，power4.out
   - "body"    — 正文，小位移 + 轻模糊
   - "card"    — 卡片/区块，适中参数
   - "cta"     — CTA 按钮，无模糊 + 弹性缓动
   - "image"   — 图片/媒体，缩放入场
   - 不传则使用默认值 */

type RevealVariant = "heading" | "body" | "card" | "cta" | "image";

const VARIANTS: Record<RevealVariant, { y: number; blur: number; scale?: number; duration: number; ease: readonly [number, number, number, number] }> = {
  heading:  { y: 36, blur: 16, duration: 1.1, ease: [0.16, 1, 0.3, 1] },
  body:     { y: 18, blur: 6,  duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  card:     { y: 32, blur: 10, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  cta:      { y: 24, blur: 0,  duration: 0.6, ease: [0.34, 1.56, 0.64, 1] },
  image:    { y: 0,  blur: 12, scale: 0.94, duration: 0.85, ease: [0.16, 1, 0.3, 1] },
};

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className = "",
  variant,
  delay = 0,
  duration,
}: ScrollRevealProps) {
  const reduced = useReducedMotion();

  const preset = variant ? VARIANTS[variant] : null;

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: preset?.y ?? 28,
        filter: `blur(${preset?.blur ?? 8}px)`,
        scale: preset?.scale ?? 1,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
      }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: duration ?? preset?.duration ?? 0.9,
        delay,
        ease: preset?.ease ?? [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
