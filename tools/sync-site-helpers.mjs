import { readFile, writeFile } from 'node:fs/promises';

// The sites keep local copies so a checkout or deployment never depends on another repo.
const checkouts = new URL('../../', import.meta.url);
const sharedFiles = [
  ['origami/.github/workflows/site-ci.yml', [
    'A-Table/.github/workflows/site-ci.yml',
    'aperitif/.github/workflows/site-ci.yml',
    'livres/.github/workflows/site-ci.yml',
    'chansons/.github/workflows/site-ci.yml',
    'field-and-verge/.github/workflows/site-ci.yml',
    'sketchbook/.github/workflows/site-ci.yml',
    'ukulele-first-strum/.github/workflows/site-ci.yml',
  ]],
  ['origami/.github/site-smoke.mjs', [
    'A-Table/.github/site-smoke.mjs',
    'aperitif/.github/site-smoke.mjs',
    'livres/.github/site-smoke.mjs',
    'chansons/.github/site-smoke.mjs',
    'field-and-verge/.github/site-smoke.mjs',
    'sketchbook/.github/site-smoke.mjs',
    'ukulele-first-strum/.github/site-smoke.mjs',
  ]],
  ['origami/src/copy-link.js', [
    'A-Table/dist/copy-link.js',
    'aperitif/js/copy-link.js',
    'field-and-verge/dist/copy-link.js',
    'sketchbook/src/copy-link.js',
    'ukulele-first-strum/site/copy-link.js',
  ]],
  ['livres/js/copier-lien.js', ['chansons/js/copier-lien.js']],
  ['origami/src/pwa.js', ['field-and-verge/dist/pwa.js', 'sketchbook/src/pwa.js']],
  ['origami/tools/sw.js', ['field-and-verge/scripts/sw.js', 'sketchbook/tools/sw.js']],
  ['origami/tools/build-worker.mjs', [
    'field-and-verge/scripts/build-worker.js',
    'sketchbook/tools/build-worker.mjs',
    'ukulele-first-strum/scripts/build-worker.js',
  ]],
];

const args = process.argv.slice(2);
if (args.length > 1 || (args.length === 1 && args[0] !== '--write')) {
  throw new Error('Usage: node tools/sync-site-helpers.mjs [--write]');
}

const copies = await Promise.all(sharedFiles.flatMap(([source, targets]) =>
  targets.map(async (target) => {
    const url = new URL(target, checkouts);
    const [canonical, current] = await Promise.all([
      readFile(new URL(source, checkouts)),
      readFile(url),
    ]);
    return { target, url, canonical, current };
  }),
));

const changes = copies.filter(({ canonical, current }) => !canonical.equals(current));
if (args[0] === '--write') {
  for (const { target, url, canonical } of changes) {
    await writeFile(url, canonical);
    console.log('Updated', target);
  }
} else {
  for (const { target } of changes) console.error('Out of sync:', target);
  process.exitCode = Number(changes.length > 0);
}

if (!changes.length) console.log('Shared site helpers match.');
