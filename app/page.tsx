"use client";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Identity } from "./components/Identity";
import { Work } from "./components/Work";
import { Method } from "./components/Method";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Identity />
        <Work />
        <Method />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
