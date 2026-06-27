"use client";

import { useEffect, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { Observer } from "gsap/Observer";
import { SnapContext } from "./SnapContext";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, Observer);

const SNAP_DURATION = 0.55;
const SNAP_EASE = "expo.inOut";
const SNAP_DELAY = 0.05;
const NAV_DURATION = 0.8;
const GESTURE_TOLERANCE = 14;

function shouldLockSectionSnap(sections: HTMLElement[]): boolean {
  const services = document.getElementById("services");
  if (!services || services.dataset.accordionOpen !== "true") return false;

  const servicesIndex = sections.indexOf(services);
  if (servicesIndex < 0) return false;

  return (
    getNearestSectionIndex(sections) === servicesIndex &&
    Math.abs(window.scrollY - services.offsetTop) < 80
  );
}

function getNearestSectionIndex(
  sections: HTMLElement[],
  scrollY = window.scrollY,
): number {
  let nearest = 0;
  let minDistance = Infinity;

  sections.forEach((section, index) => {
    const distance = Math.abs(section.offsetTop - scrollY);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = index;
    }
  });

  return nearest;
}

export function ScrollSnap({ children }: { children: ReactNode }) {
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      document.documentElement.classList.add("snap-y", "snap-mandatory");

      const sections = gsap.utils.toArray<HTMLElement>("[data-snap-section]");
      const observer = new IntersectionObserver(
        (entries) => {
          const mostVisible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

          if (mostVisible?.target instanceof HTMLElement) {
            setActiveSectionId(mostVisible.target.id || null);
          }
        },
        { threshold: 0.5 },
      );

      sections.forEach((section) => observer.observe(section));
      setActiveSectionId(sections[getNearestSectionIndex(sections)]?.id ?? null);

      const onAnchorClick = (event: MouseEvent) => {
        const link = (event.target as HTMLElement).closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;

        const sectionTarget = sections.includes(target)
          ? target
          : sections.find((section) => section.contains(target));

        if (!sectionTarget) return;

        event.preventDefault();
        window.scrollTo({ top: sectionTarget.offsetTop, behavior: "smooth" });
      };

      document.addEventListener("click", onAnchorClick);

      return () => {
        document.removeEventListener("click", onAnchorClick);
        observer.disconnect();
        document.documentElement.classList.remove("snap-y", "snap-mandatory");
      };
    }

    let removeAnchorListener: (() => void) | undefined;
    let removeKeyListener: (() => void) | undefined;
    let removeLayoutListeners: (() => void) | undefined;
    let activeIndex = 0;
    let isNavigating = false;

    const ctx = gsap.context(() => {
      const sections = gsap.utils.toArray<HTMLElement>("[data-snap-section]");

      if (sections.length < 2) return;

      activeIndex = getNearestSectionIndex(sections);
      setActiveSectionId(sections[activeIndex]?.id ?? null);

      const syncActiveSection = (index: number) => {
        activeIndex = index;
        setActiveSectionId(sections[index]?.id ?? null);
      };

      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: "top center",
          end: "bottom center",
          onToggle: (self) => {
            if (self.isActive) {
              setActiveSectionId(section.id ?? null);
            }
          },
        });
      });

      const snapToNearestProgress = (progress: number) => {
        const maxScroll = ScrollTrigger.maxScroll(window);
        const scrollY = progress * maxScroll;
        let nearestProgress = 0;
        let minDistance = Infinity;

        sections.forEach((section) => {
          const distance = Math.abs(section.offsetTop - scrollY);
          if (distance < minDistance) {
            minDistance = distance;
            nearestProgress = maxScroll > 0 ? section.offsetTop / maxScroll : 0;
          }
        });

        return nearestProgress;
      };

      const snapTrigger = ScrollTrigger.create({
        start: 0,
        end: "max",
        snap: {
          snapTo: snapToNearestProgress,
          duration: { min: SNAP_DURATION, max: SNAP_DURATION },
          delay: SNAP_DELAY,
          ease: SNAP_EASE,
        },
      });

      const scrollToSection = (
        index: number,
        duration = SNAP_DURATION,
        delay = SNAP_DELAY,
      ) => {
        const clamped = gsap.utils.clamp(0, sections.length - 1, index);
        const target = sections[clamped];
        if (!target) {
          isNavigating = false;
          return;
        }

        const atTarget =
          clamped === activeIndex &&
          Math.abs(window.scrollY - target.offsetTop) < 4;

        if (atTarget) {
          isNavigating = false;
          return;
        }

        syncActiveSection(clamped);
        isNavigating = true;
        snapTrigger.disable();
        gsap.killTweensOf(window);

        gsap.to(window, {
          scrollTo: { y: target, autoKill: false },
          duration,
          delay,
          ease: SNAP_EASE,
          overwrite: true,
          onComplete: () => {
            isNavigating = false;
            syncSnapLock();
          },
        });
      };

      const navigateBy = (direction: 1 | -1) => {
        if (isNavigating || shouldLockSectionSnap(sections)) return;
        scrollToSection(getNearestSectionIndex(sections) + direction);
      };

      let snapObserver: Observer | undefined;

      const syncSnapLock = () => {
        const locked = shouldLockSectionSnap(sections);
        if (locked) {
          snapObserver?.disable();
          if (!isNavigating) snapTrigger.disable();
        } else {
          snapObserver?.enable();
          if (!isNavigating) snapTrigger.enable();
        }
      };

      snapObserver = Observer.create({
        target: window,
        type: "wheel,touch",
        tolerance: GESTURE_TOLERANCE,
        preventDefault: false,
        onDown: (self) => {
          if (shouldLockSectionSnap(sections)) return;
          self.event?.preventDefault();
          navigateBy(1);
        },
        onUp: (self) => {
          if (shouldLockSectionSnap(sections)) return;
          self.event?.preventDefault();
          navigateBy(-1);
        },
      });

      const servicesSection = document.getElementById("services");
      const accordionObserver =
        servicesSection &&
        new MutationObserver(() => {
          syncSnapLock();
        });

      accordionObserver?.observe(servicesSection!, {
        attributes: true,
        attributeFilter: ["data-accordion-open"],
      });

      const onAccordionChange = () => syncSnapLock();

      window.addEventListener("scroll", syncSnapLock, { passive: true });
      window.addEventListener("services-accordion-change", onAccordionChange);
      syncSnapLock();

      const onKeyDown = (event: KeyboardEvent) => {
        if (isNavigating || shouldLockSectionSnap(sections)) return;

        const target = event.target;
        if (
          target instanceof HTMLElement &&
          (target.isContentEditable ||
            target.closest("input, textarea, select, button"))
        ) {
          return;
        }

        if (
          event.key === "ArrowDown" ||
          event.key === "PageDown" ||
          event.key === " "
        ) {
          event.preventDefault();
          navigateBy(1);
        } else if (event.key === "ArrowUp" || event.key === "PageUp") {
          event.preventDefault();
          navigateBy(-1);
        }
      };

      window.addEventListener("keydown", onKeyDown);
      removeKeyListener = () => window.removeEventListener("keydown", onKeyDown);

      sections.forEach((section, index) => {
        if (index === 0) return;
        // Solution animates its own heading words — skip the shared content fade.
        if (section.id === "solution") return;

        const content = section.querySelector("[data-section-content]");
        if (!content) return;

        gsap.from(content, {
          opacity: 0,
          y: 56,
          duration: 0.9,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        });
      });

      const onAnchorClick = (event: MouseEvent) => {
        const link = (event.target as HTMLElement).closest('a[href^="#"]');
        if (!link) return;

        const href = link.getAttribute("href");
        if (!href || href === "#") return;

        const target = document.querySelector<HTMLElement>(href);
        if (!target) return;

        const sectionTarget = sections.includes(target)
          ? target
          : sections.find((section) => section.contains(target));

        if (!sectionTarget) return;

        event.preventDefault();

        const index = sections.indexOf(sectionTarget);
        scrollToSection(index, NAV_DURATION, 0);
      };

      document.addEventListener("click", onAnchorClick);
      removeAnchorListener = () =>
        document.removeEventListener("click", onAnchorClick);

      const refreshLayout = () => {
        syncActiveSection(getNearestSectionIndex(sections));
        ScrollTrigger.refresh();
      };

      window.addEventListener("load", refreshLayout);
      window.addEventListener("resize", refreshLayout);
      removeLayoutListeners = () => {
        window.removeEventListener("load", refreshLayout);
        window.removeEventListener("resize", refreshLayout);
        window.removeEventListener("scroll", syncSnapLock);
        window.removeEventListener(
          "services-accordion-change",
          onAccordionChange,
        );
        accordionObserver?.disconnect();
      };

      ScrollTrigger.refresh();
    });

    return () => {
      removeAnchorListener?.();
      removeKeyListener?.();
      removeLayoutListeners?.();
      ctx.revert();
    };
  }, []);

  return (
    <SnapContext.Provider value={{ activeSectionId }}>
      {children}
    </SnapContext.Provider>
  );
}
