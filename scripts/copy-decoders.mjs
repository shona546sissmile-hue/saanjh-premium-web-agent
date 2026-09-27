// Copies Draco and Basis (KTX2) decoders from the pinned three package into
// public/decoders so they version-match the loaders. Runs before dev/build.
import { cp, mkdir } from 'node:fs/promises';
import { findPackageJSON } from 'node:module';
import { dirname, join } from 'node:path';

const threeRoot = dirname(findPackageJSON('three', import.meta.url));
const libs = join(threeRoot, 'examples/jsm/libs');
const out = new URL('../public/decoders/', import.meta.url);

await mkdir(out, { recursive: true });
await cp(join(libs, 'draco/gltf'), new URL('draco/', out), { recursive: true });
await cp(join(libs, 'basis'), new URL('basis/', out), {
  recursive: true,
  filter: (src) => !src.endsWith('.md'),
});
