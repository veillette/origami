import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';
import { isAbsolute, relative, resolve, sep } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const sourceDir = resolve(root, 'src');

function contains(parent, child) {
  const path = relative(parent, child);
  return path !== '..' && !path.startsWith(`..${sep}`) && !isAbsolute(path);
}

function rewriteMetadata(html, siteUrl) {
  const url = new URL(siteUrl);
  if (!['https:', 'http:'].includes(url.protocol)) throw new Error('SITE_URL must use HTTP or HTTPS');
  url.search = '';
  url.hash = '';
  if (!url.pathname.endsWith('/')) url.pathname += '/';

  return html
    .replace(/(<link rel="canonical" href=")[^"]*(">)/, (_, before, after) => before + url.href + after)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, (_, before, after) => before + url.href + after)
    .replace(
      /(<meta property="og:image" content=")[^"]*(">)/,
      (_, before, after) => before + new URL('og-image.png', url).href + after,
    );
}

export async function buildSite({ output = resolve(root, 'dist'), siteUrl } = {}) {
  const outputDir = resolve(output);
  // The output is replaced, so it must never overlap the source or Git metadata.
  const gitDir = resolve(root, '.git');
  if ([sourceDir, gitDir].some((dir) => contains(outputDir, dir) || contains(dir, outputDir))) {
    throw new Error(`Refusing to build into ${outputDir}`);
  }

  const html = await readFile(resolve(sourceDir, 'index.html'), 'utf8');
  const rewritten = siteUrl ? rewriteMetadata(html, siteUrl) : html;
  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });
  await cp(sourceDir, outputDir, { recursive: true });
  if (siteUrl) await writeFile(resolve(outputDir, 'index.html'), rewritten);
  return outputDir;
}

// Usage: node tools/build.mjs [output-dir]
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const outputDir = await buildSite({ output: process.argv[2], siteUrl: process.env.SITE_URL });
  console.log(`Built static site in ${relative(process.cwd(), outputDir) || '.'}/`);
}
