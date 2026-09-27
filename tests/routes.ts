/** Every public page. Add routes here as they are built; a11y and visual suites cover them all. */
export const pages = [{ name: 'home', path: '/' }] as const;

/** Test-only routes, injected when HARNESS=1. */
export const harness = { lazyScene: '/__harness/lazy-scene' } as const;
