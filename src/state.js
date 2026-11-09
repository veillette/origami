import {models,modelById} from './models.js';
const KEY='origami.progress.v1';
export function readProgress(storage){
 try{
  const data=JSON.parse(storage.getItem(KEY));const valid={};
  if(!data||typeof data!=='object'||Array.isArray(data))return valid;
  for(const model of models){const saved=data[model.id];if(!saved||typeof saved!=='object')continue;
   valid[model.id]={step:Number.isInteger(saved.step)?Math.max(0,Math.min(model.steps.length-1,saved.step)):0,completed:saved.completed===true};
  }return valid;
 }catch{return {};}
}
export function loadProgress(){try{return readProgress(localStorage);}catch{return {};}}
export function saveProgress(progress){try{localStorage.setItem(KEY,JSON.stringify(progress));}catch{/* folding works without storage */}}
export function modelFromHash(hash){return modelById.get(hash.replace(/^#\/?/,''))??null;}
export function moveStep(model,step,direction){return Math.max(0,Math.min(model.steps.length-1,step+direction));}
export function pageFromHash(hash){
 const model=modelFromHash(hash);
 if(model)return{page:'lesson',model};
 if(hash==='#guide')return{page:'guide'};
 return{page:'gallery',scrollModels:hash==='#models'};
}
export function afterNextStep(step,stepCount){
 if(step>=stepCount-1)return{step,completed:true,celebrate:true,view:'finished'};
 return{step:Math.min(stepCount-1,step+1),completed:false,celebrate:false,view:'guide'};
}
export function afterJumpStep(step){return{step,celebrate:false,view:'guide'};}
export function toggleFinishedPeek(view){return view==='finished'?'guide':'finished';}
