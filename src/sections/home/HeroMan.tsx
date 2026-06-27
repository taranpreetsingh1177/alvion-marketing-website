"use client";

import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export function HeroMan() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const man = wrapperRef.current;
    const clipTrigger = document.querySelector<HTMLElement>("#solution");
    if (!man || !clipTrigger) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsap.set(man, { clipPath: "inset(0% 0 0% 0)" });

    if (!prefersReducedMotion) {
      gsap.from(man, {
        y: window.innerHeight,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.5,
      });
    }

    gsap.to(man, {
      clipPath: "inset(100% 0 0% 0)",
      ease: "none",
      scrollTrigger: {
        trigger: clipTrigger,
        start: "top bottom",
        end: "top top",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          man.style.visibility = self.progress >= 1 ? "hidden" : "visible";
        },
      },
    });
  });

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none fixed inset-x-0 bottom-0 z-20 flex justify-center"
      aria-hidden
    >
      <Image
        src="/hero-man.png"
        alt=""
        width={1024}
        height={682}
        priority
        unoptimized
        className="h-auto w-[95vw] max-h-[115dvh] translate-y-[28%] object-contain object-bottom mix-blend-screen md:w-[82vw] md:translate-y-[22%]"
      />
    </div>
  );
}
