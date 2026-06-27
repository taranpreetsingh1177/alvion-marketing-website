"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SnapSection } from "./SnapSection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const HEADING_WORDS = [
  { text: "We", highlight: false },
  { text: "help", highlight: false },
  { text: "businesses", highlight: false },
  { text: "cut", highlight: false },
  { text: "through", highlight: false },
  { text: "the", highlight: false },
  { text: "noise", highlight: true },
  { text: "and", highlight: false },
  { text: "grow.", highlight: false },
] as const;

const CLIENT_LOGOS = [
  { name: "Bajaj", src: "/brand_logos/bajaj.png", width: 315, height: 210 },
  { name: "CashKaro", src: "/brand_logos/cashkaro.png", width: 314, height: 209 },
  {
    name: "Masters' Union",
    src: "/brand_logos/masters%20union.png",
    width: 314,
    height: 209,
  },
  { name: "Puma", src: "/brand_logos/puma.png", width: 314, height: 209 },
  { name: "Unstop", src: "/brand_logos/unstop.png", width: 315, height: 209 },
  { name: "Zyra", src: "/brand_logos/ZYRA.png", width: 315, height: 209 },
] as const;

export function Solution() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const headingEl = headingRef.current;
      if (!section || !headingEl) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const words = headingEl.querySelectorAll<HTMLElement>(".s3-word");

      gsap.from(words, {
        y: 56,
        opacity: 0,
        duration: 0.65,
        stagger: 0.07,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <SnapSection
      ref={sectionRef}
      id="solution"
      className="solution-section relative z-30 bg-background-dark text-foreground-light"
      contentClassName="absolute inset-0 w-full max-w-none text-foreground-light"
    >
      {/* Grunge texture overlay — same approach as Hero and NoiseProblem */}
      <div
        className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply"
        style={{
          backgroundImage: "url('/grunge-texture.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.08,
        }}
        aria-hidden
      />

      <div className="relative z-10 flex h-full flex-col justify-between px-10 py-12 text-foreground-light md:px-16 md:py-16">
        {/* ── Top: decorative mark + heading ── */}
        <div className="pt-16 md:pt-20">
          <span
            className="mb-5 block text-2xl leading-none text-foreground-light/70 md:mb-8"
            aria-hidden="true"
          >
            ✦
          </span>

          <h2
            ref={headingRef}
            className="max-w-4xl overflow-hidden text-[clamp(2.6rem,5.5vw,5rem)] font-bold leading-[1.08] tracking-tight text-foreground-light"
            style={{
              fontFamily: '"Clash Display", sans-serif',
              color: "var(--foreground-light)",
            }}
          >
            {HEADING_WORDS.map(({ text, highlight }) => (
              <span
                key={text}
                className={`s3-word mr-[0.28em] inline-block text-foreground-light${highlight ? " s3-word--highlight" : ""}`}
                style={{
                  color: highlight ? "#FFEDBE" : "var(--foreground-light)",
                }}
              >
                {text}
              </span>
            ))}
          </h2>
        </div>

        {/* ── Bottom: previous clients ── */}
        <div>
          <p
            className="mb-5 text-[0.65rem] font-medium uppercase tracking-[0.35em] text-foreground-light/50 md:mb-6 md:text-xs"
            style={{
              fontFamily: "var(--font-poppins), sans-serif",
              color: "color-mix(in oklab, var(--foreground-light) 50%, transparent)",
            }}
          >
            Our Previous Clients
          </p>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-6">
            {CLIENT_LOGOS.map((logo) => (
              <div key={logo.name} className="flex items-center justify-center">
                <Image
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  width={logo.width}
                  height={logo.height}
                  unoptimized
                  className="h-14 w-full max-w-[220px] scale-110 object-contain opacity-75 transition-opacity duration-300 hover:opacity-100 md:h-16 lg:h-20 lg:max-w-[260px]"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SnapSection>
  );
}
