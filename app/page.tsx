"use client";

import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { EvanIntro } from "./components/EvanIntro";
import { Identity } from "./components/Identity";
import { Work } from "./components/Work";
import { Method } from "./components/Method";
import { RotatingCards3D } from "./components/RotatingCards3D";
import { ScrollReveal } from "./components/ScrollReveal";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function Home() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <>
      {!introDone && <EvanIntro onComplete={() => setIntroDone(true)} />}
      {introDone && (
        <>
          <Navbar />
          <main>
            <Hero />
            <Identity />
            <Work />
            <Method />
            {/* 3D 旋转卡片 · 能力展示 */}
            <section
              id="capabilities"
              className="relative z-10 w-full px-6 md:px-12 py-20 md:py-32 overflow-hidden"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
              >
                <div className="absolute inset-x-[8%] top-[10%] h-[28rem] bg-[radial-gradient(circle_at_top,rgba(255,132,64,0.06),transparent_68%)] blur-3xl" />
              </div>
              <div className="relative z-10 mx-auto max-w-[1200px]">
                <div className="mb-16 md:mb-24 text-center">
                  <ScrollReveal>
                    <h2 className="font-display text-[clamp(2.5rem,6vw,5rem)] font-extrabold leading-none tracking-[-0.04em] text-white">
                      AI 工具栈
                    </h2>
                  </ScrollReveal>
                  <ScrollReveal delay={0.12}>
                    <p className="mt-5 text-base leading-relaxed text-text-tertiary md:text-lg max-w-2xl mx-auto">
                      日常高频使用的 AI 工具，每款在工作和创作中承担不同角色。
                    </p>
                  </ScrollReveal>
                </div>
                <RotatingCards3D />
              </div>
            </section>
            <About />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
