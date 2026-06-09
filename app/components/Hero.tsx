"use client";

import { useRef, useEffect } from "react";
import { motion, useReducedMotion } from "motion/react";
import SplitText from "../reactbits/TextAnimations/SplitText/SplitText";
export function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const play = () => v.play().catch(() => {});
    play();
    document.addEventListener("click", play, { once: true });
    return () => document.removeEventListener("click", play);
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden bg-bg-deepest"
    >
      {/* Background blurred layer - full cover */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full h-full object-cover blur-[40px] brightness-[0.3] scale-110"
        >
          <source src="/HXY-AIPM-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Foreground clear video - contain to preserve full composition */}
      <div className="absolute inset-0 z-[1] flex items-center justify-center" aria-hidden="true">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="max-w-full max-h-full object-contain"
        >
          <source src="/HXY-AIPM-video.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 z-[2] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, rgba(5,5,9,0.4) 80%, rgba(5,5,9,0.8) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Bottom fade to black */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[3] pointer-events-none h-[40%]"
        style={{
          background: "linear-gradient(to top, #050509 0%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      {/* Content overlay - bottom left */}
      <div className="absolute inset-0 z-[4] pointer-events-none flex flex-col justify-end p-6 md:p-10 md:pb-14 w-full">
        <div className="pointer-events-auto space-y-3 md:space-y-4 max-w-[640px]">
          {/* Name */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={reduced ? {} : { opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {reduced ? (
              <div className="flex flex-col">
                <h1 className="font-display italic text-[clamp(48px,9vw,104px)] leading-[0.92] tracking-[-0.02em] text-white">
                  黄锡源
                </h1>
                <span className="font-display font-normal text-[clamp(20px,4vw,44px)] text-text-secondary">
                  AI 产品经理
                </span>
              </div>
            ) : (
              <div className="flex flex-col">
                <SplitText
                  text="黄锡源"
                  tag="h1"
                  className="font-display italic text-[clamp(48px,9vw,104px)] leading-[0.92] tracking-[-0.02em] text-white"
                  delay={50}
                  duration={1.2}
                  from={{ opacity: 0, y: 80, filter: "blur(10px)" }}
                  to={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  ease="power4.out"
                  threshold={0.2}
                  rootMargin="-50px"
                />
                <SplitText
                  text="AI 产品经理"
                  tag="span"
                  className="font-display font-normal text-[clamp(20px,4vw,44px)] text-text-secondary"
                  delay={30}
                  duration={0.9}
                  from={{ opacity: 0, y: 24 }}
                  to={{ opacity: 1, y: 0 }}
                  ease="power3.out"
                  threshold={0.2}
                  rootMargin="-50px"
                />
              </div>
            )}
          </motion.div>

          {/* Description */}
          <motion.p
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-body text-sm md:text-[15px] text-text-tertiary leading-relaxed"
          >
            聚焦模型、Agent 与 Workflow 的产品化设计。<br />
            把前沿能力转化为真实可用的产品体验。
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={reduced ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            className="flex gap-3.5 flex-wrap pt-1"
          >
            <motion.a
                href="#work"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-target inline-flex items-center px-6 py-3 rounded-full font-body text-[13.5px] font-medium tracking-[0.04em] no-underline cursor-pointer bg-white text-black border-none transition-all duration-300 hover:bg-neon-cyan hover:shadow-[0_0_36px_rgba(0,200,255,0.4)]"
              >
                查看作品
                <span className="ml-2 text-xs opacity-60 transition-all duration-300 group-hover:translate-x-0.5">&rarr;</span>
              </motion.a>
            <motion.a
                href="#about"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#about")?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-target inline-flex items-center px-6 py-3 rounded-full font-body text-[13.5px] font-medium tracking-[0.04em] text-white no-underline border border-white/[0.15] bg-white/[0.04] backdrop-blur-[10px] transition-all duration-300 hover:border-neon-pink hover:bg-white/[0.08] hover:shadow-[0_0_28px_rgba(216,76,255,0.12)]"
              >
                关于我
              </motion.a>
            <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-target inline-flex items-center px-6 py-3 rounded-full font-body text-[13.5px] font-medium tracking-[0.04em] text-white no-underline border border-white/[0.15] bg-white/[0.04] backdrop-blur-[10px] transition-all duration-300 hover:border-neon-pink hover:bg-white/[0.08] hover:shadow-[0_0_28px_rgba(216,76,255,0.12)]"
              >
                联系
              </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
