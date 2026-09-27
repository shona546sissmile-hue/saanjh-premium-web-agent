import type { WebGLRenderer } from 'three';

/**
 * Sensible renderer defaults for performance. Caps device pixel ratio so
 * high-DPI phones don't render 3–4x the pixels for little visible gain.
 */
export const MAX_PIXEL_RATIO = 2;

export function configureRenderer(renderer: WebGLRenderer): void {
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
}

/** Resize a renderer (and caller's camera) to its canvas's CSS size. */
export function observeCanvasSize(
  canvas: HTMLCanvasElement,
  onResize: (width: number, height: number) => void,
): () => void {
  const observer = new ResizeObserver(([entry]) => {
    if (!entry) return;
    const { width, height } = entry.contentRect;
    if (width > 0 && height > 0) onResize(width, height);
  });
  observer.observe(canvas);
  return () => observer.disconnect();
}
