# Saanjh premium web agent

Toolchain for building cinematic, premium, custom-designed websites. Every
site built here must feel art-directed and bespoke: immersive, highly
interactive, 3D where it earns its place. It must never look generic,
templated or obviously AI-generated, and it must stay fast and accessible.

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
