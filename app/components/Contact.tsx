"use client";

import BlurText from "../reactbits/TextAnimations/BlurText/BlurText";
import ShinyText from "../reactbits/TextAnimations/ShinyText/ShinyText";
import { motion } from "motion/react";
import { ScrollReveal } from "./ScrollReveal";
import { GithubLogo, Envelope } from "@phosphor-icons/react";

export function Contact() {
  return (
    <section
      id="contact"
      className="relative z-10 w-full px-6 md:px-12 py-16 md:py-24 text-center"
    >
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-0"
        aria-hidden="true"
      >
        <span className="font-display italic text-[clamp(120px,20vw,280px)] text-white/[0.015] leading-[0.8] select-none">
          HXY
        </span>
      </div>

      <div className="relative z-[1]">
        <ScrollReveal>
          <ShinyText
            text="联系"
            speed={4}
            color="rgba(255,255,255,0.35)"
            shineColor="#ffffff"
            className="font-body text-[10.5px] font-medium tracking-[0.20em] uppercase mb-6"
          />
        </ScrollReveal>

        <BlurText
          text="一起构建智能、有用且令人难忘的产品。"
          className="font-display italic text-[clamp(32px,5vw,52px)] leading-[1.12] text-white max-w-[700px] mx-auto mb-9"
          delay={40}
          animateBy="words"
          direction="top"
        />

        <ScrollReveal delay={0.3}>
          <div className="flex flex-col items-center gap-4">
            <div className="flex gap-4 justify-center flex-wrap">
              <motion.a
                  href="mailto:hxy940219220@gmail.com"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97, y: 1 }}
                  className="cursor-target inline-flex items-center gap-2 px-4 md:px-7 py-3 md:py-3.5 rounded-full font-body text-[13px] md:text-[13.5px] font-medium tracking-[0.04em] no-underline bg-white text-black border-none transition-all duration-300 hover:shadow-[0_0_48px_rgba(0,200,255,0.45)]"
                >
                  <Envelope size={16} weight="bold" />
                  邮件联系
              </motion.a>
              <motion.a
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97, y: 1 }}
                  className="cursor-target inline-flex items-center gap-2 px-4 md:px-7 py-3 md:py-3.5 rounded-full font-body text-[13px] md:text-[13.5px] font-medium tracking-[0.04em] text-white no-underline bg-white/[0.05] border border-white/[0.16] backdrop-blur-[10px] transition-all duration-300 hover:border-neon-pink hover:bg-white/[0.1] hover:shadow-[0_0_32px_rgba(216,76,255,0.15)]"
                >
                  <GithubLogo size={16} weight="bold" />
                  GitHub
              </motion.a>
              <motion.a
                  href="https://huangxiyuan.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97, y: 1 }}
                  className="cursor-target inline-flex items-center gap-2 px-4 md:px-7 py-3 md:py-3.5 rounded-full font-body text-[13px] md:text-[13.5px] font-medium tracking-[0.04em] text-white no-underline bg-white/[0.05] border border-white/[0.16] backdrop-blur-[10px] transition-all duration-300 hover:border-neon-pink hover:bg-white/[0.1] hover:shadow-[0_0_32px_rgba(216,76,255,0.15)]"
                >
                  huangxiyuan.net
              </motion.a>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
