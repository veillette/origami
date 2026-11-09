const NS='http://www.w3.org/2000/svg';
let serial=0;
function el(tag,attrs={}){const node=document.createElementNS(NS,tag);for(const [key,value] of Object.entries(attrs))node.setAttribute(key,value);return node;}
export function diagram(model,{step=0,view='guide',thumbnail=false}={}){
 const current=model.steps[step];
 const finished=view==='finished'||thumbnail;
 const shapes=finished?model.steps.at(-1).after:view==='result'?current.after:current.before;
 const label=finished?`${model.name}, finished model`:`${model.name}, step ${step+1}, ${view==='result'?'after the action':'before the action'}: ${current.title}`;
 const svg=el('svg',{viewBox:'0 0 320 320',class:`fold-diagram ${model.color}`,'role':'img','aria-label':label});
 const title=el('title');title.textContent=label;svg.append(title);
 for(const shape of shapes)svg.append(el('path',{d:shape.d,class:`paper ${shape.kind}`}));
 if(!finished&&view==='guide'){
   const markerId=`arrow-${serial++}`;
   const defs=el('defs');const marker=el('marker',{id:markerId,viewBox:'0 0 10 10',refX:'8',refY:'5',markerWidth:'5',markerHeight:'5',orient:'auto-start-reverse'});
   marker.append(el('path',{d:'M 1 1 L 9 5 L 1 9 Z',class:'arrowhead'}));defs.append(marker);svg.append(defs);
   for(const d of current.folds)svg.append(el('path',{d,class:`fold-line ${current.action==='Fold behind'?'mountain':''}`}));
   for(const d of current.arrows)svg.append(el('path',{d,class:'fold-arrow','marker-end':`url(#${markerId})`}));
 }
 return svg;
}
