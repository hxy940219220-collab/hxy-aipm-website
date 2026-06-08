"use client";

import BlurText from "../reactbits/TextAnimations/BlurText/BlurText";
import { ScrollReveal } from "./ScrollReveal";

const CAPABILITIES = [
  {
    num: "01",
    title: "产品化能力",
    subtitle: "AI 产品落地",
    desc: "关注模型能力与真实需求是否匹配，优先推进清晰、可用、可验证的产品表达。",
    tags: ["问题定义", "体验逻辑", "价值验证"],
  },
  {
    num: "02",
    title: "Agent 系统",
    subtitle: "Agent 与 Workflow",
    desc: "关注任务拆解、流程编排与协作逻辑，思考 Agent 机制如何在产品中形成稳定且可持续的体验。",
    tags: ["任务路由", "流程结构", "反馈闭环"],
  },
  {
    num: "03",
    title: "快速验证",
    subtitle: "快速验证与迭代",
    desc: "结合大模型与 Vibe Coding 进行低成本试错，让产品想法尽快进入验证与调整周期。",
    tags: ["原型冲刺", "低成本迭代", "公开发布"],
  },
];

export function About() {
  return (
    <section
      id="about"
      className="relative z-10 w-full px-6 md:px-12 py-16 md:py-24"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-start">
        {/* Left */}
        <div>
          <ScrollReveal>
            <p className="font-body text-[10.5px] font-medium tracking-[0.20em] text-text-tertiary uppercase mb-6">
              关于
            </p>
          </ScrollReveal>

          <BlurText
            text="在产品逻辑与创意直觉之间。"
            className="font-display italic text-[clamp(32px,4.5vw,48px)] leading-[1.12] text-white mb-7"
            delay={40}
            animateBy="words"
            direction="top"
          />

          <ScrollReveal delay={0.3}>
            <p className="text-[15px] text-text-secondary leading-relaxed mb-4 max-w-[480px]">
              我是黄锡源 (HXY)，一名 AI 产品经理，聚焦模型、Agent 与 Workflow 的产品化设计。我熟练利用大模型、Agent、Workflow 与 Vibe Coding 进行产品设计与快速验证，也持续关注前沿资讯、Harness Engineering 以及 Claude Code 客户端源码中的设计逻辑。
            </p>
            <p className="text-sm text-text-tertiary leading-relaxed mb-9">
              我擅长把复杂的 AI 能力拆解成清晰的产品路径，也喜欢用视觉、交互和叙事让产品更有记忆点。不是为了堆砌技术词，而是为了更快定义问题、验证方向，并把能力稳定地组织成产品体验。
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.4}>
            <div className="flex flex-wrap gap-2.5">
              {["AI 产品规划", "用户体验设计", "原型搭建", "增长与商业分析", "多 Agent / 自动化系统", "个人品牌与创意表达"].map((tag) => (
                <span
                  key={tag}
                  className="px-4 md:px-5 py-2 rounded-full font-body text-[12px] font-medium tracking-[0.04em] text-text-secondary bg-white/[0.04] border border-white/[0.1]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </ScrollReveal>
        </div>

        {/* Right: capabilities */}
        <div className="flex flex-col gap-8">
          {CAPABILITIES.map((cap, i) => (
            <ScrollReveal key={cap.num} delay={0.12 * (i + 1)}>
              <div className="border-l border-white/[0.1] pl-6 transition-colors duration-500 hover:border-neon-cyan">
                <p className="font-body text-[11px] font-medium tracking-[0.12em] text-text-muted mb-1">
                  {cap.num}
                </p>
                <h3 className="font-display italic text-[26px] text-white mb-1">
                  {cap.title}
                </h3>
                <p className="font-body text-[12px] tracking-[0.08em] text-text-muted uppercase mb-2">{cap.subtitle}</p>
                <p className="text-sm text-text-tertiary leading-relaxed mb-3">
                  {cap.desc}
                </p>
                <div className="flex gap-2 flex-wrap">
                  {cap.tags.map((t) => (
                    <span key={t} className="px-3 py-1 rounded-full font-body text-[10.5px] text-text-muted bg-white/[0.03] border border-white/[0.06]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
