import { cp, mkdir, rm, access, readFile, writeFile } from "node:fs/promises";
const source = new URL("../src/", import.meta.url);
const output = new URL("../dist/", import.meta.url);
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
    .replace(/(<meta property="og:url" content=")[^"]*(">)/, (_, before, after) => before + url.href + after);
  await writeFile(index, html);
}
console.log("Built static site in dist/");
