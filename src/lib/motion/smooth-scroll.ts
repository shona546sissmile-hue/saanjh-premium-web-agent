import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { onReducedMotionChange, prefersReducedMotion } from './reduced-motion';
import { emitSmoothScroll } from './scroll-bus';

let lenis: Lenis | null = null;

function start(): void {
  if (lenis) return;
  lenis = new Lenis({ autoRaf: true, anchors: true });
  lenis.on('scroll', emitSmoothScroll);
}

function stop(): void {
  lenis?.destroy();
  lenis = null;
}

/**
 * Lenis smooth scrolling. ScrollTrigger subscribes via the scroll bus when
 * GSAP is set up (see gsap.ts). Never runs under reduced motion; native
 * scrolling is used instead, and it switches live if the preference changes.
 */
export function initSmoothScroll(): () => void {
  if (!prefersReducedMotion()) start();
  const unsubscribe = onReducedMotionChange((reduced) => (reduced ? stop() : start()));
  return () => {
    unsubscribe();
    stop();
  };
}

export function getLenis(): Lenis | null {
  return lenis;
}
