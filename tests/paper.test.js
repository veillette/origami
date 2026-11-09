import {test} from 'node:test';
import assert from 'node:assert/strict';
import {panel,crease,fold,turn,rotate} from '../src/paper.js';
import {extraModels} from '../src/more-models.js';
const area=p=>Math.abs(p.points.reduce((a,v,i)=>{const n=p.points[(i+1)%p.points.length];return a+v[0]*n[1]-n[0]*v[1];},0))/2;
test('flat folds preserve paper area and reflect the moving half onto the fixed half',()=>{
 const sheet=[panel([[0,0],[100,0],[100,100],[0,100]],'back')];
 const result=fold(sheet,[50,0],[50,100],[0,50]);
 assert.equal(result.reduce((s,p)=>s+area(p),0),10000);
 assert.ok(result.every(p=>p.points.every(([x,y])=>x>=50&&x<=100&&y>=0&&y<=100)));
 assert.equal(result.at(-1).kind,'front');
 assert.equal(fold(sheet,[50,0],[50,100],[0,50],true)[0].kind,'front');
 assert.throws(()=>fold(sheet,[50,0],[50,100],[50,50]));
});
test('turning over twice restores the paper and its layer order',()=>{
 const sheet=[panel([[60,60],[260,60],[260,260],[60,260]],'back')];
 assert.deepEqual(turn(turn(sheet)),sheet);
 const creased=[...sheet,crease([60,60],[260,260])];
 assert.deepEqual(turn(turn(creased)),creased);
 assert.deepEqual(turn(creased).at(-1).line,[[260,60],[60,260]]);
 assert.deepEqual(rotate(creased).at(-1).line,[[260,60],[60,260]]);
});
test('folds keep existing creases: the fixed part stays, the moving part is reflected, a crease on the fold line merges into the edge',()=>{
 const sheet=[panel([[0,0],[100,0],[100,100],[0,100]],'back'),crease([50,0],[50,100]),crease([0,0],[100,100])];
 const result=fold(sheet,[0,50],[100,50],[50,0]);
 const lines=result.filter(p=>p.line).map(p=>p.line.map(q=>q.map(v=>Math.round(v))));
 // Top halves of both creases fold down: (50,0)-(50,50) onto (50,100)-(50,50), (0,0)-(50,50) onto (0,100)-(50,50).
 assert.deepEqual(lines,[[[50,50],[50,100]],[[50,50],[100,100]],[[50,100],[50,50]],[[0,100],[50,50]]]);
 assert.ok(result.findIndex(p=>p.line)>result.findIndex(p=>p.points),'creases are drawn on top of their layer');
 assert.equal(fold([...sheet],[50,0],[50,100],[0,50]).filter(p=>p.line).some(p=>p.line.every(([x])=>Math.abs(x-50)<1e-6)),false);
});
test('a fold limited to some layers leaves the others in place and in order',()=>{
 const left=panel([[0,0],[50,0],[50,100],[0,100]]),right=panel([[50,0],[100,0],[100,100],[50,100]],'back');
 const result=fold([left,right],[0,20],[100,20],[25,0],false,p=>p===left);
 assert.equal(result[1],right,'the unselected layer is untouched');
 assert.equal(result.length,3);
});
test('twenty additions have distinct IDs, complete view states and finite panel coordinates',()=>{
 assert.equal(extraModels.length,20);
 assert.equal(new Set(extraModels.map(m=>m.id)).size,20);
 assert.equal(new Set(extraModels.map(m=>JSON.stringify(m.steps.at(-1).after))).size,20);
 for(const model of extraModels){
  for(const step of model.steps){
   assert.ok(step.after.length);
   for(const p of step.after.filter(p=>p.points)){
    assert.ok(area(p)>0.01);
    assert.ok(p.points.every(pair=>pair.every(Number.isFinite)));
   }
   if(step.action==='Fold'&&step.after.some(p=>p.points))assert.ok(step.folds.length);
  }
 }
});
