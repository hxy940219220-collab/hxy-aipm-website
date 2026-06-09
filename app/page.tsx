"use client";

import { useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { EvanIntro } from "./components/EvanIntro";
import { Identity } from "./components/Identity";
import { Work } from "./components/Work";
import { Method } from "./components/Method";
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
            <About />
            <Contact />
          </main>
          <Footer />
        </>
      )}
    </>
  );
}
