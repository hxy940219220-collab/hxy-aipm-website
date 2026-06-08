"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { List, X } from "@phosphor-icons/react";
import Magnet from "../reactbits/Animations/Magnet/Magnet";

const NAV_ITEMS = [
  { label: "作品", href: "#work" },
  { label: "思考", href: "#method" },
  { label: "关于", href: "#about" },
  { label: "联系", href: "#contact" },
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
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(item.href); }}
                  className="relative font-body text-[13px] font-medium tracking-[0.08em] uppercase text-text-secondary no-underline transition-colors duration-300 hover:text-white
                    after:content-[''] after:absolute after:-bottom-1 after:left-0 after:right-0 after:h-px after:bg-neon-cyan after:scale-x-0 after:transition-transform after:duration-300
                    hover:after:scale-x-100"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <Magnet padding={60} magnetStrength={2}>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); scrollTo("#contact"); }}
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.06] border border-white/[0.18] text-white font-body text-[12.5px] font-medium tracking-[0.06em] uppercase no-underline cursor-pointer transition-all duration-400 backdrop-blur-[10px] hover:bg-white/[0.12] hover:border-neon-cyan hover:shadow-[0_0_28px_rgba(0,200,255,0.18)] hover:-translate-y-[1px]"
            >
              聊聊
              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-white/[0.1] text-[11px] transition-all duration-400 group-hover:bg-neon-cyan group-hover:text-black">
                &#x2197;
              </span>
            </a>
          </Magnet>

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
            {NAV_ITEMS.concat({ label: "聊聊", href: "#contact" }).map(
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
