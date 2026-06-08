"use client";

import BlurText from "../reactbits/TextAnimations/BlurText/BlurText";
import { ScrollReveal } from "./ScrollReveal";

const STEPS = [
  {
    letter: "A",
    title: "发问",
    label: "问题定义",
    desc: "找到真正的问题，而不是追逐表面的 AI 热点。先明确用户任务与场景边界，再决定 AI 应该承担什么角色。",
    color: "bg-neon-cyan shadow-[0_0_20px_#00c8ff]",
  },
  {
    letter: "I",
    title: "构想",
    label: "工作流设计",
    desc: "把模型能力转译为用户能理解的场景和体验。将模型、Agent 与规则机制编排成可理解、可迭代的中间流程。",
    color: "bg-neon-gold shadow-[0_0_20px_#ffd84a]",
  },
  {
    letter: "P",
    title: "原型",
    label: "快速验证",
    desc: "快速构建可感知、可测试、可传播的产品原型。结合 Vibe Coding 进行低成本试错与迭代。",
    color: "bg-neon-pink shadow-[0_0_20px_#d84cff]",
  },
  {
    letter: "M",
    title: "度量",
    label: "产品验证",
    desc: "通过原型、发布与反馈，判断产品是否真的解决问题并值得继续放大。",
    color: "bg-neon-orange shadow-[0_0_20px_#ff6a1a]",
  },
];

const RESEARCH_TOPICS = [
  {
    num: "01",
    title: "Harness Engineering",
    desc: "关注 AI 协作流程中的约束设计、反馈闭环与执行稳定性，思考如何持续提升人机协同质量。",
    href: "https://www.huangxiyuan.net/harness-engineering.html",
  },
  {
    num: "02",
    title: "Claude Code 源码设计逻辑",
    desc: "关注客户端中的任务组织、工具协作与交互设计，理解工程实现如何映射产品判断。",
    href: "https://learn-claude-code-visual.vercel.app/index.html",
  },
  {
    num: "03",
    title: "Hermes × OpenClaw 对比研究",
    desc: "对比两者在产品定位、交互路径、能力边界与落地场景上的差异，理解 AI 工具如何形成不同的使用范式。",
    href: "https://www.huangxiyuan.net/hermes-vs-openclaw.html",
  },
  {
    num: "04",
    title: "前沿资讯追踪与落地方法",
    desc: "通过 OpenAI Research、Anthropic RSP、Google DeepMind 等一手信息拆解能力变化、产品机会与验证方法。",
    href: undefined,
  },
];

export function Method() {
  return (
    <section
      id="method"
      className="relative z-10 w-full px-6 md:px-12 py-16 md:py-24"
    >
      {/* Header */}
      <div className="text-center mb-14">
        <ScrollReveal>
          <p className="font-body text-[10.5px] font-medium tracking-[0.20em] text-text-tertiary uppercase mb-6">
            工作流蓝图
          </p>
        </ScrollReveal>
        <div className="flex flex-col items-center gap-0">
          <BlurText
            text="AI 产品的关键，不止是模型接入"
            className="font-display italic text-[clamp(36px,5vw,56px)] leading-[1.1] text-white"
            delay={40}
            animateBy="words"
            direction="top"
          />
          <BlurText
            text="更在于流程如何被设计"
            className="font-display italic text-[clamp(36px,5vw,56px)] leading-[1.1] text-text-tertiary"
            delay={40}
            animateBy="words"
            direction="top"
          />
        </div>
      </div>

      {/* A-I-P-M Timeline */}
      <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-8 mb-16">
        <div
          className="hidden lg:block absolute top-6 left-[60px] right-[60px] h-px z-0 opacity-40"
          style={{
            background:
              "linear-gradient(90deg, #00c8ff, #ffd84a, #d84cff, #ff6a1a)",
          }}
          aria-hidden="true"
        />

        {STEPS.map((step, i) => (
          <ScrollReveal key={step.letter} delay={0.08 * (i + 1)}>
            <div className="relative z-[1] text-center lg:text-left lg:flex lg:gap-5 lg:items-start">
              <div className="flex justify-center lg:block lg:mt-1.5 lg:flex-shrink-0 mb-7 lg:mb-0">
                <div className={`relative z-[2] w-3 h-3 rounded-full ${step.color}`}>
                  <div className="absolute -inset-1.5 rounded-full border border-white/[0.15] animate-[dotPulse_3s_ease-in-out_infinite]" />
                </div>
              </div>
              <div>
                <p className="font-display italic text-5xl leading-none text-white mb-3">
                  {step.letter}
                </p>
                <h3 className="font-body text-sm font-semibold tracking-[0.06em] text-text-secondary uppercase mb-1">
                  {step.title}
                </h3>
                <p className="font-body text-[10.5px] tracking-[0.1em] text-text-muted mb-2 uppercase">{step.label}</p>
                <p className="text-[13px] text-text-tertiary leading-relaxed max-w-[220px] lg:max-w-none">
                  {step.desc}
                </p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Research Archive */}
      <div>
        <ScrollReveal>
          <p className="font-body text-[10.5px] font-medium tracking-[0.20em] text-text-tertiary uppercase mb-8 text-center">
            研究归档
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {RESEARCH_TOPICS.map((topic, i) => {
            const Card = topic.href ? 'a' : 'div';
            return (
            <ScrollReveal key={topic.num} delay={0.1 * (i + 1)}>
              <Card
                {...(topic.href ? { href: topic.href, target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`block p-6 rounded-2xl bg-white/[0.025] border border-white/[0.06] transition-all duration-500 hover:border-neon-cyan/30 hover:bg-white/[0.04] ${
                  topic.href ? 'cursor-pointer no-underline hover:shadow-[0_0_32px_rgba(0,200,255,0.06)]' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="font-body text-[11px] font-medium tracking-[0.12em] text-neon-cyan">
                    {topic.num}
                  </p>
                  {topic.href && (
                    <span className="text-neon-cyan/50 text-xs transition-transform duration-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      &#x2197;
                    </span>
                  )}
                </div>
                <h3 className="font-display italic text-[22px] text-white mb-2">
                  {topic.title}
                </h3>
                <p className="text-[13px] text-text-tertiary leading-relaxed">
                  {topic.desc}
                </p>
              </Card>
            </ScrollReveal>
          );
        })}
        </div>
      </div>
    </section>
  );
}
