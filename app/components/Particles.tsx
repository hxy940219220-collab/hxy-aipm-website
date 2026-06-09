"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useCallback } from "react";

/* ------------------------------------------------------------------ */
/* 环境粒子系统 —— Canvas 2D                                              */
/* · 200+ 个霓虹光点缓慢漂浮                                               */
/* · 鼠标附近粒子被吸引 + 粒子间近距离连线（星座网络）                        */
/* · 径向渐变 mask 让边缘自然淡出                                          */
/* ------------------------------------------------------------------ */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  baseSize: number;
  color: string;
  opacity: number;
  phase: number;    // 正弦摇摆相位
  speed: number;    // 个体速度系数
}

const NEON_COLORS = [
  "rgba(0,200,255,@@@)",    // neon-cyan
  "rgba(216,76,255,@@@)",   // neon-pink
  "rgba(255,216,74,@@@)",   // neon-gold
  "rgba(255,106,26,@@@)",   // neon-orange
  "rgba(255,255,255,@@@)",  // white (rare)
];

const PARTICLE_COUNT_DESKTOP = 280;
const PARTICLE_COUNT_MOBILE = 80;

function getParticleCount(w: number): number {
  return w < 768 ? PARTICLE_COUNT_MOBILE : PARTICLE_COUNT_DESKTOP;
}
const MOUSE_RADIUS = 160;       // 鼠标影响半径
const CONNECT_DISTANCE = 130;   // 连线最大距离
const MAX_LINE_OPACITY = 0.22;  // 连线最大不透明度

function createParticle(w: number, h: number): Particle {
  const colorTemplate = NEON_COLORS[Math.floor(Math.random() * NEON_COLORS.length)];
  const baseOpacity = Math.random() * 0.45 + 0.1;
  const size = Math.random() * 2.0 + 0.5;

  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35 - 0.08, // 轻微向上漂浮
    size,
    baseSize: size,
    color: colorTemplate.replace("@@@", String(baseOpacity)),
    opacity: baseOpacity,
    phase: Math.random() * Math.PI * 2,
    speed: Math.random() * 0.6 + 0.4,
  };
}

export function Particles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const animRef = useRef<number>(0);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const timeRef = useRef(0);
  const dimsRef = useRef({ w: 0, h: 0 });

  /* ---- 鼠标追踪 ---- */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ---- 动画循环 ---- */
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const { w, h } = dimsRef.current;
    const particles = particlesRef.current;
    const mouse = mouseRef.current;
    timeRef.current += 0.008;

    ctx.clearRect(0, 0, w, h);

    // 混合模式让粒子叠加发光
    ctx.globalCompositeOperation = "lighter";

    // 第一步：更新 + 绘制所有粒子
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // 正弦摇摆（有机感）
      const sway = Math.sin(timeRef.current * p.speed + p.phase) * 0.15;

      // 鼠标吸引
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < MOUSE_RADIUS && dist > 1) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS; // 0~1
        const angle = Math.atan2(dy, dx);
        const pull = force * force * 0.6; // 二次方让近处吸力更强
        p.vx += Math.cos(angle) * pull * 0.03;
        p.vy += Math.sin(angle) * pull * 0.03;
      }

      // 阻尼
      p.vx *= 0.995;
      p.vy *= 0.995;

      // 速度限制
      const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (spd > 0.7) {
        p.vx = (p.vx / spd) * 0.7;
        p.vy = (p.vy / spd) * 0.7;
      }
      if (spd < 0.05) {
        // 微小的随机扰动防止静止
        p.vx += (Math.random() - 0.5) * 0.02;
        p.vy += (Math.random() - 0.5) * 0.02;
      }

      p.x += p.vx + sway;
      p.y += p.vy;

      // 边界环绕
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;

      // 绘制粒子
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    }

    // 第二步：粒子间连线
    for (let i = 0; i < particles.length; i++) {
      const a = particles[i];
      // 只检查附近粒子（性能优化：分批检查）
      const step = Math.max(1, Math.floor(particles.length / 60));
      for (let j = i + step; j < particles.length; j += step) {
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECT_DISTANCE) {
          const alpha = (1 - dist / CONNECT_DISTANCE) * MAX_LINE_OPACITY;
          // 取两个粒子颜色的平均值
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(150,180,255,${alpha.toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    ctx.globalCompositeOperation = "source-over";
    animRef.current = requestAnimationFrame(animate);
  }, []);

  /* ---- 初始化 ---- */
  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      dimsRef.current = { w, h };

      // 按屏幕尺寸决定粒子数量
      const target = getParticleCount(w);
      const current = particlesRef.current;
      if (current.length !== target) {
        particlesRef.current = Array.from({ length: target }, () =>
          createParticle(w, h)
        );
      } else if (current.length === 0) {
        particlesRef.current = Array.from({ length: target }, () =>
          createParticle(w, h)
        );
      }
    };
    resize();

    animRef.current = requestAnimationFrame(animate);
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [animate, reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[6] pointer-events-none"
      aria-hidden="true"
      style={{
        maskImage:
          "radial-gradient(ellipse at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%)",
        WebkitMaskImage:
          "radial-gradient(ellipse at center, rgba(0,0,0,1) 58%, rgba(0,0,0,0) 100%)",
      }}
    />
  );
}
