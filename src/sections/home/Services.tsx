"use client";

import { type FormEvent, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SnapSection } from "./SnapSection";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const SERVICES = [
  {
    title: "Connection with Micro Influencers",
    description:
      "We connect your brand with authentic micro-influencers whose audiences actually trust them. Targeted partnerships that drive real engagement—not vanity metrics.",
  },
  {
    title: "Website Creation",
    description:
      "From landing pages to full digital presence, we build websites that convert visitors into customers. Clean design, fast performance, and built to grow with your brand.",
  },
  {
    title: "Social Media Handling",
    description:
      "We manage your social presence end to end—strategy, content, and community. Stay relevant, stay consistent, and turn followers into loyal customers.",
  },
  {
    title: "College Ambassadors",
    description:
      "Tap into campus culture with student ambassadors who live and breathe your brand. Grassroots advocacy that builds awareness where it matters most.",
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

function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(
          data.error ?? "Something went wrong. Please try again.",
        );
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md lg:max-w-none">
      <h3
        className="mb-2 text-xl font-medium text-foreground-light md:text-2xl"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        Get in touch
      </h3>
      <p
        className="mb-6 text-sm text-foreground-light/60 md:mb-8 md:text-base"
        style={{ fontFamily: "var(--font-sans), sans-serif" }}
      >
        Tell us about your project.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-name"
            className="text-sm text-foreground-light/70"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            required
            disabled={status === "loading"}
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-foreground-light placeholder:text-white/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-email"
            className="text-sm text-foreground-light/70"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            disabled={status === "loading"}
            className="rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-foreground-light placeholder:text-white/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="contact-message"
            className="text-sm text-foreground-light/70"
            style={{ fontFamily: "var(--font-poppins), sans-serif" }}
          >
            Message
          </label>
          <textarea
            id="contact-message"
            name="message"
            rows={4}
            placeholder="How can we help?"
            required
            disabled={status === "loading"}
            className="resize-none rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-foreground-light placeholder:text-white/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:opacity-60"
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
          />
        </div>

        {status === "success" && (
          <p
            className="text-sm text-green-400"
            role="status"
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
          >
            Thanks! Your message has been sent.
          </p>
        )}

        {status === "error" && (
          <p
            className="text-sm text-red-400"
            role="alert"
            style={{ fontFamily: "var(--font-sans), sans-serif" }}
          >
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-1 w-full cursor-pointer rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-60 md:w-auto"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          {status === "loading" ? "Sending…" : "Send Message"}
        </button>
      </form>
    </div>
  );
}

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
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
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <SnapSection
      ref={sectionRef}
      id="services"
      className="relative z-[15] overflow-hidden bg-background-dark text-foreground-light"
      contentClassName="absolute inset-0 w-full max-w-none items-start text-left text-foreground-light"
    >
      <div className="relative z-[1] flex h-full w-full flex-col items-start px-10 py-12 text-left md:px-16 md:py-16">
        <div className="flex w-full flex-1 flex-col gap-10 lg:flex-row lg:items-center lg:gap-12 xl:gap-16">
          <div
            ref={listRef}
            className="flex w-full flex-col items-start justify-center lg:w-1/2"
          >
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

          <div className="flex w-full items-center justify-center lg:w-1/2 lg:justify-end">
            <ContactForm />
          </div>
        </div>

        <p
          className="mt-8 w-full text-center text-xs text-foreground-light/30 md:mt-10"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          © 2026 Alvion. All rights reserved.
        </p>
      </div>
    </SnapSection>
  );
}
