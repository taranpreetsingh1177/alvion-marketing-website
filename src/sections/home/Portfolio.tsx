"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SnapSection } from "./SnapSection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PROJECTS = [
  { name: "Brand Identity", category: "Branding" },
  { name: "Campaign Strategy", category: "Performance" },
  { name: "Social Growth", category: "Content" },
  { name: "SEO Overhaul", category: "Organic" },
  { name: "Paid Media", category: "Advertising" },
  { name: "Web Presence", category: "Digital" },
] as const;

export function Portfolio() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const cardsContainer = cardsRef.current;
      if (!section || !cardsContainer) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const cards = gsap.utils.toArray<HTMLElement>(".portfolio-card", cardsContainer);

      gsap.from(cards, {
        opacity: 0,
        y: 48,
        scale: 0.95,
        duration: 0.6,
        stagger: { amount: 0.7, from: "start" },
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          once: true,
        },
      });
    },
    { scope: sectionRef },
  );

  return (
    <SnapSection
      ref={sectionRef}
      id="portfolio"
      className="relative z-[10] overflow-hidden bg-background text-foreground"
      contentClassName="absolute inset-0 w-full max-w-none"
    >
      <div className="relative z-[1] flex h-full flex-col px-10 py-12 md:px-16 md:py-16">
        {/* Header */}
        <div className="mb-8 md:mb-10">
          <p
            className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-foreground/50"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Portfolio
          </p>
          <h2
            className="text-[clamp(2.4rem,5vw,4.5rem)] font-bold leading-[1.05] tracking-tight text-foreground"
            style={{ fontFamily: '"Clash Display", sans-serif' }}
          >
            Work that speaks.
          </h2>
        </div>

        {/* Project cards grid */}
        <div
          ref={cardsRef}
          className="grid flex-1 grid-cols-2 gap-4 md:grid-cols-3 md:gap-5"
        >
          {PROJECTS.map((project) => (
            <div
              key={project.name}
              className="portfolio-card flex flex-col overflow-hidden rounded-lg border border-foreground/10 bg-white/50 backdrop-blur-sm"
            >
              {/* Placeholder image area */}
              <div className="flex flex-1 items-center justify-center bg-foreground/5 text-foreground/20">
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  aria-hidden
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>

              {/* Card footer */}
              <div className="px-4 py-3">
                <p
                  className="text-[0.65rem] font-medium uppercase tracking-widest text-foreground/40"
                  style={{ fontFamily: "var(--font-poppins), sans-serif" }}
                >
                  {project.category}
                </p>
                <p
                  className="mt-0.5 text-sm font-semibold text-foreground"
                  style={{ fontFamily: '"Clash Display", sans-serif' }}
                >
                  {project.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SnapSection>
  );
}
