// Optimise glTF/GLB models for the web.
//
//   pnpm optimize:3d <input.glb> [output.glb] [--draco] [--texture=ktx2|webp|avif]
//
// Defaults: Meshopt geometry compression + KTX2 (Basis) textures, 2048px max.
// KTX2 needs the `ktx` binary from KTX-Software (installed by the devcontainer).
// Raw sources belong in assets-src/; commit outputs to src/assets/models/.
import { execFileSync } from 'node:child_process';
import { statSync } from 'node:fs';
import { basename, extname, join } from 'node:path';

const args = process.argv.slice(2);
const positional = args.filter((arg) => !arg.startsWith('--'));
const flag = (name) => args.find((arg) => arg.startsWith(`--${name}`));

const [input, outputArg] = positional;
if (!input) {
  console.error(
    'Usage: pnpm optimize:3d <input.glb> [output.glb] [--draco] [--texture=ktx2|webp|avif]',
  );
  process.exit(1);
}

const output = outputArg ?? join('src/assets/models', `${basename(input, extname(input))}.glb`);
const compress = flag('draco') ? 'draco' : 'meshopt';
const texture = flag('texture')?.split('=')[1] ?? 'ktx2';

if (texture === 'ktx2') {
  try {
    execFileSync('ktx', ['--version'], { stdio: 'ignore' });
  } catch {
    console.error(
      'KTX2 requires the `ktx` CLI (KTX-Software). Rebuild the devcontainer or use --texture=webp.',
    );
    process.exit(1);
  }
}

execFileSync(
  'gltf-transform',
  [
    'optimize',
    input,
    output,
    '--compress',
    compress,
    '--texture-compress',
    texture,
    '--texture-size',
    '2048',
  ],
  { stdio: 'inherit' },
);

const kb = (file) => `${(statSync(file).size / 1024).toFixed(1)} KB`;
console.log(`\n${input} (${kb(input)}) → ${output} (${kb(output)})`);
