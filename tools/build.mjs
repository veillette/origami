import { cp, mkdir, rm, access, readFile, writeFile } from "node:fs/promises";
import { resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
// Usage: node tools/build.mjs [output-dir]   (default: dist/)
const root = fileURLToPath(new URL("../", import.meta.url));
const sourceDir = resolve(root, "src");
const outputDir = process.argv[2] ? resolve(process.argv[2]) : resolve(root, "dist");
// The output is deleted first, so it must never contain the source or the repository.
const inside = (dir, parent) => { const r = relative(parent, dir); return r === "" || (!r.startsWith("..") && !isAbsolute(r)); };
if (inside(sourceDir, outputDir) || inside(outputDir, sourceDir)) throw new Error(`Refusing to build into ${outputDir}`);
const source = pathToFileURL(sourceDir + "/");
const output = pathToFileURL(outputDir + "/");
await access(new URL("index.html", source));
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await cp(source, output, { recursive: true });
// Hosting can supply its own canonical origin and deployment subdirectory.
if (process.env.SITE_URL) {
  const url = new URL(process.env.SITE_URL);
  if (!["https:", "http:"].includes(url.protocol)) throw new Error("SITE_URL must use HTTP or HTTPS");
  url.search = "";
  url.hash = "";
  if (!url.pathname.endsWith("/")) url.pathname += "/";
  const index = new URL("index.html", output);
  const html = (await readFile(index, "utf8"))
    .replace(/(<link rel="canonical" href=")[^"]*(">)/, (_, before, after) => before + url.href + after)
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, (_, before, after) => before + url.href + after)
    .replace(/(<meta property="og:image" content=")[^"]*(">)/, (_, before, after) => before + new URL("og-image.png", url).href + after);
  await writeFile(index, html);
}
console.log(`Built static site in ${relative(process.cwd(), outputDir) || "."}/`);
