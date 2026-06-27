"use client";

import { type FormEvent, useState } from "react";
import { SnapSection } from "./SnapSection";

const CONTACT_EMAIL = "office@alvion.in";
const CONTACT_PHONE = "+91 89499 21676";
const CONTACT_PHONE_HREF = "tel:+918949921676";
const DOMAIN = "alvion.in";

function ContactDetails() {
  return (
    <div className="grid w-full grid-cols-1 gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3">
      <div>
        <a
          href={`https://www.${DOMAIN}`}
          className="inline-block text-base text-foreground-light/85 transition-colors hover:text-foreground-light md:text-lg"
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          www.{DOMAIN}
        </a>
      </div>

      <div>
        <p
          className="text-xs font-medium uppercase tracking-[0.35em] text-foreground-light/50"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          Address
        </p>
        <address
          className="mt-3 not-italic text-base leading-relaxed text-foreground-light/85 md:text-lg"
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          New Delhi, India
        </address>
      </div>

      <div className="sm:col-span-2 lg:col-span-1">
        <p
          className="text-xs font-medium uppercase tracking-[0.35em] text-foreground-light/50"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          Contact
        </p>
        <ul
          className="mt-3 space-y-2 text-base text-foreground-light/85 md:text-lg"
          style={{ fontFamily: "var(--font-sans), sans-serif" }}
        >
          <li>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="transition-colors hover:text-foreground-light"
            >
              {CONTACT_EMAIL}
            </a>
          </li>
          <li>
            <a
              href={CONTACT_PHONE_HREF}
              className="transition-colors hover:text-foreground-light"
            >
              {CONTACT_PHONE}
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

function LoadingDots() {
  return (
    <span className="inline-flex items-center justify-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-white animate-dot-wave"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
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
    <div className="w-full">
      <h3
        className="mb-2 text-center text-xl font-medium text-foreground-light md:text-2xl"
        style={{ fontFamily: "var(--font-poppins), sans-serif" }}
      >
        Get in touch
      </h3>
      <p
        className="mb-6 text-center text-sm text-foreground-light/60 md:mb-8 md:text-base"
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
          aria-busy={status === "loading"}
          aria-label={status === "loading" ? "Sending message" : undefined}
          className="mt-1 w-full cursor-pointer rounded-lg bg-primary px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary/90 active:bg-primary/80 disabled:cursor-not-allowed disabled:opacity-60"
          style={{ fontFamily: "var(--font-poppins), sans-serif" }}
        >
          <span className="relative inline-flex h-5 w-full items-center justify-center">
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                status === "loading" ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              Send Message
            </span>
            <span
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                status === "loading" ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              aria-hidden={status !== "loading"}
            >
              <LoadingDots />
            </span>
          </span>
        </button>
      </form>
    </div>
  );
}

export function Contact() {
  return (
    <SnapSection
      id="contact"
      className="relative z-[15] bg-background-dark text-foreground-light"
      contentClassName="h-full w-full max-w-none items-stretch text-left text-foreground-light"
    >
      <div className="flex h-full w-full flex-col overflow-y-auto px-10 md:px-16">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col">
          <div className="flex min-h-0 flex-1 items-center justify-center py-8 md:py-10">
            <div className="w-full max-w-md">
              <ContactForm />
            </div>
          </div>

          <footer className="w-full shrink-0 border-t border-white/10 pt-10 pb-6 md:pt-12 md:pb-8">
            <ContactDetails />

            <p
              className="mt-10 text-xs text-foreground-light/40 md:mt-12"
              style={{ fontFamily: "var(--font-poppins), sans-serif" }}
            >
              © {new Date().getFullYear()} Alvion. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    </SnapSection>
  );
}
