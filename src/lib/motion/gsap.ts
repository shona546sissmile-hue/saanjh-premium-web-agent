import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onSmoothScroll } from './scroll-bus';

let registered = false;

/**
 * Register GSAP core + ScrollTrigger once, synced to Lenis. Import GSAP from
 * here rather than 'gsap' so defaults and scroll sync stay consistent.
 *
 * SplitText, Flip and CustomEase are registered where they're used, so pages
 * only download the plugins they need:
 *
 *   import { SplitText } from 'gsap/SplitText';
 *   const { gsap } = setupGsap(SplitText);
 */
export function setupGsap(...plugins: object[]) {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power3.out', duration: 0.9 });
    ScrollTrigger.config({ ignoreMobileResize: true });
    onSmoothScroll(ScrollTrigger.update);
    registered = true;
  }
  if (plugins.length > 0) gsap.registerPlugin(...plugins);
  return { gsap, ScrollTrigger };
}

/**
 * Conditions for gsap.matchMedia(). Build full motion under `motion` and a
 * static or opacity-only equivalent under `reduce`; GSAP reverts automatically
 * when the preference changes.
 *
 * @example
 * const mm = gsap.matchMedia();
 * mm.add(MOTION_CONDITIONS, (ctx) => {
 *   const { motion } = ctx.conditions as MotionConditions;
 *   ...
 * });
 */
export const MOTION_CONDITIONS = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
} as const;

export type MotionConditions = Record<keyof typeof MOTION_CONDITIONS, boolean>;
