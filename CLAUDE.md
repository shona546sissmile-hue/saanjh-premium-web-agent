# Saanjh premium web agent

Toolchain for building cinematic, premium, custom-designed websites. Every
site built here must feel art-directed and bespoke: immersive, highly
interactive, 3D where it earns its place. It must never look generic,
templated or obviously AI-generated, and it must stay fast and accessible.

## Premium website philosophy

### Who this is for

These are not ordinary business websites. The client is a high-end business
owner investing roughly **$700–$1,000**. The finished site must communicate
a far higher perceived value, on par with a **₹7–10 lakh** premium build.
Treat every project as a custom digital experience, never a template fill.

### The benchmark

**Cinematic + luxurious + immersive + sophisticated + interactive + refined
\+ human-designed.**

The reference images in the Claude Project set the visual quality bar. If
they aren't available in this repo or conversation, ask for them (e.g. added
to `references/`) before committing to a major design direction; don't guess
at the bar.

### Perceived value comes from craft, not effects

A site feels expensive through:

- **Art direction**: one clear, ownable visual idea per project.
- **Typography**: expressive display type, disciplined hierarchy, real
  typographic detail (tracking, optical sizes, ligatures, rag).
- **Composition and spacing**: generous, intentional negative space;
  asymmetry and grid-breaking only where they add tension.
- **Imagery and video**: art-directed, colour-graded, consistent, never
  generic stock.
- **Motion and interaction**: choreographed, with consistent easing and timing.
- **3D and depth**: layered, tactile, used where it deepens the story.
- **Storytelling**: the page is a narrative with a beginning, build and payoff.
- **Details**: cursor states, hover responses, loading moments, focus
  styles, empty states, the 404 page, the favicon.

Premium does **not** mean adding effects everywhere. **Every effect must have
a purpose**: it reveals, guides, explains, rewards or builds atmosphere. If
you can't state the purpose, remove it.

### Custom per client, every time

Derive the visual direction from the client's:

- industry
- personality
- target audience
- location
- brand
- market position
- business goals

Do not reuse the same visual style, layout skeleton, palette, type pairing
or signature animation across projects. Before designing, write a short
direction brief (concept, mood, palette, type, motion language, key
interactive moments) and check that it couldn't be swapped onto a different
client unchanged.

### Toolbox (use only when it genuinely improves the experience)

Cinematic storytelling · immersive scrolling · 3D / Three.js · custom shaders ·
GSAP + ScrollTrigger · Lenis · parallax · interactive objects · video · image
transitions · typography animation · micro-interactions · sophisticated hover
effects · layered depth · cinematic transitions.

Choose a few signature moments and execute them flawlessly rather than
spreading many effects thinly.

### Never

The site must never feel:

- generic
- template-based
- repetitive
- cheap
- over-designed
- randomly animated
- obviously AI-generated

Common AI-generated tells to avoid: centred hero + gradient blob + three
feature cards; default fonts; purple-blue gradients; glassmorphism by reflex;
every section fading up identically; emoji icons; filler copy; uniform
section rhythm.

### Research before direction

Before implementing a major design direction, research:

- premium sites in the client's industry and their competitors
- award-winning work (e.g. Awwwards, FWA, CSS Design Awards, Godly)
- relevant interaction patterns and visual references
- appropriate technologies and techniques for the ideas

Use research as **inspiration, never as something to copy**. Summarise what
was learned and how the direction differs from it.

### Never at the expense of quality

Every site must remain responsive, accessible, performant, optimised for
mobile (designed for touch, not just shrunk), respectful of
`prefers-reduced-motion`, and technically maintainable. The technical rules
below are the floor, not the goal.

## Stack (pinned in package.json; do not add to it casually)

- **Astro 7 + TypeScript 6 (strictest)**: static-first, JS only where needed.
- **GSAP 3.15**: import through `src/lib/motion/gsap.ts` (`setupGsap()`).
  Register SplitText / Flip / CustomEase at the call site: `setupGsap(SplitText)`.
- **Lenis**: smooth scroll via `initSmoothScroll()` (BaseLayout does this),
  synced to ScrollTrigger through `scroll-bus.ts`.
- **Three.js** with custom GLSL (`.glsl/.vert/.frag` imports via vite-plugin-glsl).
- **glTF Transform + KTX-Software** for 3D assets; **sharp** via `astro:assets`.
- **Playwright** (functional, a11y, visual), **axe-core**, **Lighthouse CI**.
- **ESLint** (strict TS + astro + jsx-a11y-x), **Prettier**, **Stylelint**.

Do not add React, Tailwind, Webflow, WordPress, UI component libraries or
templates unless a project genuinely requires them and the user agrees.

TypeScript is pinned to 6.0.x on purpose: TS 7 (native) isn't supported yet
by `@astrojs/check` or `typescript-eslint`.

## Non-negotiable rules

### Reduced motion

- CSS: use `--duration-*` / `--ease-*` tokens; they drop to 0 under reduced
  motion. `global.css` also enforces a hard floor.
- JS: check `prefersReducedMotion()` or use
  `gsap.matchMedia().add(MOTION_CONDITIONS, …)`, and provide a real reduced
  variant (static or opacity-only), not just "off".
- Both the OS preference and `<html data-motion="reduce">` (site toggle) count.
- Parallax, scroll-jacking, auto-playing video and continuous 3D rotation all
  stop under reduced motion.

### 3D

- Always use `<LazyScene scene="name" fallback={img} alt="…">` and
  `registerScene('name', () => import('./scene'))`. Never import `three` from
  a page's top-level script.
- A scene module exports `mount(ctx): dispose`. It must pause its render loop
  when `onVisibilityChange(false)`, render a single static frame when reduced
  motion is on, and dispose geometry, materials, textures and the renderer.
- The fallback image is the design for no-WebGL, Save-Data, errors and
  reduced-capability devices, so art-direct it; don't treat it as a placeholder.
- Models: `pnpm optimize:3d assets-src/x.glb` (Meshopt + KTX2). Load them with
  `createGLTFLoader()` from `src/lib/three/loaders.ts`.
- Cap DPR with `configureRenderer()`.

### Performance budgets (enforced by `pnpm lhci`)

- Lighthouse: performance ≥ 0.9, accessibility = 1, best practices ≥ 0.95, SEO ≥ 0.95.
- LCP ≤ 2.5 s, CLS ≤ 0.05, TBT ≤ 200 ms.
- Initial load: JS ≤ 170 KB, CSS ≤ 50 KB, fonts ≤ 150 KB (≤ 4 files),
  total ≤ 1.2 MB, no third-party requests. Lazy 3D chunks are excluded.
- Animate only `transform` and `opacity`; never `transition: all`.
- Images go through `<Image>` / `<Picture>` from `astro:assets`.

### Accessibility

- WCAG 2.2 AA minimum; axe must report zero violations.
- One `h1` per page, a working skip link, visible `:focus-visible`, and
  semantic landmarks. Text split by SplitText must keep an accessible label
  (`aria-label` on the parent, split children `aria-hidden`).
- Every interaction must work by keyboard; don't trap focus in custom scroll.

### Fonts

- Self-host licensed variable `.woff2` in `src/assets/fonts/`, declare in
  `src/styles/fonts.css`, subset them, and preload only above-the-fold faces.
- Avoid overused defaults (Inter, Poppins, Montserrat) unless the brand
  requires them.

## Commands

| Command                     | Purpose                                                       |
| --------------------------- | ------------------------------------------------------------- |
| `pnpm dev`                  | Dev server on :4321                                           |
| `pnpm build`                | Production build to `dist/`                                   |
| `pnpm check`                | Astro + TypeScript diagnostics                                |
| `pnpm lint` / `pnpm format` | ESLint + Stylelint / Prettier                                 |
| `pnpm test`                 | All Playwright projects (builds with the test harness)        |
| `pnpm test:a11y`            | axe checks, with motion both on and reduced                   |
| `pnpm test:visual`          | Screenshot comparison (desktop + mobile)                      |
| `pnpm test:visual:update`   | Re-baseline screenshots after an intended change (Linux only) |
| `pnpm lhci`                 | Build + Lighthouse CI budgets                                 |
| `pnpm verify`               | Everything above; run before every commit                     |

## Testing conventions

- Add every new page to `tests/routes.ts`; the a11y and visual suites pick
  it up automatically.
- Test-only pages live in `tests/harness/` and are injected only when
  `HARNESS=1` (build output goes to `dist-harness/`, never to `dist/`).
- Visual baselines are captured with reduced motion on, so pages must reach
  a stable final state when motion is reduced.
- Headless Chromium uses SwiftShader (software WebGL). Don't judge 3D
  performance here; test on real devices.

## Workflow

- No deploys without explicit instruction.
- Run `pnpm verify` before committing; fix failures instead of loosening
  budgets or rules. Loosening needs a stated reason.

## Definition of done

A project is not complete until all of these are true:

1. **Visual inspection.** Capture Playwright screenshots at desktop
   (1440×900) and mobile (390×844 or Pixel 7) sizes, with motion both on
   and reduced, including key scroll positions and interaction states.
   Actually look at them and judge them against the premium benchmark.
2. **Accessibility.** `pnpm test:a11y` passes with zero axe violations,
   and keyboard navigation has been checked.
3. **Performance.** `pnpm lhci` passes all budgets.
4. **Full gate.** `pnpm verify` passes.
5. **Premium check.** Honestly answer: does this look like a ₹7–10 lakh,
   human-designed, custom experience for _this_ client? Is every effect
   purposeful? Would it be mistaken for a template or AI output?

If the result falls short of the benchmark, improve it and repeat. Do not
declare it complete. When reporting, state what was checked and include the
screenshots or their paths.
