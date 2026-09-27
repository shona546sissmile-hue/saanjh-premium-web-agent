/**
 * Single source of truth for motion preference.
 *
 * Motion is reduced when either the OS requests it (prefers-reduced-motion) or
 * the site-level override is set (<html data-motion="reduce">), e.g. from an
 * in-page "reduce motion" toggle. Every animation, smooth-scroll and 3D module
 * must consult this before running.
 */
const QUERY = '(prefers-reduced-motion: reduce)';

type Listener = (reduced: boolean) => void;

function mediaQuery(): MediaQueryList | null {
  return typeof window === 'undefined' ? null : window.matchMedia(QUERY);
}

export function prefersReducedMotion(): boolean {
  if (typeof document === 'undefined') return false;
  if (document.documentElement.dataset['motion'] === 'reduce') return true;
  return mediaQuery()?.matches ?? false;
}

/** Subscribe to changes in either source. Returns an unsubscribe function. */
export function onReducedMotionChange(listener: Listener): () => void {
  const mq = mediaQuery();
  if (!mq) return () => undefined;

  const notify = () => listener(prefersReducedMotion());
  mq.addEventListener('change', notify);
  const observer = new MutationObserver(notify);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-motion'],
  });

  return () => {
    mq.removeEventListener('change', notify);
    observer.disconnect();
  };
}

/** Set or clear the site-level override (persist it yourself if needed). */
export function setMotionOverride(reduce: boolean): void {
  if (reduce) document.documentElement.dataset['motion'] = 'reduce';
  else delete document.documentElement.dataset['motion'];
}
