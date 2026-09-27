/**
 * Decouples smooth scrolling from GSAP so pages without scroll-driven
 * animation don't download GSAP just to run Lenis.
 */
type ScrollListener = () => void;

const listeners = new Set<ScrollListener>();

export function onSmoothScroll(listener: ScrollListener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function emitSmoothScroll(): void {
  listeners.forEach((listener) => listener());
}
