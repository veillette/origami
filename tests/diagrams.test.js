import {test} from 'node:test';
import assert from 'node:assert/strict';
import {models,modelById} from '../src/models.js';
import {MIN_AREA} from '../src/paper.js';
// Checks that each frame matches what its instruction says happens.
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const area=pts=>Math.abs(pts.reduce((s,p,i)=>{const q=pts[(i+1)%pts.length];return s+p[0]*q[1]-q[0]*p[1];},0))/2;
const inside=([x,y],P)=>{let c=false;for(let i=0,j=P.length-1;i<P.length;j=i++){const [xi,yi]=P[i],[xj,yj]=P[j];if((yi>y)!==(yj>y)&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)c=!c;}return c;};
const ends=d=>{const n=d.match(/-?\d+(\.\d+)?/g).map(Number);return [n.slice(0,2),n.slice(-2)];};
const near=(p,q,tol=0.5)=>Math.hypot(p[0]-q[0],p[1]-q[1])<=tol;

test('every action except finishing or precreasing changes the diagram',()=>{
 for(const m of models)m.steps.forEach((s,i)=>{
  if(s.action==='Finish'||s.action.startsWith('Crease'))return;
  assert.ok(!same(s.before,s.after),`${m.id} step ${i+1} (${s.title}) shows no change`);
 });
});
test('every fold step draws the line to fold along',()=>{
 for(const m of models)m.steps.forEach((s,i)=>{if(/^Fold/.test(s.action))assert.ok(s.folds.length,`${m.id} step ${i+1} (${s.title})`);});
});
test('computed folds leave no slivers, stay on the board and draw their crease across the paper',()=>{
 for(const m of models)m.steps.forEach((s,i)=>{
  const tag=`${m.id} step ${i+1} (${s.title})`;
  for(const p of s.after.filter(p=>p.points)){
   assert.ok(area(p.points)>=MIN_AREA,`${tag}: sliver panel`);
   assert.ok(p.points.flat().every(v=>v>=0&&v<=320),`${tag}: panel leaves the 320×320 board`);
  }
  const paper=s.before.filter(p=>p.points);
  if(!/^Fold/.test(s.action)||!paper.length)return;
  const [a,b]=ends(s.folds[0]),mid=[(a[0]+b[0])/2,(a[1]+b[1])/2];
  assert.ok(paper.some(p=>inside(mid,p.points)),`${tag}: dashed fold line is not on the paper`);
 });
});
test('each model cites its own reference',()=>{
 assert.equal(new Set(models.map(m=>m.source)).size,models.length);
});
test('regressions: helmet corners go down, dart edges meet the center, heart lobes fold one at a time',()=>{
 const helmet=modelById.get('samurai-helmet').steps;
 for(const i of [1,2])assert.ok(near(ends(helmet[i].arrows[0])[1],[160,280]),`helmet step ${i+1} lands on the bottom point`);
 const dart=modelById.get('dart').steps;
 for(const i of [3,4]){
  assert.ok(Math.abs(ends(dart[i].arrows[0])[1][0]-160)<0.5,`dart step ${i+1} edge lands on the center crease`);
  assert.ok(dart[i].after.filter(p=>p.points).every(p=>p.points.every(([,y])=>y<=300+1e-6)),`dart step ${i+1} stays inside the sheet`);
 }
 const heart=modelById.get('heart').steps;
 const moved=s=>{const before=new Set(s.before.map(p=>p.d));return s.after.filter(p=>p.points&&!before.has(p.d)).flatMap(p=>p.points);};
 assert.ok(moved(heart[9]).every(([x])=>x<=160+1e-6),'left tip fold leaves the right lobe alone');
 assert.ok(moved(heart[10]).every(([x])=>x>=160-1e-6),'right tip fold leaves the left lobe alone');
 for(const [id,i] of [['heart',4],['whale',2],['ice-cream',2],['hat',2],['boat',2]])
  assert.ok(modelById.get(id).steps[i].before.some(p=>p.kind==='crease'),`${id} step ${i+1} shows the crease its text refers to`);
});
