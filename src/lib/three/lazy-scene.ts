import { onReducedMotionChange, prefersReducedMotion } from '@/lib/motion/reduced-motion';

/**
 * Lazy 3D scenes with a static fallback.
 *
 * The fallback image (rendered by <LazyScene>) is always in the HTML and is
 * what users see until the scene is ready, and permanently when:
 *   - WebGL is unavailable,
 *   - the user has Save-Data enabled,
 *   - the scene module fails to load or throws.
 * Three.js and the scene code are only fetched once the element approaches
 * the viewport.
 *
 * Root element states (data-scene-state):
 *   idle → loading → ready | fallback
 */

export interface SceneContext {
  canvas: HTMLCanvasElement;
  root: HTMLElement;
  /** Current motion preference. Render a static frame when true. */
  reducedMotion: boolean;
  /** Called when motion preference changes. */
  onReducedMotionChange(listener: (reduced: boolean) => void): void;
  /** Called when the scene scrolls in or out of view; pause rendering when hidden. */
  onVisibilityChange(listener: (visible: boolean) => void): void;
}

export type SceneDisposer = () => void;

export interface SceneModule {
  mount(context: SceneContext): SceneDisposer | Promise<SceneDisposer>;
}

export type SceneLoader = () => Promise<SceneModule>;

export type SceneState = 'idle' | 'loading' | 'ready' | 'fallback';

const registry = new Map<string, SceneLoader>();

/** Register a scene by name. Pass a dynamic import so it stays code-split. */
export function registerScene(name: string, loader: SceneLoader): void {
  registry.set(name, loader);
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') ?? canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

interface NetworkInformationLike {
  saveData?: boolean;
}

function prefersSaveData(): boolean {
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  return connection?.saveData === true;
}

function setState(root: HTMLElement, state: SceneState, reason?: string): void {
  root.dataset['sceneState'] = state;
  if (reason) root.dataset['sceneFallbackReason'] = reason;
}

async function mountScene(
  root: HTMLElement,
  visible: () => boolean,
): Promise<SceneDisposer | null> {
  const name = root.dataset['lazyScene'] ?? '';
  const loader = registry.get(name);
  const canvas = root.querySelector<HTMLCanvasElement>('canvas');

  if (!loader || !canvas) {
    setState(root, 'fallback', loader ? 'no-canvas' : 'unregistered');
    return null;
  }

  setState(root, 'loading');
  const motionListeners = new Set<(reduced: boolean) => void>();
  const visibilityListeners = new Set<(visible: boolean) => void>();
  const onVisibility = (event: Event) => {
    const isVisible = (event as CustomEvent<boolean>).detail;
    visibilityListeners.forEach((listener) => listener(isVisible));
  };
  root.addEventListener('scene:visibility', onVisibility);
  const unsubscribeMotion = onReducedMotionChange((reduced) => {
    root.dataset['reducedMotion'] = String(reduced);
    motionListeners.forEach((listener) => listener(reduced));
  });

  try {
    const module = await loader();
    const reducedMotion = prefersReducedMotion();
    root.dataset['reducedMotion'] = String(reducedMotion);
    const dispose = await module.mount({
      canvas,
      root,
      reducedMotion,
      onReducedMotionChange: (listener) => motionListeners.add(listener),
      onVisibilityChange: (listener) => {
        visibilityListeners.add(listener);
        listener(visible());
      },
    });
    setState(root, 'ready');
    return () => {
      root.removeEventListener('scene:visibility', onVisibility);
      unsubscribeMotion();
      dispose();
    };
  } catch (error) {
    root.removeEventListener('scene:visibility', onVisibility);
    unsubscribeMotion();
    console.error(`[lazy-scene] "${name}" failed to mount`, error);
    setState(root, 'fallback', 'error');
    return null;
  }
}

/**
 * Find every [data-lazy-scene] element and mount it when it nears the
 * viewport. Safe to call more than once; each element is only handled once.
 */
export function mountLazyScenes(scope: ParentNode = document): void {
  const roots = scope.querySelectorAll<HTMLElement>('[data-lazy-scene]:not([data-scene-state])');
  if (roots.length === 0) return;

  const unavailable = !supportsWebGL() ? 'no-webgl' : prefersSaveData() ? 'save-data' : null;

  roots.forEach((root) => {
    if (unavailable) {
      setState(root, 'fallback', unavailable);
      return;
    }
    setState(root, 'idle');

    let isVisible = false;
    let started = false;
    const rootMargin = root.dataset['rootMargin'] ?? '50% 0px';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting !== isVisible) {
          isVisible = entry.isIntersecting;
          root.dispatchEvent(new CustomEvent('scene:visibility', { detail: isVisible }));
        }
        if (isVisible && !started) {
          started = true;
          void mountScene(root, () => isVisible);
        }
      },
      { rootMargin },
    );
    observer.observe(root);
  });
}
