"use client";

import { ScrollReveal } from "./ScrollReveal";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";
import BlurText from "../reactbits/TextAnimations/BlurText/BlurText";
import { GooglePlayLogo, GithubLogo } from "@phosphor-icons/react";

/* 3D Tilt card wrapper */
function TiltWrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rotateX = useSpring(useMotionValue(0), { damping: 25, stiffness: 120, mass: 1.5 });
  const rotateY = useSpring(useMotionValue(0), { damping: 25, stiffness: 120, mass: 1.5 });

  function handleMouse(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -5);
    rotateY.set((offsetX / (rect.width / 2)) * 5);
  }

  function handleLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <div ref={ref} className={`[perspective:800px] ${className}`} onMouseMove={handleMouse} onMouseLeave={handleLeave}>
      <motion.div style={{ rotateX, rotateY }} className="[transform-style:preserve-3d] h-full">
        {children}
      </motion.div>
    </div>
  );
}

export function Work() {
  return (
    <section
      id="work"
      className="relative z-10 w-full px-6 md:px-12 py-16 md:py-24"
    >
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14 mb-12">
        <BlurText
          text="代表项目"
          className="font-display italic text-[clamp(40px,6vw,64px)] leading-[1.05] text-white"
          delay={50}
          animateBy="words"
          direction="top"
        />
        <ScrollReveal delay={0.2}>
          <p className="text-[15px] text-text-tertiary leading-relaxed self-end pb-2">
            把真实问题转成可用的 AI 产品。我会从具体使用场景出发，先定义用户真正卡住的瞬间，再用 AI、交互结构和快速工程实现把它落到可体验的产品里。
          </p>
        </ScrollReveal>
      </div>

      {/* Project cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
        {/* IdeaFlash */}
        <ScrollReveal delay={0.08}>
          <TiltWrap className="h-full">
            <motion.div
              whileHover={{ y: -6 }}
              className="relative rounded-[20px] overflow-hidden bg-[#0c0c1a] border border-white/[0.10] shadow-[0_4px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-[550ms] hover:border-neon-cyan/30 hover:shadow-[0_0_60px_rgba(0,200,255,0.10),0_32px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col h-full"
            >
              <div className="aspect-[16/9] relative overflow-hidden bg-[#0c0c1a] shrink-0">
                <img
                  src="/ideaflash.png"
                  alt="IdeaFlash 灵感胶囊"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <div className="flex gap-2 flex-wrap mb-3.5">
                  <span className="font-body text-[10.5px] font-medium tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border border-neon-cyan text-neon-cyan">AI</span>
                  <span className="font-body text-[10.5px] font-medium tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border border-white/[0.12] text-text-tertiary">产品</span>
                  <span className="font-body text-[10.5px] font-medium tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border border-white/[0.12] text-text-tertiary">Android</span>
                </div>
                <h3 className="font-display italic text-[26px] text-white mb-1.5">
                  IdeaFlash · 灵感胶囊
                </h3>
                <p className="text-[13px] text-text-tertiary leading-relaxed mb-4">
                  用最快路径捕捉转瞬即逝灵感，交给 AI 自动转写、提炼、生成卡片。
                </p>
                <p className="text-[11px] tracking-[0.12em] uppercase text-text-muted mb-1.5">不做复杂笔记，而做灵感捕捉器</p>
                <p className="text-[12px] text-text-tertiary/60 leading-relaxed mb-4">
                  核心不是让用户写得更完整，而是在想法最脆弱的一瞬间把它接住，整理与结构化交给 AI 在后面完成。
                </p>
                <a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="cursor-target inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-orange/10 border border-neon-orange/30 text-neon-orange font-body text-[12px] font-medium tracking-[0.04em] no-underline transition-all duration-400 hover:bg-neon-orange/20 hover:shadow-[0_0_24px_rgba(255,106,26,0.2)] mt-auto self-start"
                >
                  <GooglePlayLogo size={14} weight="fill" />
                  点击即刻下载
                </a>
              </div>
            </motion.div>
          </TiltWrap>
        </ScrollReveal>

        {/* FocusMeow */}
        <ScrollReveal delay={0.16}>
          <TiltWrap className="h-full">
            <motion.div
              whileHover={{ y: -6 }}
              className="relative rounded-[20px] overflow-hidden bg-[#0c0c1a] border border-white/[0.10] shadow-[0_4px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.03)] transition-all duration-[550ms] hover:border-neon-pink/30 hover:shadow-[0_0_60px_rgba(216,76,255,0.10),0_32px_80px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col h-full"
            >
              <div className="aspect-[16/9] relative overflow-hidden bg-[#0c0c1a] shrink-0">
                <img
                  src="/focusmeow.png"
                  alt="FocusMeow 专注喵"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 md:p-7 flex flex-col flex-1">
                <div className="flex gap-2 flex-wrap mb-3.5">
                  <span className="font-body text-[10.5px] font-medium tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border border-neon-pink text-neon-pink">AI</span>
                  <span className="font-body text-[10.5px] font-medium tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border border-white/[0.12] text-text-tertiary">React Native</span>
                  <span className="font-body text-[10.5px] font-medium tracking-[0.08em] uppercase px-3 py-1.5 rounded-full border border-white/[0.12] text-text-tertiary">iOS</span>
                </div>
                <h3 className="font-display italic text-[26px] text-white mb-1.5">
                  FocusMeow · 专注喵
                </h3>
                <p className="text-[13px] text-text-tertiary leading-relaxed mb-4">
                  用猫咪陪伴、成长奖励与 AI 反馈，驱动长期专注习惯形成的情感化 app。
                </p>
                <p className="text-[11px] tracking-[0.12em] uppercase text-text-muted mb-1.5">不把它做成"又一个番茄钟"</p>
                <p className="text-[12px] text-text-tertiary/60 leading-relaxed mb-4">
                  四层叠加的产品骨架——专注工具层、游戏养成层、情感陪伴层、智能解释层，让效率与情绪同时成立。
                </p>
                <div className="flex gap-3 flex-wrap mt-auto">
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="cursor-target inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-neon-pink/10 border border-neon-pink/30 text-neon-pink font-body text-[12px] font-medium tracking-[0.04em] no-underline transition-all duration-400 hover:bg-neon-pink/20 hover:shadow-[0_0_24px_rgba(216,76,255,0.2)]"
                  >
                    <GithubLogo size={14} weight="fill" />
                    GitHub
                  </a>
                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="cursor-target inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.05] border border-white/[0.15] text-white font-body text-[12px] font-medium tracking-[0.04em] no-underline transition-all duration-400 hover:border-neon-cyan hover:bg-white/[0.1]"
                  >
                    Product Hunt
                  </a>
                </div>
              </div>
            </motion.div>
          </TiltWrap>
        </ScrollReveal>
      </div>
    </section>
  );
}
