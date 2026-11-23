import { createHash } from 'node:crypto';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

export async function writeServiceWorker(output) {
  const template = await readFile(new URL('./sw.js', import.meta.url), 'utf8');
  const files = (await readdir(output, { recursive: true, withFileTypes: true }))
    .filter((entry) => entry.isFile())
    .map(({ name, parentPath }) => relative(output, join(parentPath, name)).split(sep).join('/'))
    .sort();

  const hash = createHash('sha256').update(template);
  const urls = [];
  for (const file of files) {
    const data = await readFile(join(output, file));
    hash.update(JSON.stringify([file, data.length])).update(data);
    urls.push(file.split('/').map(encodeURIComponent).join('/'));
  }

  await writeFile(join(output, 'sw.js'), template
    .replace('/* BUILD_FILES */ []', JSON.stringify(urls))
    .replace('__BUILD_VERSION__', hash.digest('hex').slice(0, 16)));
}
