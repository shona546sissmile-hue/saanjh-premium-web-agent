# saanjh-premium-web-agent

Toolchain for cinematic, premium, custom-designed websites: Astro, TypeScript,
GSAP, Lenis and Three.js, with accessibility, visual and performance gates.

## Getting started

Open in a Codespace/devcontainer (provisions Node, pnpm, Chromium and
KTX-Software automatically), or locally with Node 24.21 and pnpm 12:

```sh
pnpm install
pnpm exec playwright install --with-deps chromium
pnpm dev
```

Run `pnpm verify` before committing. See [CLAUDE.md](./CLAUDE.md) for the
design standard, rules and commands.
