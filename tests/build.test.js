import {test} from 'node:test';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,existsSync,readdirSync,mkdtempSync,rmSync,statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const src=join(root,'src');
test('Pages artifact contains every source file and uses the deployed subpath without modifying source or dist/',t=>{
 const out=mkdtempSync(join(tmpdir(),'origami-build-'));
 t.after(()=>rmSync(out,{recursive:true,force:true}));
 const original=readFileSync(join(src,'index.html'),'utf8');
 const dist=join(root,'dist','index.html');const distBefore=existsSync(dist)?readFileSync(dist,'utf8'):null;
 execFileSync(process.execPath,['tools/build.mjs',out],{cwd:root,env:{...process.env,SITE_URL:'https://example.github.io/origami/'}});
 const html=readFileSync(join(out,'index.html'),'utf8');
 assert.ok(html.includes('href="https://example.github.io/origami/"'));assert.ok(html.includes('content="https://example.github.io/origami/"'));
 assert.ok(html.includes('content="https://example.github.io/origami/og-image.png"'));
 assert.equal(readFileSync(join(src,'index.html'),'utf8'),original);
 assert.equal(existsSync(dist)?readFileSync(dist,'utf8'):null,distBefore,'the test build leaves dist/ alone');
 for(const file of readdirSync(src,{recursive:true}))if(statSync(join(src,file)).isFile())assert.ok(existsSync(join(out,file)),file);
 for(const url of readFileSync(join(out,'fonts.css'),'utf8').matchAll(/url\(([^)]+)\)/g))assert.ok(existsSync(join(out,url[1])),url[1]);
 const css=readFileSync(join(src,'styles.css'),'utf8');
 assert.match(css,/prefers-reduced-motion/);
 for(const color of ['peach','sage','lilac','butter','blue','pink']){
  assert.match(css,new RegExp(`\\.${color} \\.card-art\\{`));
  assert.match(css,new RegExp(`\\.fold-diagram\\.${color}\\{`));
 }
 for(const [,px] of css.matchAll(/font-size:(\d+)px/g))assert.ok(Number(px)>=12,`font-size ${px}px is below the 12px floor`);
 assert.match(original,/aria-label="Origami home"/);
 assert.match(original,/canonical" href="https:\/\/veillette\.github\.io\/origami\/"/);
 assert.match(original,/id="announcer"[^>]*aria-live="polite"/);
});
test('the build refuses an output directory that would delete the source',()=>{
 for(const out of [root,src])assert.throws(()=>execFileSync(process.execPath,['tools/build.mjs',out],{cwd:root,stdio:'pipe'}));
 assert.ok(existsSync(join(src,'index.html')));
});
