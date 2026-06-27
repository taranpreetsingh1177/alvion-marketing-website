"use client";

import Link from "next/link";
import { isDarkSnapSection, useSnapSection } from "./SnapContext";

const navLinks = [
  { label: "Services", href: "#services" },
  { label: "Portfolio", href: "#portfolio" },
  { label: "Contact us", href: "#contact" },
];

export function Header() {
  const { activeSectionId } = useSnapSection();
  const isLight = isDarkSnapSection(activeSectionId);

  const textClass = isLight ? "text-foreground-light" : "text-foreground";
  const underlineClass = isLight ? "after:bg-foreground-light" : "after:bg-primary";

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-6 md:px-10 md:py-8">
      <Link
        href="/"
        className={`text-2xl font-semibold tracking-tight transition-colors duration-300 ${textClass}`}
      >
        Alvion<span className="text-primary">.</span>
      </Link>

      <nav className="flex items-center gap-6 md:gap-8">
        {navLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className={`relative text-lg transition-colors duration-300 ${textClass} after:absolute after:bottom-0 after:left-0 after:h-[1.5px] after:w-0 ${underlineClass} after:transition-all after:duration-300 hover:after:w-full`}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
