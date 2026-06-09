"use client";

import { ScrollReveal } from "./ScrollReveal";

export function Footer() {
  return (
    <footer className="relative z-10 w-full px-6 md:px-12 py-12 md:pb-10 flex flex-col md:flex-row justify-between md:items-end gap-6 border-t border-white/[0.06]">
      <div>
        <ScrollReveal>
          <p className="font-body text-[13px] font-semibold tracking-[0.08em] text-white">
            黄锡源 HXY / AIPM
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.08}>
          <p className="text-[11px] text-text-muted mt-2">
            AI 产品经理 · 聚焦模型、Agent 与 Workflow 的产品化设计
          </p>
        </ScrollReveal>
      </div>
      <ScrollReveal delay={0.12}>
        <p className="font-body text-xs text-text-tertiary tracking-[0.04em]">
          Product &times; AI &times; Agent &times; Design
        </p>
      </ScrollReveal>
    </footer>
  );
}
