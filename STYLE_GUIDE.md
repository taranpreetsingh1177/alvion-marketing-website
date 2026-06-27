# Alvion Website — Style Guide

Design and style decisions established in the codebase as of June 2026. All values are extracted directly from source files.

---

## Table of Contents

1. [Brand Colors](#1-brand-colors)
2. [Typography](#2-typography)
3. [Section Structure](#3-section-structure)
4. [Component Conventions](#4-component-conventions)
5. [Animation Conventions](#5-animation-conventions)
6. [Spacing & Layout](#6-spacing--layout)
7. [Texture](#7-texture)
8. [Image Conventions](#8-image-conventions)
9. [Design Tokens](#9-design-tokens)

---

## 1. Brand Colors

Defined as CSS custom properties in `src/app/globals.css` under `:root`.

| Token               | Hex       | Description                                                              |
| ------------------- | --------- | ------------------------------------------------------------------------ |
| `--primary`         | `#ca0013` | Alvion red. Logo dot, nav hover underline, hero text fill, accent words. |
| `--background`      | `#eeebe3` | Warm off-white. Body background, Hero and SectionTwo backgrounds.        |
| `--background-dark` | `#1d1d1d` | Near-black. SectionThree background.                                     |
| `--foreground`      | `#1d1d1d` | Default text color on light sections.                                    |
| `--foreground-light`| `#eeebe3` | Text color on dark sections (SectionThree heading, client label).        |

**One-off color (not a CSS variable):**

| Value     | Usage                                                                 |
| --------- | --------------------------------------------------------------------- |
| `#FFEDBE` | Warm cream/gold. Applied inline to the highlighted word "noise" in the SectionThree heading. |

---

## 2. Typography

### Fonts in use

| Font             | Source          | Weights loaded | CSS variable       | Tailwind class   |
| ---------------- | --------------- | -------------- | ------------------ | ---------------- |
| **Inter**        | Google Fonts    | Variable       | `--font-inter`     | `font-sans`      |
| **Poppins**      | Google Fonts    | 300, 400       | `--font-poppins`   | `font-poppins`   |
| **Clash Display**| Self-hosted     | 200–700 (variable) | *(none; referenced by name)* | `hero-text-grunge` class or inline style |

### Self-hosted font declaration (`globals.css`)

```css
@font-face {
  font-family: "Clash Display";
  src: url("/ClashDisplay_Complete/Fonts/WEB/fonts/ClashDisplay-Variable.woff2") format("woff2");
  font-weight: 200 700;
  font-display: swap;
}
```

### Font loading (`layout.tsx`)

```ts
const inter   = Inter({ variable: "--font-inter", subsets: ["latin"] });
const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["300", "400"] });
```

Both variables are applied to `<html>` via `className`. The body defaults to `font-sans` (Inter).

### Where each font is used

| Font             | Component / Context                                                                                   |
| ---------------- | ----------------------------------------------------------------------------------------------------- |
| **Inter**        | Body default. All text not explicitly overridden. Header logo, nav links.                            |
| **Poppins**      | SectionTwo subtitle ("Businesses overspend…"). SectionThree client label ("Our Previous Clients"). Applied via `style={{ fontFamily: "var(--font-poppins), sans-serif" }}`. |
| **Clash Display**| Hero headline (`.hero-text-grunge` CSS class). SectionTwo heading ("Zero signal."). SectionThree heading ("We help businesses…"). Applied via `style={{ fontFamily: '"Clash Display", sans-serif' }}`. |

### Responsive type sizes

| Element                           | Size                                      | Component     |
| --------------------------------- | ----------------------------------------- | ------------- |
| Hero eyebrow ("REMOVE THE")       | `text-3xl` → `md:text-5xl` → `lg:text-6xl` | Hero          |
| Hero main headline ("NOISE")      | `clamp(6rem, 22vw, 18rem)`, `leading-[0.85]` | Hero        |
| SectionTwo subheadline ("High spend.") | `text-2xl` → `md:text-4xl`          | SectionTwo    |
| SectionTwo main headline ("Zero signal.") | `clamp(4rem, 13vw, 11rem)`, `leading-[0.85]` | SectionTwo |
| SectionThree heading              | `clamp(2.6rem, 5.5vw, 5rem)`, `leading-[1.08]` | SectionThree |
| Header logo                       | `text-2xl font-semibold tracking-tight`   | Header        |
| Header nav links                  | `text-lg`                                 | Header        |
| SectionTwo subtitle               | `text-sm` → `md:text-base`, italic, `font-light`, `text-foreground/60` | SectionTwo |
| SectionThree client label         | `text-xs` → `md:text-sm`, uppercase, `tracking-widest`, `text-foreground-light/40` | SectionThree |

### Letter-spacing patterns

| Context                        | Tracking                       |
| ------------------------------ | ------------------------------ |
| Hero eyebrow                   | `tracking-[0.18em]` → `md:0.25em` → `lg:0.32em` |
| Hero/SectionTwo main headlines | `tracking-[0.04em]`            |
| SectionTwo subheadline         | `tracking-[0.2em]`             |
| SectionThree heading           | `tracking-tight`               |
| Header logo                    | `tracking-tight`               |
| Client label                   | `tracking-widest`              |

---

## 3. Section Structure

### Z-index stack (high → low)

| Layer                         | z-index   | Notes                                                   |
| ----------------------------- | --------- | ------------------------------------------------------- |
| Header (`<header>`)           | `z-50`    | Fixed, always on top.                                   |
| SectionThree (`#portfolio`)   | `z-30`    | Dark section; slides over HeroMan on scroll.            |
| HeroMan (fixed overlay)       | `z-20`    | Fixed bottom; clip-path wipe removes it when SectionThree enters. |
| Hero (`<section>`)            | `z-10`    |                                                         |
| SectionTwo (`#services`)      | `z-[5]`   |                                                         |

### Section summary

| Section        | Component       | Background              | Purpose                                     | Viewport |
| -------------- | --------------- | ----------------------- | ------------------------------------------- | -------- |
| **Header**     | `Header`        | Transparent (no bg)     | Navigation — fixed, floats over all sections. | —      |
| **Hero**       | `Hero`          | `bg-background` (#eeebe3) | Brand statement: "REMOVE THE NOISE".       | `h-dvh`  |
| **SectionTwo** | `SectionTwo`    | `bg-background` (#eeebe3) | Pain point showcase: "High spend. Zero signal." | `h-dvh` |
| **SectionThree** | `SectionThree` | `bg-background-dark` (#1d1d1d) | Value proposition + client logos.  | `h-dvh`  |
| **HeroMan**    | `HeroMan`       | Transparent (fixed layer) | Decorative man image, `mix-blend-screen`. | Fixed    |

---

## 4. Component Conventions

### `SnapSection` component (`src/sections/home/SnapSection.tsx`)

A reusable wrapper that every full-viewport snap section (except Hero) is built on.

```tsx
<section
  ref={ref}
  id={id}
  data-snap-section                          // queried by ScrollSnap
  className="flex h-dvh flex-col items-center justify-center px-6 md:px-10 ..."
>
  <div
    data-section-content                     // queried by ScrollSnap for entry animation
    className="flex flex-col items-center text-center ..."
  >
    {children}
  </div>
</section>
```

**Props:**

| Prop               | Type        | Purpose                                                  |
| ------------------ | ----------- | -------------------------------------------------------- |
| `id`               | `string?`   | Section ID used for anchor navigation (`#services`, `#portfolio`). |
| `className`        | `string?`   | Additional classes on the outer `<section>`.             |
| `contentClassName` | `string?`   | Additional classes on the inner `[data-section-content]` div. |
| `ref`              | `ForwardRef` | Forwarded to `<section>` for GSAP scope.                |

### Data attributes

| Attribute              | Applied to            | Used by                                              |
| ---------------------- | --------------------- | ---------------------------------------------------- |
| `data-snap-section`    | Every `<section>` that is a snap target (Hero + all SnapSection instances) | `ScrollSnap` — collects targets with `gsap.utils.toArray("[data-snap-section]")` |
| `data-section-content` | Inner content wrapper inside `SnapSection` | `ScrollSnap` — applies entry fade-in animation (`opacity: 0 → 1, y: 56 → 0`) |

### `ScrollSnap` wrapper (`src/sections/home/ScrollSnap.tsx`)

Renders no DOM of its own (`return children`). Sets up the full-page GSAP snap system in a `useEffect`.

**Snap constants:**

| Constant              | Value         | Purpose                                      |
| --------------------- | ------------- | -------------------------------------------- |
| `SNAP_DURATION`       | `0.55`        | Scroll snap animation duration (seconds).    |
| `SNAP_EASE`           | `"expo.inOut"`| Easing for snap transitions.                 |
| `SNAP_DELAY`          | `0.05`        | Delay before snap fires.                     |
| `NAV_DURATION`        | `0.8`         | Duration for anchor link (`<a href="#">`) navigation. |
| `GESTURE_TOLERANCE`   | `14`          | Pixel threshold before Observer fires.       |

**Input handling:** wheel, touch, pointer (via GSAP Observer), keyboard (Arrow keys, PageUp/Down, Space), and anchor link clicks.

**Reduced-motion fallback:** adds `snap-y snap-mandatory` CSS classes to `<html>` and relies on `scroll-snap-align: start` declared in `globals.css`.

---

## 5. Animation Conventions

### GSAP plugins registered

| Plugin          | Registered in                            |
| --------------- | ---------------------------------------- |
| `useGSAP`       | Hero, SectionTwo, SectionThree, HeroMan  |
| `ScrollTrigger` | SectionTwo, SectionThree, HeroMan, ScrollSnap |
| `ScrollToPlugin`| ScrollSnap                               |
| `Observer`      | ScrollSnap                               |

Always call `gsap.registerPlugin(...)` at the module level, outside the component.

### `useGSAP` hook usage

All animation setup uses the `@gsap/react` `useGSAP` hook (never raw `useEffect` for GSAP).

```tsx
useGSAP(
  () => { /* GSAP code here */ },
  { scope: containerRef },   // always pass a scope ref to isolate selectors
);
```

HeroMan omits `scope` because it queries a separate section by ID (`#portfolio`).

### `prefers-reduced-motion` guard

Every component manually checks for reduced motion before running decorative animations:

```ts
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if (prefersReducedMotion) return;
```

### Eases used

| Ease            | Used for                                                              |
| --------------- | --------------------------------------------------------------------- |
| `power3.out`    | Hero character stagger, SectionThree word stagger, HeroMan entry, `[data-section-content]` entry |
| `power2.out`    | SectionTwo pain cloud entrance, final frame of glitch reveal          |
| `expo.inOut`    | ScrollSnap snap-to-section transitions                                |
| `sine.inOut`    | Pain cloud perpetual float loop                                       |
| `none`          | HeroMan clip-path scrub (linear, tied to scroll progress)             |

### Per-component animation breakdown

#### Hero — character stagger reveal (on mount)

- Characters split into `<span class="hero-char">` via `splitChars()`.
- Two lines animate in sequence via a GSAP timeline.
- Line 1: `y: 80 → 0`, `opacity: 0 → 1`, duration `0.7s`, stagger `0.04s`.
- Line 2: `y: 120 → 0`, `opacity: 0 → 1`, duration `0.9s`, stagger `0.06s`, offset `"-=0.4"`.
- Timeline default ease: `power3.out`.

#### SectionTwo — cinematic glitch heading reveal (ScrollTrigger, `once: true`)

- Trigger: `top 65%`.
- Heading flickers through ~12 sequential `to()` steps alternating `opacity 0/1`, `x ±2–4`, `skewX 0/1.5` with durations of `0.04–0.15s`.
- Settles with `ease: "power2.out"` on the final step.

#### SectionTwo — pain cloud entrance + float (ScrollTrigger)

- **Entrance:** `from { opacity: 0, scale: 0.82, y: 18 }`, duration `0.65s`, stagger `{ amount: 1.2, from: "random" }`, `power2.out`.
  - `toggleActions: "play none none reverse"`.
- **Float loop (perpetual):** each cloud `to { y: "+=10" }`, duration `2.8 + (index % 3) * 0.6`s, `repeat: -1`, `yoyo: true`, `sine.inOut`, delay `index * 0.1`.

#### SectionThree — word stagger reveal (ScrollTrigger, `once: true`)

- Words wrapped in `<span class="s3-word">` and queried with `.querySelectorAll(".s3-word")`.
- `from { y: 56, opacity: 0 }`, duration `0.65s`, stagger `0.07s`, `power3.out`.
- Trigger: `top 70%`.

#### HeroMan — entry + scroll wipe

- **Entry:** `from { y: window.innerHeight, opacity: 0 }`, duration `1.2s`, delay `0.5s`, `power3.out`.
- **Clip-path wipe:** `clip-path` animated from `inset(0% 0 0% 0)` → `inset(100% 0 0% 0)` as `#portfolio` scrolls into view. `scrub: true`, trigger `start: "top bottom"`, `end: "top top"`, ease `"none"`.
- `invalidateOnRefresh: true` for correct scrub on resize.
- `visibility: hidden` applied at `progress >= 1` to remove from accessibility tree.

#### ScrollSnap — `[data-section-content]` entry (ScrollTrigger)

- Applied to every section except the first.
- `from { opacity: 0, y: 56 }`, duration `0.9s`, delay `0.3s`, `power3.out`.
- `toggleActions: "play none none reverse"`, trigger `start: "top 65%"`.

---

## 6. Spacing & Layout

### Horizontal padding (responsive)

| Context                  | Mobile   | Desktop (`md:`) |
| ------------------------ | -------- | --------------- |
| Hero, SnapSection        | `px-6` (24px) | `px-10` (40px) |
| Header                   | `px-6` (24px) | `px-10` (40px) |
| SectionThree inner       | `px-10` (40px) | `px-16` (64px) |

### Vertical padding

| Context                  | Mobile        | Desktop (`md:`) |
| ------------------------ | ------------- | --------------- |
| Header                   | `py-6` (24px) | `py-8` (32px)  |
| SectionThree inner       | `py-12` (48px) | `py-16` (64px) |

### Viewport sizing

All snap sections use `h-dvh` (dynamic viewport height) to handle mobile browser chrome correctly. `min-h-full` is set on the body.

### Max-widths

| Element                        | Max-width         |
| ------------------------------ | ----------------- |
| SectionThree heading (`<h2>`)  | `max-w-4xl`       |
| HeroMan image                  | None; `w-[95vw] md:w-[82vw]`, `max-h-[115dvh]` |
| Navigation container           | None (full-width fixed header) |

---

## 7. Texture

A single grunge texture image (`/grunge-texture.png`) is used in two ways:

### Full-section overlay

Applied as an absolutely-positioned `<div>` inside Hero and SectionTwo.

```tsx
<div
  className="pointer-events-none absolute inset-0 z-0 mix-blend-multiply"
  style={{
    backgroundImage: "url('/grunge-texture.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.08,
  }}
/>
```

| Property         | Value            |
| ---------------- | ---------------- |
| Opacity          | `0.08`           |
| Blend mode       | `mix-blend-multiply` |
| Background size  | `cover`          |
| Background pos   | `center`         |
| Pointer events   | `none`           |

### Text fill (CSS clip trick)

Used on `.hero-char` spans inside `.hero-text-grunge`. The texture is layered behind a solid primary-color gradient and clipped to the text shape.

```css
.hero-text-grunge .hero-char {
  background-image:
    linear-gradient(var(--primary), var(--primary)),
    url("/grunge-texture.png");
  background-size: auto, 200%;
  background-attachment: scroll, scroll;   /* NOT fixed — avoids GSAP transform glitch */
  background-blend-mode: normal, multiply;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
```

`background-attachment: scroll` (not `fixed`) is intentional — `fixed` decouples from CSS transforms, causing visible glitching during GSAP y/opacity animations.

---

## 8. Image Conventions

### HeroMan (`/hero-man.png`)

| Property          | Value                                              |
| ----------------- | -------------------------------------------------- |
| File              | `/hero-man.png` (public folder)                    |
| Native size       | 1024 × 682 px                                      |
| Rendered width    | `w-[95vw]` / `md:w-[82vw]`                        |
| Max height        | `max-h-[115dvh]`                                   |
| Object fit        | `object-contain object-bottom`                     |
| Blend mode        | `mix-blend-screen`                                 |
| `priority`        | `true` (preloaded as LCP candidate)                |
| `unoptimized`     | `true` (skips Next.js image optimisation pipeline) |
| Alt text          | `""` (decorative; wrapper has `aria-hidden`)       |
| Positioning       | Fixed bottom-center; `translate-y-[28%]` / `md:translate-y-[22%]` creates the rising-from-bottom look |

`mix-blend-screen` removes the dark background of the PNG on light sections; this is the primary reason the image must be unoptimized (WebP conversion can alter pixel data in ways that affect the blend).

---

## 9. Design Tokens

Registered via `@theme inline` in `globals.css`, making them available as Tailwind utility classes.

### Color tokens

| Tailwind class / token    | CSS variable            | Resolved value |
| ------------------------- | ----------------------- | -------------- |
| `bg-primary` / `text-primary` | `var(--primary)`    | `#ca0013`      |
| `bg-background`           | `var(--background)`     | `#eeebe3`      |
| `bg-background-dark`      | `var(--background-dark)`| `#1d1d1d`      |
| `text-foreground`         | `var(--foreground)`     | `#1d1d1d`      |
| `text-foreground-light`   | `var(--foreground-light)`| `#eeebe3`     |

Opacity modifiers work as expected (e.g. `text-foreground/60`, `border-foreground/12`, `bg-white/75`).

### Font tokens

| Tailwind class   | CSS variable          | Font family |
| ---------------- | --------------------- | ----------- |
| `font-sans`      | `var(--font-inter)`   | Inter       |
| `font-poppins`   | `var(--font-poppins)` | Poppins     |

Clash Display has no Tailwind token — it is always applied via the `.hero-text-grunge` CSS class or an inline `style` attribute.
