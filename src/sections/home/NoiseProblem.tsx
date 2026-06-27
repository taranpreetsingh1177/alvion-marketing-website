"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SnapSection } from "./SnapSection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const PAIN_CLOUDS = [
  // ── Left flank ──────────────────────────────────────────────────────────
  { text: "High CPA", top: "7%", left: "4%", rotate: -5, accent: true },
  { text: "no organic reach", top: "15%", left: "19%", rotate: 3 },
  { text: "low engagement", top: "23%", left: "8%", rotate: -3 },
  { text: "pay to play", top: "32%", left: "25%", rotate: -6 },
  { text: "noisy feed", top: "41%", left: "6%", rotate: -2 },
  { text: "banner blindness", top: "49%", left: "21%", rotate: 3 },
  { text: "algorithm changes", top: "57%", left: "9%", rotate: 2 },
  { text: "creative burnout", top: "64%", left: "27%", rotate: -4 },
  { text: "A/B fatigue", top: "72%", left: "5%", rotate: 5 },
  { text: "signal loss", top: "79%", left: "22%", rotate: -3 },
  { text: "scroll past", top: "87%", left: "11%", rotate: 4 },
  { text: "dark social", top: "11%", left: "31%", rotate: -2 },
  { text: "audience fatigue", top: "45%", left: "30%", rotate: -5 },
  { text: "attribution gaps", top: "60%", left: "14%", rotate: 3 },
  { text: "ad blocking", top: "83%", left: "28%", rotate: -4 },
  // ── Right flank ─────────────────────────────────────────────────────────
  { text: "low ROAS", top: "9%", right: "6%", rotate: 4 },
  { text: "ad fatigue", top: "17%", right: "22%", rotate: 6, accent: true },
  { text: "poor ROI", top: "26%", right: "7%", rotate: -4, accent: true },
  { text: "click fraud", top: "35%", right: "27%", rotate: 3 },
  { text: "wasted impressions", top: "43%", right: "5%", rotate: -3 },
  { text: "CPM spike", top: "51%", right: "24%", rotate: 5, accent: true },
  { text: "bounce rate", top: "59%", right: "9%", rotate: -2 },
  { text: "platform fees", top: "67%", right: "29%", rotate: 4 },
  { text: "bid wars", top: "75%", right: "6%", rotate: -5 },
  { text: "vanity metrics", top: "13%", right: "31%", rotate: 3 },
  { text: "zero brand recall", top: "22%", right: "14%", rotate: -3 },
  { text: "negative sentiment", top: "38%", right: "18%", rotate: 2 },
  { text: "low CTR", top: "48%", right: "32%", rotate: -4, accent: true },
  { text: "short attention span", top: "70%", right: "20%", rotate: 3 },
  { text: "content churn", top: "85%", right: "28%", rotate: -2 },
] as const;

export function NoiseProblem() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const headingEl = headingRef.current;
      if (!section) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      // ── Cinematic glitch shutter reveal ─────────────────────────────────
      if (headingEl && !prefersReducedMotion) {
        gsap.set(headingEl, { opacity: 0, x: 0, skewX: 0 });

        const glitchTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            once: true,
          },
        });

        glitchTl
          .to(headingEl, { opacity: 1, duration: 0.07 }, 0.4)
          .to(headingEl, { opacity: 0, duration: 0.06 })
          .to(headingEl, { opacity: 1, x: -3, duration: 0.06 })
          .to(headingEl, { opacity: 0, x: 0, duration: 0.06 })
          .to(headingEl, { opacity: 1, duration: 0.08 })
          .to(headingEl, { opacity: 0, duration: 0.06 })
          .to(headingEl, { opacity: 1, x: 4, skewX: 1.5, duration: 0.07 })
          .to(headingEl, { opacity: 0, x: 0, skewX: 0, duration: 0.06 })
          .to(headingEl, { opacity: 1, duration: 0.09 })
          .to(headingEl, { opacity: 0, duration: 0.07 })
          .to(headingEl, { opacity: 1, x: -2, duration: 0.06 })
          .to(headingEl, {
            opacity: 1,
            x: 0,
            skewX: 0,
            duration: 0.2,
            ease: "power2.out",
          });
      }

      // ── Subtitle fade-in ────────────────────────────────────────────────
      const subtitleEl = subtitleRef.current;
      if (subtitleEl && !prefersReducedMotion) {
        gsap.from(subtitleEl, {
          opacity: 0,
          y: 8,
          duration: 0.7,
          delay: 0.9,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            once: true,
          },
        });
      }

      // ── Pain cloud entrance + float ──────────────────────────────────────
      const clouds = gsap.utils.toArray<HTMLElement>(".pain-cloud", section);
      if (prefersReducedMotion || clouds.length === 0) return;

      gsap.from(clouds, {
        opacity: 0,
        scale: 0.82,
        y: 18,
        duration: 0.7,
        delay: 0.5,
        stagger: { amount: 2.0, from: "random" },
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      });

      clouds.forEach((cloud, index) => {
        gsap.to(cloud, {
          y: "+=10",
          duration: 3.4 + (index % 3) * 0.7,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: 0.5 + index * 0.14,
        });
      });
    },
    { scope: sectionRef },
  );

  return (
    <SnapSection
      ref={sectionRef}
      className="relative z-[5] overflow-hidden bg-background text-foreground"
      contentClassName="absolute inset-0 w-full max-w-none"
    >
      {/* Grunge texture overlay — same approach as Hero */}
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

      {/* Section subtitle — top-center, Poppins */}
      <p
        ref={subtitleRef}
        className="absolute left-0 right-0 top-[22%] z-[3] text-center text-sm font-light italic text-foreground/60 md:top-[22%] md:text-base"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        Businesses overspend on ads — and still miss their audience.
      </p>

      {/* Section headline */}
      <div
        ref={headingRef}
        className="absolute inset-0 z-[1] flex flex-col items-center justify-center text-center"
        style={{ fontFamily: '"Clash Display", sans-serif' }}
      >
        <p className="text-2xl font-bold uppercase tracking-[0.2em] text-foreground md:text-4xl">
          High spend.
        </p>
        <h2 className="text-[clamp(4rem,13vw,11rem)] font-bold uppercase leading-[0.85] tracking-[0.04em] text-primary">
          Zero signal.
        </h2>
      </div>

      {/* Pain point clouds */}
      <div className="pointer-events-none absolute inset-0 z-[2]" aria-hidden>
        {PAIN_CLOUDS.map((cloud) => (
          <span
            key={cloud.text}
            className={`pain-cloud absolute inline-block rounded-full border border-foreground/12 bg-white/75 px-4 py-2 text-sm shadow-[0_4px_24px_rgba(29,29,29,0.08)] backdrop-blur-sm ${
              "accent" in cloud && cloud.accent ? "text-primary" : "text-foreground"
            }`}
            style={{
              top: cloud.top,
              left: "left" in cloud ? cloud.left : undefined,
              right: "right" in cloud ? cloud.right : undefined,
              rotate: `${cloud.rotate}deg`,
            }}
          >
            {cloud.text}
          </span>
        ))}
      </div>
    </SnapSection>
  );
}
