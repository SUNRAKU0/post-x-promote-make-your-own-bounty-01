// Post-x entry: copies POST.json beside this file to /output/POST.json.
// Node 22, standard library only, no network, deterministic.
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const botDir = process.env.MAKEFUN_BOT_DIR ?? '.';
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
const src = join(botDir, 'POST.json');

if (!existsSync(src)) {
  throw new Error('POST.json is missing next to main.ts; nothing to copy.');
}

let postUrl;
try {
  postUrl = JSON.parse(readFileSync(src, 'utf8')).url;
} catch {
  throw new Error('POST.json does not parse as JSON.');
}
if (typeof postUrl !== 'string' || postUrl.length === 0) {
  throw new Error('POST.json must hold a string url.');
}

mkdirSync(outDir, { recursive: true });
const dest = join(outDir, 'POST.json');
copyFileSync(src, dest);

const srcSize = statSync(src).size;
const destSize = statSync(dest).size;
if (destSize !== srcSize) {
  throw new Error(`POST.json write failed: wrote ${destSize} bytes, expected ${srcSize}.`);
}
