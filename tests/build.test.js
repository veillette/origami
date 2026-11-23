import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { models } from '../src/models.js';
import { buildSite } from '../tools/build.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const src = join(root, 'src');

async function temporaryOutput(t) {
  const out = await mkdtemp(join(tmpdir(), 'origami-build-'));
  t.after(() => rm(out, { recursive: true, force: true }));
  return out;
}

async function readIfPresent(path) {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

test('Pages artifact copies every source file and uses the deployed subpath without modifying source or dist', async (t) => {
  const out = await temporaryOutput(t);
  const index = join(src, 'index.html');
  const original = await readFile(index, 'utf8');
  const dist = join(root, 'dist', 'index.html');
  const distBefore = await readIfPresent(dist);

  await buildSite({ output: out, siteUrl: 'https://example.github.io/origami?preview=1#top' });

  const html = await readFile(join(out, 'index.html'), 'utf8');
  const worker = await readFile(join(out, 'sw.js'), 'utf8');
  const precached = JSON.parse(worker.match(/^const files = (\[.*\]);$/m)[1]);
  for (const asset of ['index.html', 'app.js', 'copy-link.js', 'styles.css', 'manifest.webmanifest', 'icons/icon-512.png']) {
    assert.ok(precached.includes(asset), asset + ' is available offline');
  }
  assert.match(worker, /const cacheName = .*[0-9a-f]{16}/);
  assert.ok(html.includes('href="manifest.webmanifest"'));
  assert.ok(html.includes('href="https://example.github.io/origami/"'));
  assert.ok(html.includes('content="https://example.github.io/origami/"'));
  assert.ok(html.includes('content="https://example.github.io/origami/og-image.png"'));
  assert.equal(await readFile(index, 'utf8'), original);
  assert.equal(await readIfPresent(dist), distBefore, 'the test build leaves dist/ alone');
  const entries = await readdir(src, { recursive: true, withFileTypes: true });
  for (const entry of entries.filter((entry) => entry.isFile())) {
    const outputPath = join(out, relative(src, entry.parentPath), entry.name);
    assert.ok((await stat(outputPath)).isFile(), outputPath);
  }
  const fonts = await readFile(join(out, 'fonts.css'), 'utf8');
  for (const [, url] of fonts.matchAll(/url\(([^)]+)\)/g)) {
    assert.ok((await stat(join(out, url))).isFile(), url);
  }
});

test('CSS covers model palettes, reduced motion and the minimum fixed font size', async () => {
  const css = await readFile(join(src, 'styles.css'), 'utf8');
  assert.match(css, /prefers-reduced-motion/);
  for (const color of new Set(models.map((model) => model.color))) {
    assert.match(css, new RegExp(`\\.${color}\\s+\\.card-art\\s*\\{`));
    assert.match(css, new RegExp(`\\.fold-diagram\\.${color}\\s*\\{`));
  }
  for (const [, px] of css.matchAll(/font-size:\s*([\d.]+)px/g)) {
    assert.ok(Number(px) >= 12, `font-size ${px}px is below the 12px floor`);
  }
});

test('the page has a home link, default canonical URL and a live region', async () => {
  const html = await readFile(join(src, 'index.html'), 'utf8');
  assert.match(html, /aria-label="Origami home"/);
  assert.match(html, /canonical" href="https:\/\/veillette\.github\.io\/origami\/"/);
  assert.match(html, /id="announcer"[^>]*aria-live="polite"/);
});

test('the build refuses outputs overlapping the source or Git metadata', async () => {
  for (const output of [root, src, join(src, 'out'), join(root, '.git'), join(root, '.git', 'out')]) {
    await assert.rejects(buildSite({ output }), /Refusing to build into/);
  }
  assert.ok((await stat(join(src, 'index.html'))).isFile());
});

test('invalid site metadata leaves the previous build intact', async (t) => {
  const output = await temporaryOutput(t);
  const index = join(output, 'index.html');
  await writeFile(index, 'previous build');
  await assert.rejects(buildSite({ output, siteUrl: 'file:///origami' }), /SITE_URL must use HTTP or HTTPS/);
  assert.equal(await readFile(index, 'utf8'), 'previous build');
});
