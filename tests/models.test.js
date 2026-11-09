import {test} from 'node:test';
import assert from 'node:assert/strict';
import {models,modelById} from '../src/models.js';
import {diagram} from '../src/art.js';
import {readProgress,modelFromHash,moveStep} from '../src/state.js';

test('all 26 models have sourced complete sequences with continuous before/after states',()=>{
 assert.equal(models.length,26);assert.equal(modelById.size,models.length);
 for(const model of models){
  assert.match(model.id,/^[a-z-]+$/);assert.ok(model.name&&model.intro&&model.paper);assert.match(model.source,/^https:\/\//);
  assert.ok(model.steps.length>=5);assert.equal(model.steps.at(-1).action==='Finish'||model.steps.at(-1).action==='Open',true);
  let before=model.start;
  for(const step of model.steps){
   assert.equal(step.before,before,'each action begins with the last action’s result');
   assert.ok(step.title&&step.text&&step.action);assert.ok(step.before.length&&step.after.length);
   for(const path of [...step.before,...step.after]){assert.match(path.d,/^M /);assert.doesNotMatch(path.d,/undefined|NaN|Infinity/);assert.ok(['front','light','dark','back','crease','decoration','ink'].includes(path.kind));}
   for(const path of [...step.folds,...step.arrows])assert.match(path,/^M /);
   before=step.after;
  }
 }
});
test('progress survives malformed, blocked and obsolete storage and clamps steps',()=>{
 const read=value=>readProgress({getItem:()=>value});
 for(const value of [null,'null','{','[]','42','"boat"'])assert.deepEqual(read(value),{});
 assert.deepEqual(readProgress({getItem(){throw Error('blocked');}}),{});
 assert.deepEqual(read('{"puppy":{"step":999,"completed":true},"boat":{"step":-1,"completed":"true"},"gone":{"step":3}}'),{puppy:{step:modelById.get('puppy').steps.length-1,completed:true},boat:{step:0,completed:false}});
 assert.equal(read('{"cup":{"step":2.2}}').cup.step,0);
});
test('all lesson URLs resolve and navigation stops at both ends',()=>{
 for(const model of models){assert.equal(modelFromHash(`#/${model.id}`),model);assert.equal(moveStep(model,0,-1),0);assert.equal(moveStep(model,model.steps.length-1,1),model.steps.length-1);assert.equal(moveStep(model,0,1),1);}
 for(const hash of ['','#guide','#models','#/missing'])assert.equal(modelFromHash(hash),null);
});
test('every step renders correct before/after layers and previews do not add fold arrows',t=>{
 const prior=globalThis.document;
 globalThis.document={createElementNS(ns,tag){return{tag,attrs:{},children:[],setAttribute(k,v){this.attrs[k]=v;},append(n){this.children.push(n);}};}};
 t.after(()=>{if(prior)globalThis.document=prior;else delete globalThis.document;});
 const ids=new Set();
 for(const model of models){for(let step=0;step<model.steps.length;step++){
  const current=model.steps[step];
  for(const view of ['guide','result','finished']){
   const svg=diagram(model,{step,view});assert.equal(svg.attrs.role,'img');assert.ok(svg.attrs['aria-label'].includes(model.name));
   const paper=svg.children.filter(n=>n.attrs.class?.startsWith('paper '));
   const expected=view==='guide'?current.before:view==='result'?current.after:model.steps.at(-1).after;
   assert.deepEqual(paper.map(p=>p.attrs.d),expected.map(p=>p.d));
   assert.equal(svg.children.filter(n=>n.attrs.class==='fold-arrow').length,view==='guide'?current.arrows.length:0);
   for(const defs of svg.children.filter(n=>n.tag==='defs'))for(const marker of defs.children){assert.ok(!ids.has(marker.attrs.id));ids.add(marker.attrs.id);}
  }
 }}
});
