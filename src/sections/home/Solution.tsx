"use client";

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

const PLACEHOLDER_COUNT = 5;

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
        <div>
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

          <div className="flex flex-wrap items-center gap-4 md:gap-5 lg:flex-nowrap lg:justify-between lg:gap-6">
            {Array.from({ length: PLACEHOLDER_COUNT }).map((_, i) => (
              <div
                key={i}
                className="group flex h-14 w-[calc(50%-0.5rem)] items-center justify-center rounded-xl border border-white/30 bg-white/5 p-4 text-xs font-medium tracking-wide text-white/30 shadow-[0_4px_24px_rgba(0,0,0,0.2)] backdrop-blur-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-[1.03] hover:border-white/45 hover:bg-white/10 hover:text-white/50 hover:shadow-[0_8px_32px_rgba(255,237,190,0.1)] sm:w-36 md:h-16 md:w-40 lg:w-auto lg:flex-1"
                aria-label="Client logo placeholder"
              >
                Logo
              </div>
            ))}
          </div>
        </div>
      </div>
    </SnapSection>
  );
}
