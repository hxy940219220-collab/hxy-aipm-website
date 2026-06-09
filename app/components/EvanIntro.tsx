"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";

/* ------------------------------------------------------------------ */
/* EVAN 首字母拆解 · 全屏开场动画                                        */
/* 进入网站时播放，四个字母逐个揭示含义，最后过渡到主页面                */
/* ------------------------------------------------------------------ */

interface LetterData {
  letter: string;
  keyword: string;
  keywordCN: string;
  strong: string;
  desc: string;
  color: string;
  glowColor: string;
}

const LETTERS: LetterData[] = [
  {
    letter: "E",
    keyword: "Engineer",
    keywordCN: "工程落地",
    strong: "用工程思维把 AI 能力产品化",
    desc: "不满足于概念 demo，关注从模型到体验的完整工程链路",
    color: "#00c8ff",
    glowColor: "rgba(0,200,255,0.5)",
  },
  {
    letter: "V",
    keyword: "Verify",
    keywordCN: "快速验证",
    strong: "低成本试错，持续迭代验证",
    desc: "Vibe Coding × 大模型，让想法尽快进入可感知的验证循环",
    color: "#ffd84a",
    glowColor: "rgba(255,216,74,0.5)",
  },
  {
    letter: "A",
    keyword: "Align",
    keywordCN: "意图对齐",
    strong: "让模型输出与用户期望一致",
    desc: "Prompt Engineering · 模型调教 · 标注评测 → 可复用的质量闭环",
    color: "#d84cff",
    glowColor: "rgba(216,76,255,0.5)",
  },
  {
    letter: "N",
    keyword: "Narrative",
    keywordCN: "叙事表达",
    strong: "让产品不止正确，而且动人",
    desc: "设计 × 摄影 × 管理 × AI → 统一的叙事能力",
    color: "#ff6a1a",
    glowColor: "rgba(255,106,26,0.5)",
  },
];

const TOTAL_PHASES = LETTERS.length + 1; // 4 letters + final outro
const LETTER_DURATION = 1400; // ms per letter
const OUTRO_DURATION = 800;  // ms for final fade

export function EvanIntro() {
  const [phase, setPhase] = useState(0); // 0=E, 1=V, 2=A, 3=N, 4=outro
  const [dismissed, setDismissed] = useState(false);

  const advance = useCallback(() => {
    setPhase((p) => {
      const next = p + 1;
      if (next >= TOTAL_PHASES) {
        // Schedule dismiss after outro animation
        setTimeout(() => setDismissed(true), OUTRO_DURATION);
        return p; // stay on current for outro
      }
      return next;
    });
  }, []);

  useEffect(() => {
    if (phase < LETTERS.length) {
      const timer = setTimeout(advance, LETTER_DURATION);
      return () => clearTimeout(timer);
    } else if (phase === LETTERS.length) {
      // Outro phase - dismiss after animation
      const timer = setTimeout(() => setDismissed(true), OUTRO_DURATION + 200);
      return () => clearTimeout(timer);
    }
  }, [phase, advance]);

  // Allow skip on click
  const handleSkip = () => {
    setDismissed(true);
  };

  if (dismissed) return null;

  const current = phase < LETTERS.length ? LETTERS[phase] : null;
  const isOutro = phase >= LETTERS.length;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ background: "#050509" }}
    >
      {/* 背景微光 */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 transition-all duration-1000"
          style={{
            background: current
              ? `radial-gradient(circle at center, ${current.glowColor.replace("0.5", "0.12")}, transparent 60%)`
              : "transparent",
          }}
        />
        {/* 粒子感 - 细微噪点覆盖 */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(255,255,255,0.4) 1px, transparent 1px), radial-gradient(circle at 70% 60%, rgba(255,255,255,0.3) 1px, transparent 1px), radial-gradient(circle at 40% 80%, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "120px 120px, 180px 180px, 150px 150px",
          }}
        />
      </div>

      {/* 进度点 */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {LETTERS.map((l, i) => (
          <div
            key={l.letter}
            className="relative w-2 h-2 rounded-full transition-all duration-500"
            style={{
              backgroundColor:
                i < phase ? l.color : i === phase && !isOutro ? l.color : "rgba(255,255,255,0.15)",
              boxShadow:
                i === phase && !isOutro
                  ? `0 0 10px ${l.color}`
                  : i < phase
                  ? `0 0 4px ${l.color}`
                  : "none",
              transform: i === phase && !isOutro ? "scale(1.5)" : "scale(1)",
            }}
          />
        ))}
      </div>

      {/* 跳过按钮 */}
      <button
        onClick={handleSkip}
        className="absolute top-8 right-8 z-10 px-4 py-2 rounded-full font-body text-[11px] tracking-[0.1em] uppercase text-text-muted border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm transition-all duration-300 hover:text-white hover:border-white/[0.2] hover:bg-white/[0.06]"
      >
        跳过 Skip
      </button>

      {/* 主内容 */}
      <AnimatePresence mode="wait">
        {isOutro ? (
          /* ====== OUTRO: 四字母并列 ====== */
          <motion.div
            key="outro"
            className="flex flex-col items-center gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -40, filter: "blur(12px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-6 md:gap-12">
              {LETTERS.map((l, i) => (
                <motion.span
                  key={l.letter}
                  className="font-display italic font-bold leading-none"
                  style={{
                    color: l.color,
                    fontSize: "clamp(5rem, 12vw, 10rem)",
                    textShadow: `0 0 60px ${l.glowColor}`,
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {l.letter}
                </motion.span>
              ))}
            </div>
            <motion.p
              className="font-body text-text-muted text-sm tracking-[0.2em] uppercase"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              Engineer · Verify · Align · Narrative
            </motion.p>
          </motion.div>
        ) : current ? (
          /* ====== 单字母展示 ====== */
          <motion.div
            key={current.letter}
            className="flex flex-col items-center gap-6 px-6 text-center max-w-[600px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(8px)" }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* 超大字母 */}
            <motion.span
              className="font-display italic font-bold leading-none select-none"
              style={{
                color: current.color,
                fontSize: "clamp(8rem, 22vw, 16rem)",
                textShadow: `0 0 80px ${current.glowColor}, 0 0 160px ${current.glowColor.replace("0.5", "0.25")}`,
              }}
              initial={{ opacity: 0, filter: "blur(28px)", scale: 0.7 }}
              animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {current.letter}
            </motion.span>

            {/* 关键词 */}
            <motion.div
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <span
                className="font-display text-[clamp(1.8rem,4vw,3rem)] font-extrabold leading-none"
                style={{ color: current.color }}
              >
                {current.keyword}
              </span>
              <span className="font-body text-[13px] tracking-[0.15em] uppercase text-text-muted">
                {current.keywordCN}
              </span>
            </motion.div>

            {/* 描述 */}
            <motion.div
              className="flex flex-col items-center gap-1.5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <p
                className="font-display italic text-[clamp(1rem,2.5vw,1.3rem)] leading-relaxed"
                style={{ color: current.color }}
              >
                {current.strong}
              </p>
              <p className="font-body text-[13px] md:text-[14px] text-text-tertiary leading-relaxed max-w-[420px]">
                {current.desc}
              </p>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}
