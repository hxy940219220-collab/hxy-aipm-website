"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

/* ------------------------------------------------------------------ */
/* 3D 旋转卡片 — 窄长方形 + 双面渲染（正面+预翻转背面，文字永不反转）      */
/* ------------------------------------------------------------------ */

interface CardData {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  gradient: string;
  accentBorder: string;
  glowColor: string;
}

const CARDS: CardData[] = [
  {
    num: "01",
    title: "数据训练",
    desc: "从数据标准、标注策略到质量闭环，把底层训练数据做得稳定、可用、可复盘。",
    tags: ["Caption", "Quality", "SOP"],
    gradient:
      "radial-gradient(circle at 24% 28%, rgba(0,200,255,0.22), transparent 26%), radial-gradient(circle at 72% 72%, rgba(0,180,230,0.16), transparent 24%)",
    accentBorder: "rgba(0,200,255,0.35)",
    glowColor: "rgba(0,200,255,0.45)",
  },
  {
    num: "02",
    title: "模型评测",
    desc: "把评测目标拆成可执行规则与对比框架，让模型优劣不是感受，而是有依据的判断。",
    tags: ["Benchmark", "Rubric", "Compare"],
    gradient:
      "radial-gradient(circle at 28% 24%, rgba(255,216,74,0.24), transparent 24%), radial-gradient(circle at 76% 60%, rgba(220,180,50,0.16), transparent 28%)",
    accentBorder: "rgba(255,216,74,0.35)",
    glowColor: "rgba(255,216,74,0.45)",
  },
  {
    num: "03",
    title: "工作流搭建",
    desc: "把 LLM、RAG、多模态节点串成完整工作流，让 AI 能真正接进业务链路。",
    tags: ["LLM", "RAG", "Workflow"],
    gradient:
      "radial-gradient(circle at 26% 34%, rgba(216,76,255,0.22), transparent 28%), radial-gradient(circle at 70% 30%, rgba(180,50,230,0.16), transparent 26%)",
    accentBorder: "rgba(216,76,255,0.35)",
    glowColor: "rgba(216,76,255,0.45)",
  },
  {
    num: "04",
    title: "设计 & 摄影",
    desc: "把品牌视觉、画面审美与摄影表达整合成统一而可感知的呈现。",
    tags: ["Visual", "Brand", "Photo"],
    gradient:
      "radial-gradient(circle at 24% 24%, rgba(255,106,26,0.22), transparent 28%), radial-gradient(circle at 66% 36%, rgba(230,90,20,0.18), transparent 26%)",
    accentBorder: "rgba(255,106,26,0.35)",
    glowColor: "rgba(255,106,26,0.45)",
  },
];

const CARD_COUNT = CARDS.length;
const ANGLE_PER_CARD = 360 / CARD_COUNT;
const RADIUS_DESKTOP = 360;
const RADIUS_MOBILE = 220;

function getRadius(): number {
  if (typeof window === "undefined") return RADIUS_DESKTOP;
  return window.innerWidth < 768 ? RADIUS_MOBILE : RADIUS_DESKTOP;
}

/* 卡片内容（正面和背面共用） */
function CardFace({ card, isFront }: { card: CardData; isFront: boolean }) {
  return (
    <div className="relative z-10 flex h-full flex-col p-5 md:p-6">
      <span className="font-body text-[10px] md:text-[11px] uppercase tracking-[0.18em] text-white/25">
        {card.num}
      </span>
      <h3
        className="mt-4 md:mt-6 text-balance font-semibold leading-[1.02] text-white"
        style={{
          fontFamily:
            '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Microsoft YaHei", sans-serif',
          fontSize: "clamp(1.2rem, 1.4vw, 1.5rem)",
          letterSpacing: "0.02em",
        }}
      >
        {card.title}
      </h3>
      <p className="mt-3 md:mt-4 text-[11.5px] md:text-[12px] leading-[1.85] text-white/55 [overflow-wrap:anywhere]">
        {card.desc}
      </p>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {card.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/[0.12] bg-white/[0.03] px-2 py-[0.22rem] font-body text-[8.5px] tracking-[0.08em] text-white/45"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RotatingCards3D() {
  const reduced = useReducedMotion();
  const [rotation, setRotation] = useState(0);
  const [radius, setRadius] = useState(RADIUS_DESKTOP);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, rotation: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setRadius(getRadius());
    const onResize = () => setRadius(getRadius());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const snapToNearest = useCallback((rot: number) => {
    return Math.round(rot / ANGLE_PER_CARD) * ANGLE_PER_CARD;
  }, []);

  const rotateTo = useCallback(
    (direction: "prev" | "next") => {
      if (reduced) return;
      const delta = direction === "next" ? ANGLE_PER_CARD : -ANGLE_PER_CARD;
      setRotation((r) => snapToNearest(r) + delta);
    },
    [reduced, snapToNearest]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (reduced) return;
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, rotation };
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    },
    [reduced, rotation]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || reduced) return;
      const dx = e.clientX - dragStartRef.current.x;
      setRotation(dragStartRef.current.rotation + dx * 0.4);
    },
    [isDragging, reduced]
  );

  const handlePointerUp = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);
    setRotation((r) => snapToNearest(r));
  }, [isDragging, snapToNearest]);

  const normalizedRotation = ((rotation % 360) + 360) % 360;
  const frontIndex = Math.round(normalizedRotation / ANGLE_PER_CARD) % CARD_COUNT;

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: "none" }}
    >
      {/* ====== 3D 场景 ====== */}
      <div
        className="relative mx-auto overflow-visible"
        style={{
          perspective: "1600px",
          perspectiveOrigin: "50% 48%",
          height: "clamp(24rem, 44vw, 28rem)",
          maxWidth: "1200px",
        }}
      >
        {/* 旋转按钮 */}
        {!reduced && (
          <>
            <button
              onClick={() => rotateTo("prev")}
              className="absolute left-1 md:left-3 z-[80] flex h-11 w-11 md:h-14 md:w-14 -translate-y-1/2 top-1/2 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] text-white/40 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/[0.28] hover:bg-white/[0.12] hover:text-white/80 hover:shadow-[0_0_24px_rgba(0,200,255,0.15)]"
              aria-label="上一个"
            >
              <CaretLeft size={22} weight="light" />
            </button>
            <button
              onClick={() => rotateTo("next")}
              className="absolute right-1 md:right-3 z-[80] flex h-11 w-11 md:h-14 md:w-14 -translate-y-1/2 top-1/2 items-center justify-center rounded-full border border-white/[0.14] bg-white/[0.06] text-white/40 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-white/[0.28] hover:bg-white/[0.12] hover:text-white/80 hover:shadow-[0_0_24px_rgba(0,200,255,0.15)]"
              aria-label="下一个"
            >
              <CaretRight size={22} weight="light" />
            </button>
          </>
        )}

        {/* 卡片环 */}
        <div
          className="absolute left-1/2 top-4"
          style={{
            width: "min(32rem, 38vw)",
            height: "24rem",
            transform: "translateX(-50%)",
            transformStyle: "preserve-3d",
            transformOrigin: "50% 50%",
            pointerEvents: "none",
          }}
        >
          {/* 旋转层 */}
          <div
            className="absolute inset-0"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${-normalizedRotation}deg)`,
              transition: isDragging
                ? "none"
                : reduced
                ? "none"
                : "transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {CARDS.map((card, i) => {
              const cardAngle = i * ANGLE_PER_CARD;
              const relativeAngle =
                (((cardAngle - normalizedRotation) % 360) + 540) % 360;

              const facingFactor = Math.abs(
                Math.cos((relativeAngle * Math.PI) / 180)
              );
              const opacity = 0.4 + facingFactor * 0.6;
              const blur = (1 - facingFactor) * 0.4;
              const z = Math.round(50 + facingFactor * 10);

              return (
                <div
                  key={card.num}
                  className="absolute rounded-[24px] border text-left shadow-[0_10px_26px_rgba(0,0,0,0.35)] pointer-events-auto"
                  style={{
                    width: "min(24rem, 50vw)",
                    height: "clamp(18rem, 34vw, 22rem)",
                    left: "50%",
                    top: 0,
                    transform: `translateX(-50%) rotateY(${cardAngle}deg) translateZ(${radius}px)`,
                    transformStyle: "preserve-3d",
                    backfaceVisibility: "visible",
                    WebkitBackfaceVisibility: "visible",
                    borderColor:
                      i === frontIndex
                        ? card.accentBorder
                        : "rgba(255,255,255,0.12)",
                    boxShadow:
                      i === frontIndex
                        ? `0 12px 56px rgba(0,0,0,0.5), 0 0 40px ${card.glowColor.replace("0.45", "0.15")}, inset 0 1px 0 rgba(255,255,255,0.06)`
                        : "0 12px 48px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.03)",
                    backgroundColor: "rgba(13,13,28,0.65)",
                    backdropFilter: "blur(18px)",
                    WebkitBackdropFilter: "blur(18px)",
                    opacity,
                    filter: `blur(${blur.toFixed(2)}px)`,
                    zIndex: z,
                    cursor: isDragging ? "grabbing" : "grab",
                  }}
                >
                  {/* 渐变覆盖 */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-[24px]"
                    style={{ backgroundImage: card.gradient }}
                  />
                  {/* 内边框 */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-[1px] rounded-[23px] border"
                    style={{
                      borderColor:
                        i === frontIndex
                          ? card.accentBorder
                          : "rgba(255,255,255,0.08)",
                    }}
                  />

                  {/* ==== 正面（朝外）==== */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                    }}
                  >
                    <CardFace card={card} isFront />
                  </div>

                  {/* ==== 背面（预旋转180°，文字永远正向）==== */}
                  <div
                    style={{
                      backfaceVisibility: "hidden",
                      WebkitBackfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                      position: "absolute",
                      inset: 0,
                    }}
                  >
                    <CardFace card={card} isFront={false} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 指示点 */}
      <div className="flex justify-center gap-3 mt-6 md:mt-8">
        {CARDS.map((card, i) => (
          <button
            key={card.num}
            onClick={() => {
              if (reduced) return;
              setRotation(i * ANGLE_PER_CARD);
            }}
            className="w-2 h-2 rounded-full transition-all duration-400 border-0 cursor-pointer"
            style={{
              backgroundColor:
                i === frontIndex
                  ? "rgba(255,255,255,0.85)"
                  : "rgba(255,255,255,0.18)",
              boxShadow:
                i === frontIndex
                  ? `0 0 10px ${CARDS[frontIndex].glowColor}`
                  : "none",
              transform: i === frontIndex ? "scale(1.4)" : "scale(1)",
            }}
            aria-label={`切换到卡片 ${card.num}`}
          />
        ))}
      </div>
    </div>
  );
}
