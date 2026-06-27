"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

function splitChars(text: string, keyPrefix: string) {
  return text.split("").map((char, index) => (
    <span key={`${keyPrefix}-${index}`} className="hero-char inline-block">
      {char === " " ? "\u00A0" : char}
    </span>
  ));
}

export function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-line-1 .hero-char", {
        y: 80,
        opacity: 0,
        duration: 0.7,
        stagger: 0.04,
      }).from(
        ".hero-line-2 .hero-char",
        {
          y: 120,
          opacity: 0,
          duration: 0.9,
          stagger: 0.06,
        },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      id="top"
      data-snap-section
      className="relative z-10 h-dvh overflow-visible px-6 md:px-10"
    >
      <div
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply"
        style={{
          backgroundImage: "url('/grunge-texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08,
        }}
      />

      <div className="hero-text-grunge absolute inset-0 z-10 flex flex-col items-center justify-center text-center">
        <p className="hero-line-1 text-3xl font-bold uppercase tracking-[0.18em] md:text-5xl md:tracking-[0.25em] lg:text-6xl lg:tracking-[0.32em]">
          {splitChars("REMOVE THE", "line-1")}
        </p>
        <h1 className="hero-line-2 text-[clamp(6rem,22vw,18rem)] font-bold uppercase leading-[0.85] tracking-[0.04em]">
          {splitChars("NOISE", "line-2")}
        </h1>
      </div>

    </section>
  );
}
