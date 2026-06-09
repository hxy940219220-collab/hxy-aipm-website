"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
const NAV_ITEMS = [
  {
    label: "作品",
    href: "#work",
    subs: [
      { label: "IdeaFlash · 灵感胶囊" },
      { label: "FocusMeow · 专注喵" },
    ],
  },
  {
    label: "工具栈",
    href: "#capabilities",
    subs: [
      { label: "Claude" },
      { label: "Codex" },
      { label: "Gemini" },
      { label: "VS Code" },
      { label: "Typeless" },
    ],
  },
  {
    label: "思考",
    href: "#method",
    subs: [
      { label: "AIPM 工作流蓝图" },
      { label: "Harness Engineering" },
      { label: "Claude Code 设计逻辑" },
      { label: "Hermes × OpenClaw" },
    ],
  },
  {
    label: "关于",
    href: "#about",
    subs: [
      { label: "产品化能力" },
      { label: "Agent 系统" },
      { label: "快速验证" },
    ],
  },
  {
    label: "联系",
    href: "#contact",
    subs: [
      { label: "GitHub", href: "https://github.com/hxy940219220-collab/huangxiyuan-website" },
      { label: "huangxiyuan.net", href: "https://huangxiyuan.net" },
      { label: "hxy940219220@gmail.com", href: "mailto:hxy940219220@gmail.com" },
    ],
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const scrollTo = useCallback((href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" });
  }, [reduced]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[100] px-4 md:px-6 py-4 transition-all duration-700 ${
          scrolled
            ? "bg-[rgba(8,8,18,0.75)] backdrop-blur-[22px] border-b border-white/[0.08] shadow-[0_8px_48px_rgba(0,0,0,0.35)]"
            : ""
        }`}
      >
        <div className="w-full flex items-center justify-between">
          {/* Brand */}
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); scrollTo("#hero"); }}
            className="font-body text-[15px] font-semibold tracking-[0.06em] uppercase text-white no-underline"
          >
            HXY <span className="text-text-tertiary font-normal">/ AIPM</span>
          </a>

          {/* Desktop nav */}
          <ul className="hidden md:flex items-center gap-9 list-none">
            {NAV_ITEMS.map((item) => (
              <li key={item.href} className="relative group">
                <a
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                  className="cursor-target relative font-body text-[13px] font-medium tracking-[0.08em] uppercase text-text-secondary no-underline transition-colors duration-300 hover:text-white
                    after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-neon-cyan after:scale-x-0 after:transition-transform after:duration-300
                    hover:after:scale-x-100"
                >
                  {item.label}
                </a>
                {/* 竖版下拉子项列表 */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 z-50">
                  <div className="flex flex-col gap-0.5 py-2 px-1 rounded-xl bg-[rgba(13,13,28,0.94)] border border-white/[0.10] backdrop-blur-xl shadow-[0_16px_48px_rgba(0,0,0,0.55)] min-w-[180px]">
                    {item.subs.map((sub) =>
                      "href" in sub && sub.href ? (
                        <a
                          key={sub.label}
                          href={sub.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block px-3 py-2 rounded-lg font-body text-[12px] text-text-secondary whitespace-nowrap no-underline transition-colors duration-200 hover:text-white hover:bg-white/[0.06]"
                        >
                          {sub.label}
                        </a>
                      ) : (
                        <span
                          key={sub.label}
                          className="block px-3 py-2 rounded-lg font-body text-[12px] text-text-secondary whitespace-nowrap transition-colors duration-200 hover:text-white hover:bg-white/[0.06]"
                        >
                          {sub.label}
                        </span>
                      )
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <motion.a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="cursor-target hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.18] text-white font-body text-[12.5px] font-medium tracking-[0.06em] uppercase no-underline cursor-pointer transition-all duration-300 backdrop-blur-[10px] hover:bg-white/[0.12] hover:border-neon-cyan hover:shadow-[0_0_28px_rgba(0,200,255,0.18)]"
            >
              聊聊
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.1] text-[11px] transition-all duration-300 group-hover:bg-neon-cyan group-hover:text-black">
                &#x2197;
              </span>
          </motion.a>

          {/* Hamburger */}
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-full bg-white/[0.06] border border-white/[0.15] cursor-pointer gap-[5px] transition-all duration-400"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <X size={18} weight="light" color="#fff" />
            ) : (
              <List size={18} weight="light" color="#fff" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile fullscreen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[99] bg-[rgba(5,5,9,0.92)] backdrop-blur-[30px] flex flex-col items-center justify-center gap-10"
          >
            {[...NAV_ITEMS, { label: "聊聊", href: "#contact", subs: [] as {label:string; href?:string}[] }].map(
              (item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.08 * i,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display italic text-[36px] text-white no-underline"
                >
                  {item.label}
                </motion.a>
              )
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
