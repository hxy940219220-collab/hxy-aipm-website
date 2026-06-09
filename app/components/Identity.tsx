"use client";

import BlurText from "../reactbits/TextAnimations/BlurText/BlurText";
import { ScrollReveal } from "./ScrollReveal";

const TOOLS = [
  { label: "大模型能力", desc: "熟练调用与编排 GPT、Claude、Gemini 等前沿模型" },
  { label: "Agent 系统", desc: "关注任务拆解、流程编排与人机协作机制" },
  { label: "Workflow 设计", desc: "把模型、规则与交互编织成可迭代的产品流程" },
  { label: "Vibe Coding", desc: "利用 AI 辅助编程进行快速原型与产品验证" },
];

const FOCUS = [
  { label: "真实产品问题", desc: "从用户真正卡住的瞬间出发，不追概念" },
  { label: "Agent 产品化落地", desc: "把 Agent 能力稳定地组织到产品体验中" },
  { label: "前沿方法论研究", desc: "持续追踪 Harness Engineering 与 Claude Code 设计逻辑" },
];

export function Identity() {
  return (
    <section
      id="identity"
      className="relative z-10 w-full px-6 md:px-12 py-16 md:py-24"
    >
      <ScrollReveal>
        <p className="font-body text-[10.5px] font-medium tracking-[0.20em] text-text-tertiary uppercase mb-6">
          个人定位 // HX-01
        </p>
      </ScrollReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left */}
        <div>
          <BlurText
            text="把前沿能力转化为真实可用的产品体验"
            className="font-display italic text-[clamp(36px,5vw,56px)] leading-[1.08] tracking-[-0.02em] text-white"
            delay={40}
            animateBy="words"
            direction="top"
          />
          <ScrollReveal delay={0.3}>
            <p className="font-body text-[15px] text-text-tertiary mt-5 leading-relaxed">
              更关注问题定义、交互路径、工作流设计与验证效率之间是否形成闭环，而不是只停留在概念层面。
            </p>
          </ScrollReveal>
        </div>

        {/* Right: tools + focus */}
        <div className="flex flex-col gap-7">
          <ScrollReveal delay={0.2}>
            <div>
              <p className="font-body text-[11px] font-medium tracking-[0.12em] text-text-muted uppercase mb-4">
                核心工具栈
              </p>
              <div className="flex flex-wrap gap-2.5">
                {TOOLS.map((t) => (
                  <span key={t.label} title={t.desc}
                    className="px-4 py-2 rounded-full font-body text-[12px] font-medium tracking-[0.04em] text-text-secondary bg-white/[0.04] border border-white/[0.1] cursor-default"
                  >
                    {t.label}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div>
              <p className="font-body text-[11px] font-medium tracking-[0.12em] text-text-muted uppercase mb-4">
                当前关注
              </p>
              <div className="flex flex-wrap gap-2.5">
                {FOCUS.map((f) => (
                  <span key={f.label} title={f.desc}
                    className="px-4 py-2 rounded-full font-body text-[12px] font-medium tracking-[0.04em] text-neon-cyan bg-neon-cyan/[0.06] border border-neon-cyan/[0.2] cursor-default"
                  >
                    {f.label}
                  </span>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
