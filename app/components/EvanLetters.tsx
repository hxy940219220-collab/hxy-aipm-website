"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { ScrollReveal } from "./ScrollReveal";

/* ------------------------------------------------------------------ */
/* EVAN首字母拆解 —— 每个字母代表一个个人特质，用大字母做视觉锚点       */
/* 参考 Alaric ALARIC 的首字母拆解思路，适配 HXY 暗黑霓虹设计系统       */
/* ------------------------------------------------------------------ */

interface LetterItem {
  letter: string;
  num: string;
  keyword: string;       // 英文关键词
  keywordCN: string;     // 中文关键词
  strong: string;        // 粗体摘要
  desc: string;          // 详细描述
  accentClass: string;   // 每个字母的霓虹强调色
  shadowColor: string;   // hover 发光阴影
}

const LETTERS: LetterItem[] = [
  {
    letter: "E",
    num: "01",
    keyword: "Engineer",
    keywordCN: "工程落地",
    strong: "用工程思维把 AI 能力产品化。",
    desc: "不满足于概念demo，关注从模型能力到产品体验的完整工程链路——数据、评测、工作流、交互缺一不可。",
    accentClass: "text-neon-cyan",
    shadowColor: "rgba(0,200,255,0.45)",
  },
  {
    letter: "V",
    num: "02",
    keyword: "Verify",
    keywordCN: "快速验证",
    strong: "低成本试错，持续迭代验证。",
    desc: "结合 Vibe Coding 与大模型能力进行原型冲刺，让想法尽快进入可感知、可测试、可传播的验证循环。",
    accentClass: "text-neon-gold",
    shadowColor: "rgba(255,216,74,0.45)",
  },
  {
    letter: "A",
    num: "03",
    keyword: "Align",
    keywordCN: "意图对齐",
    strong: "让模型输出与用户期望一致。",
    desc: "Prompt Engineering、模型调教、标注评测——把「让 AI 说人话、做对事」变成可复用的方法论与质量闭环。",
    accentClass: "text-neon-pink",
    shadowColor: "rgba(216,76,255,0.45)",
  },
  {
    letter: "N",
    num: "04",
    keyword: "Narrative",
    keywordCN: "叙事表达",
    strong: "让产品不止正确，而且动人。",
    desc: "设计×摄影×管理×AI——多技能整合成统一的叙事能力，让产品在被理解之前先被感受到。",
    accentClass: "text-neon-orange",
    shadowColor: "rgba(255,106,26,0.45)",
  },
];

/* ---- 单行组件 ---- */
function LetterRow({ item, index }: { item: LetterItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3, margin: "0px 0px -60px 0px" });

  // 根据奇偶决定左右布局: 偶数(0,2) label左+desc右, 奇数(1,3) desc左+label右
  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className="relative flex min-h-[clamp(9rem,12vw,11.5rem)] w-full items-center justify-center py-5"
    >
      {/* ====== 左侧内容 ====== */}
      <div className="pointer-events-none absolute inset-y-0 right-[calc(50%+clamp(4.8rem,7vw,6.8rem))] flex w-[min(22rem,28vw)] items-center justify-end pr-3 xl:w-[min(24rem,26vw)]">
        {isEven ? (
          /* 偶数行: 左侧放 label */
          <motion.div
            className="flex items-center justify-end gap-4 text-right"
            initial={{ opacity: 0, x: -28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span className="font-body text-[11px] uppercase tracking-[0.2em] text-text-muted xl:text-[12px]">
              {item.num}
            </span>
            <span
              className={`font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-extrabold leading-none ${item.accentClass}`}
            >
              {item.keyword}
            </span>
          </motion.div>
        ) : (
          /* 奇数行: 左侧放描述 */
          <motion.div
            className="text-[15px] leading-[1.75] text-text-tertiary transition-all duration-[550ms] [overflow-wrap:anywhere] xl:text-[16px] w-[min(26rem,28vw)] text-right"
            initial={{ opacity: 0, x: -28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.24,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <strong className="block font-semibold text-text-secondary">
              {item.strong}
            </strong>
            <span className="mt-1.5 block">{item.desc}</span>
          </motion.div>
        )}
      </div>

      {/* ====== 中央大字母 ====== */}
      <motion.div
        className="relative z-10 flex h-full cursor-default items-center justify-center select-none"
        aria-hidden="true"
        initial={{ opacity: 0, filter: "blur(18px)", scale: 0.82 }}
        animate={
          isInView
            ? { opacity: 1, filter: "blur(0px)", scale: 1 }
            : {}
        }
        transition={{
          duration: 0.8,
          delay: 0.08,
          ease: [0.16, 1, 0.3, 1],
        }}
        whileHover={{
          scale: 1.08,
          filter: `drop-shadow(0 0 36px ${item.shadowColor})`,
          transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        }}
      >
        <span
          className={`font-display italic text-[clamp(5.5rem,9vw,8.5rem)] font-bold leading-[0.9] tracking-[-0.04em] transition-colors duration-500 ${item.accentClass}`}
        >
          {item.letter}
        </span>
      </motion.div>

      {/* ====== 右侧内容 ====== */}
      <div className="pointer-events-none absolute inset-y-0 left-[calc(50%+clamp(5rem,7.2vw,7rem))] flex items-center pl-3">
        {isEven ? (
          /* 偶数行: 右侧放描述 */
          <motion.div
            className="text-[15px] leading-[1.75] text-text-tertiary transition-all duration-[550ms] [overflow-wrap:anywhere] xl:text-[16px] w-[min(26rem,28vw)]"
            initial={{ opacity: 0, x: 28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.24,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <strong className="block font-semibold text-text-secondary">
              {item.strong}
            </strong>
            <span className="mt-1.5 block">{item.desc}</span>
          </motion.div>
        ) : (
          /* 奇数行: 右侧放 label */
          <motion.div
            className="flex items-center justify-start gap-4 text-left"
            initial={{ opacity: 0, x: 28 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{
              duration: 0.7,
              delay: 0.18,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <span
              className={`font-display text-[clamp(1.6rem,2.6vw,2.4rem)] font-extrabold leading-none ${item.accentClass}`}
            >
              {item.keyword}
            </span>
            <span className="font-body text-[11px] uppercase tracking-[0.2em] text-text-muted xl:text-[12px]">
              {item.num}
            </span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---- 移动端单行组件 (堆叠布局) ---- */
function LetterRowMobile({ item }: { item: LetterItem }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.25 });

  return (
    <motion.div
      ref={ref}
      className="space-y-3 border-b border-white/[0.06] pb-7"
      initial={{ opacity: 0, y: 32, filter: "blur(8px)" }}
      animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* 大字母 + 标签行 */}
      <div className="flex items-end gap-4">
        <motion.span
          className={`font-display italic font-bold leading-[0.85] tracking-[-0.04em] ${item.accentClass}`}
          style={{ fontSize: "clamp(4rem, 15vw, 7rem)" }}
          whileTap={{ scale: 0.95 }}
        >
          {item.letter}
        </motion.span>
        <div className="pb-2">
          <div className="font-body text-[10px] uppercase tracking-[0.2em] text-text-muted">
            {item.num}
          </div>
          <div
            className={`font-display text-[clamp(1.3rem,5vw,1.8rem)] font-extrabold ${item.accentClass}`}
          >
            {item.keyword}
          </div>
          <div className="font-body text-[11px] text-text-muted mt-0.5">
            {item.keywordCN}
          </div>
        </div>
      </div>
      {/* 描述 */}
      <p className="max-w-[40rem] text-[14px] leading-[1.75] text-text-tertiary">
        <strong className="font-medium text-text-secondary">
          {item.strong}
        </strong>{" "}
        {item.desc}
      </p>
    </motion.div>
  );
}

/* ---- 主组件 ---- */
export function EvanLetters() {
  return (
    <section
      id="evan"
      className="relative z-10 w-full px-6 md:px-12 py-16 md:py-24 overflow-hidden"
    >
      {/* 微弱的径向渐变背景 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
      >
        <div className="absolute inset-x-[8%] top-[15%] h-[32rem] bg-[radial-gradient(circle_at_center,rgba(0,200,255,0.06),transparent_65%)] blur-3xl" />
        <div className="absolute inset-x-[8%] bottom-[15%] h-[32rem] bg-[radial-gradient(circle_at_center,rgba(216,76,255,0.05),transparent_65%)] blur-3xl" />
      </div>

      {/* 标题 */}
      <div className="relative z-20 mb-10 max-w-3xl mx-auto space-y-5 px-0 md:mb-14">
        <ScrollReveal>
          <h2 className="text-center font-display text-[clamp(3rem,7vw,6rem)] font-extrabold leading-none tracking-[-0.04em] text-neon-cyan uppercase">
            EVAN
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.12}>
          <p className="text-center text-base leading-relaxed text-text-tertiary md:text-lg">
            EVAN
            的四个字母，是关于我的四个关键词。每个词代表一种我正在践行的工作方式。
          </p>
        </ScrollReveal>
      </div>

      {/* ====== 桌面端: 交错布局 ====== */}
      <div className="relative z-20 hidden w-full max-w-[1500px] mx-auto md:block">
        <div className="flex flex-col">
          {LETTERS.map((item, i) => (
            <LetterRow key={item.letter} item={item} index={i} />
          ))}
        </div>
      </div>

      {/* ====== 移动端: 堆叠布局 ====== */}
      <div className="relative z-20 flex w-full max-w-[600px] mx-auto flex-col gap-1 md:hidden">
        {LETTERS.map((item) => (
          <LetterRowMobile key={item.letter} item={item} />
        ))}
      </div>
    </section>
  );
}
