// Lists every file in a folder of client materials as a Markdown table:
// type, size, image dimensions and quality flags, and a short checksum (to
// spot duplicates). Used during client intake (see CLIENT-INTAKE.md).
//
//   pnpm intake:inventory <folder>            print to stdout
//   pnpm intake:inventory <folder> > out.md   save
//
// Images are measured with sharp. Video, audio and PDF details use ffprobe /
// pdfinfo only if already installed; the script never installs anything.
// Without them only size and type are reported, and the agent inspects the
// file another way (see CLIENT-INTAKE.md, "When an inspection tool is missing").
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readdir, readFile, stat } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import sharp from 'sharp';

const root = process.argv[2];
if (!root) {
  console.error('Usage: pnpm intake:inventory <folder>');
  process.exit(1);
}

const TYPES = {
  image: ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.tif', '.tiff', '.heic', '.bmp'],
  vector: ['.svg', '.ai', '.eps'],
  video: ['.mp4', '.mov', '.webm', '.m4v', '.avi', '.mkv'],
  audio: ['.mp3', '.wav', '.m4a', '.aac', '.ogg'],
  document: ['.pdf', '.doc', '.docx', '.txt', '.md', '.rtf', '.odt', '.pages'],
  spreadsheet: ['.csv', '.xls', '.xlsx', '.numbers'],
  presentation: ['.ppt', '.pptx', '.key'],
  font: ['.woff2', '.woff', '.ttf', '.otf'],
  model: ['.glb', '.gltf', '.fbx', '.obj', '.blend', '.usdz'],
  design: ['.fig', '.sketch', '.psd', '.xd', '.indd'],
  archive: ['.zip', '.rar', '.7z', '.tar', '.gz'],
};

const typeOf = (file) =>
  Object.entries(TYPES).find(([, exts]) => exts.includes(extname(file).toLowerCase()))?.[0] ??
  'other';

const formatSize = (bytes) =>
  bytes < 1024 ** 2 ? `${(bytes / 1024).toFixed(0)} KB` : `${(bytes / 1024 ** 2).toFixed(1)} MB`;

function tryCommand(command, args) {
  try {
    return execFileSync(command, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch {
    return null;
  }
}

async function describe(path, type, bytes) {
  const notes = [];
  if (bytes > 50 * 1024 ** 2) notes.push('>50 MB: keep out of git (see CLIENT-INTAKE.md)');

  if (type === 'image') {
    try {
      const { width = 0, height = 0, format, hasAlpha } = await sharp(path).metadata();
      notes.push(`${width}×${height} ${format ?? ''}${hasAlpha ? ' alpha' : ''}`.trim());
      const longEdge = Math.max(width, height);
      if (longEdge < 1200) notes.push('low-res: thumbnails/UI only');
      else if (longEdge < 2400) notes.push('medium-res: not full-bleed hero');
    } catch {
      notes.push('unreadable image');
    }
  } else if (type === 'video' || type === 'audio') {
    const probe = tryCommand('ffprobe', [
      '-v',
      'error',
      '-show_entries',
      'stream=codec_name,width,height:format=duration',
      '-of',
      'default=nw=1',
      path,
    ]);
    notes.push(
      probe ? probe.trim().split('\n').join(', ') : 'ffprobe unavailable: inspect directly',
    );
  } else if (extname(path).toLowerCase() === '.pdf') {
    const info = tryCommand('pdfinfo', [path]);
    const pages = info?.match(/^Pages:\s+(\d+)/m)?.[1];
    notes.push(pages ? `${pages} pages` : 'pdfinfo unavailable: read the PDF directly');
  }
  return notes.join('; ');
}

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = await Promise.all(
    entries
      .filter((entry) => !entry.name.startsWith('.'))
      .map((entry) => {
        const full = join(dir, entry.name);
        return entry.isDirectory() ? walk(full) : [full];
      }),
  );
  return files.flat().sort();
}

const files = await walk(root);
const rows = [];
const seen = new Map();

for (const path of files) {
  const { size } = await stat(path);
  const type = typeOf(path);
  const hash = createHash('sha256')
    .update(await readFile(path))
    .digest('hex')
    .slice(0, 10);
  const duplicateOf = seen.get(hash);
  seen.set(hash, seen.get(hash) ?? relative(root, path));
  const notes = await describe(path, type, size);
  rows.push(
    `| \`${relative(root, path)}\` | ${type} | ${formatSize(size)} | ${notes}${
      duplicateOf ? `; duplicate of \`${duplicateOf}\`` : ''
    } | ${hash} |`,
  );
}

console.log(`Inventory of \`${root}\`: ${files.length} files\n`);
console.log('| File | Type | Size | Details and flags | SHA-256 (short) |');
console.log('| --- | --- | --- | --- | --- |');
console.log(rows.join('\n'));
