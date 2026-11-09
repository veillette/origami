import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync} from 'node:fs';
const root=new URL('../',import.meta.url);
test('Pages artifact contains all assets and uses the deployed subpath without modifying source',()=>{
 const original=readFileSync(new URL('src/index.html',root),'utf8');
 execFileSync(process.execPath,['tools/build.mjs'],{cwd:root,env:{...process.env,SITE_URL:'https://example.github.io/origami/'}});
 const html=readFileSync(new URL('dist/index.html',root),'utf8');
 assert.ok(html.includes('href="https://example.github.io/origami/"'));assert.ok(html.includes('content="https://example.github.io/origami/"'));
 assert.equal(readFileSync(new URL('src/index.html',root),'utf8'),original);
 for(const asset of ['app.js','models.js','art.js','state.js','swipe.js','styles.css','fonts.css','icon.svg'])assert.ok(existsSync(new URL(`dist/${asset}`,root)));
 for(const url of readFileSync(new URL('dist/fonts.css',root),'utf8').matchAll(/url\(([^)]+)\)/g))assert.ok(existsSync(new URL(`dist/${url[1]}`,root)));
 const css=readFileSync(new URL('src/styles.css',root),'utf8');
 assert.match(css,/prefers-reduced-motion/);
 for(const color of ['peach','sage','lilac','butter','blue','pink']){
  assert.match(css,new RegExp(`\\.${color} \\.card-art\\{`));
  assert.match(css,new RegExp(`\\.fold-diagram\\.${color}\\{`));
 }
 assert.match(original,/aria-label="Origami home"/);
 assert.match(original,/canonical" href="https:\/\/veillette\.github\.io\/origami\/"/);
});
