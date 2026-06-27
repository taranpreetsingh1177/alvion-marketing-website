"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SnapSection } from "./SnapSection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = [
  {
    title: "Connection with Micro Influencers",
    description:
      "We pair your brand with micro-influencers whose audiences genuinely trust them. Targeted partnerships that spark real engagement—not vanity metrics.",
  },
  {
    title: "Website Creation",
    description:
      "From landing pages to full digital presence, we build sites engineered to convert. Clean design, fast performance, and ready to scale with your brand.",
  },
  {
    title: "Social Media Handling",
    description:
      "We run your social presence end to end—strategy, content, and community. Stay consistent, stay relevant, and turn followers into a loyal audience.",
  },
  {
    title: "Automations",
    description:
      "We automate the repetitive tasks and everyday operations that slow teams down. Less manual work, more time for what actually moves your brand forward.",
  },
] as const;

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

type AccordionItemProps = {
  title: string;
  description: string;
  isOpen: boolean;
  onToggle: () => void;
  isLast: boolean;
};

const ACCORDION_DURATION = 0.45;
const ACCORDION_EASE = "power2.inOut";

function AccordionItem({
  title,
  description,
  isOpen,
  onToggle,
  isLast,
}: AccordionItemProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const chevronRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = contentRef.current;
      const inner = innerRef.current;
      const chevron = chevronRef.current;
      if (!el || !inner) return;

      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduced) {
        gsap.set(el, { height: isOpen ? "auto" : 0 });
        gsap.set(inner, { opacity: isOpen ? 1 : 0, y: 0 });
        if (chevron) gsap.set(chevron, { rotation: isOpen ? 180 : 0 });
        return;
      }

      gsap.killTweensOf([el, inner, chevron]);

      if (chevron) {
        gsap.to(chevron, {
          rotation: isOpen ? 180 : 0,
          duration: ACCORDION_DURATION,
          ease: ACCORDION_EASE,
        });
      }

      if (isOpen) {
        gsap.set(el, { height: 0 });
        gsap.to(el, {
          height: inner.offsetHeight,
          duration: ACCORDION_DURATION,
          ease: ACCORDION_EASE,
          onComplete: () => {
            gsap.set(el, { height: "auto" });
          },
        });
        gsap.fromTo(
          inner,
          { opacity: 0, y: -6 },
          {
            opacity: 1,
            y: 0,
            duration: ACCORDION_DURATION * 0.75,
            ease: ACCORDION_EASE,
            delay: 0.05,
          },
        );
      } else {
        gsap.set(el, { height: el.offsetHeight });
        gsap.to(el, {
          height: 0,
          duration: ACCORDION_DURATION,
          ease: ACCORDION_EASE,
        });
        gsap.to(inner, {
          opacity: 0,
          y: -6,
          duration: ACCORDION_DURATION * 0.55,
          ease: ACCORDION_EASE,
        });
      }
    },
    { dependencies: [isOpen], scope: itemRef },
  );

  return (
    <div
      ref={itemRef}
      className={`w-full text-left ${!isLast ? "border-b border-white/15" : ""}`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="group flex w-full items-start justify-between gap-6 py-8 text-left md:py-10 lg:py-12"
      >
        <span
          className="text-left text-[clamp(1.5rem,3.5vw,2.75rem)] font-bold leading-[1.1] tracking-tight text-foreground-light"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          {title}
        </span>
        <span
          ref={chevronRef}
          className="mt-1 shrink-0 text-foreground-light/50 group-hover:text-foreground-light/70"
        >
          <ChevronIcon />
        </span>
      </button>

      <div ref={contentRef} className="overflow-hidden" style={{ height: 0 }}>
        <div ref={innerRef} className="pb-8 text-left md:pb-10 lg:pb-12">
          <p
            className="max-w-2xl text-left text-base leading-relaxed text-foreground-light/70 md:text-lg"
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const list = listRef.current;
      if (!section || !list) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const rows = gsap.utils.toArray<HTMLElement>(".service-row", list);

      gsap.from(rows, {
        opacity: 0,
        y: 32,
        duration: 0.6,
        stagger: 0.1,
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

  const handleToggle = (index: number) => {
    setOpenIndex((current) => {
      const next = current === index ? null : index;
      const section = sectionRef.current;
      if (section) {
        if (next !== null) {
          section.dataset.accordionOpen = "true";
        } else {
          delete section.dataset.accordionOpen;
        }
        window.dispatchEvent(new CustomEvent("services-accordion-change"));
      }
      return next;
    });
  };

  useEffect(() => {
    if (openIndex === null) return;

    const scrollEl = scrollContainerRef.current;
    if (!scrollEl) return;

    const onWheel = (event: WheelEvent) => {
      const maxScroll = scrollEl.scrollHeight - scrollEl.clientHeight;
      if (maxScroll <= 1) {
        event.preventDefault();
        return;
      }

      const scrollingDown = event.deltaY > 0;
      const scrollingUp = event.deltaY < 0;
      if (scrollingDown && scrollEl.scrollTop < maxScroll - 1) return;
      if (scrollingUp && scrollEl.scrollTop > 0) return;

      event.preventDefault();
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [openIndex]);

  return (
    <SnapSection
      ref={sectionRef}
      id="services"
      className="relative z-[15] bg-background-dark text-foreground-light"
      contentClassName="h-full min-h-0 w-full max-w-none items-start justify-center text-left text-foreground-light"
    >
      <div
        ref={scrollContainerRef}
        className={`flex h-full min-h-0 w-full flex-col px-10 py-12 md:px-16 md:py-16 ${
          openIndex !== null
            ? "justify-start overflow-y-auto overscroll-y-contain"
            : "justify-center overflow-hidden"
        }`}
      >
        <div ref={listRef} className="services-accordion mx-auto w-full max-w-4xl">
          {SERVICES.map((service, index) => (
            <div key={service.title} className="service-row w-full">
              <AccordionItem
                title={service.title}
                description={service.description}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
                isLast={index === SERVICES.length - 1}
              />
            </div>
          ))}
        </div>
      </div>
    </SnapSection>
  );
}
