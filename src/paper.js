// Geometry for flat folds: clip every visible paper panel at the crease, then
// reflect the moving portion. 3-D openings use separately authored schematic views.
// Creases made with `crease()` carry their endpoints, so folds and turns keep them.
// A crease belongs to the panel drawn just before it and moves with that layer.
const EPS=1e-7;
// Panels thinner than this (in square viewBox units) are clipping slivers, not paper.
export const MIN_AREA=2;
export function creaseLine(a,b){return `M ${a.join(' ')} L ${b.join(' ')}`;}
export const panel=(points,kind='front')=>({points,kind,d:`M ${points.map(p=>p.join(' ')).join(' L ')} Z`});
export const crease=(a,b)=>({line:[a,b],kind:'crease',d:creaseLine(a,b)});
export const path=(d,kind='crease')=>({d,kind});
export const square=()=>[panel([[60,60],[260,60],[260,260],[60,260]],'back')];
export const diamond=()=>[panel([[160,40],[280,160],[160,280],[40,160]],'back')];
export const rectangle=()=>[panel([[65,20],[255,20],[255,300],[65,300]],'back')];
const cross=(a,b,p)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
const otherSide=kind=>kind==='back'?'front':'back';
function clip(points,a,b,sign){
 const out=[];
 for(let i=0;i<points.length;i++){
  const p=points[i],q=points[(i+1)%points.length],dp=cross(a,b,p)*sign,dq=cross(a,b,q)*sign;
  if(dp>=-EPS)out.push(p);
  if((dp>EPS&&dq< -EPS)||(dp< -EPS&&dq>EPS)){const t=dp/(dp-dq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}
 }
 return out;
}
// The part of a crease segment strictly on one side of the fold line, or null.
function clipSegment([p,q],a,b,sign){
 const dp=cross(a,b,p)*sign,dq=cross(a,b,q)*sign;
 if(dp<=EPS&&dq<=EPS)return null;
 let seg=[p,q];
 if(dp< -EPS||dq< -EPS){const t=dp/(dp-dq),x=[p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])];seg=dp>0?[p,x]:[x,q];}
 return Math.hypot(seg[1][0]-seg[0][0],seg[1][1]-seg[0][1])>0.5?seg:null;
}
function area(points){return Math.abs(points.reduce((s,p,i)=>{const q=points[(i+1)%points.length];return s+p[0]*q[1]-q[0]*p[1];},0))/2;}
// `only` limits the fold to some layers, e.g. one flap: other panels stay put even
// where they cross the (infinite) fold line.
export function fold(frame,a,b,moving,behind=false,only=null){
 const sign=Math.sign(cross(a,b,moving));if(!sign)throw Error('Moving point lies on crease');
 const dx=b[0]-a[0],dy=b[1]-a[1],norm=dx*dx+dy*dy;if(!norm)throw Error('Empty crease');
 const reflect=p=>{const t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/norm;return[2*(a[0]+t*dx)-p[0],2*(a[1]+t*dy)-p[1]];};
 const fixed=[],moved=[];let group=null,folding=!only;
 for(const shape of frame){
  if(shape.points){
   folding=!only||only(shape);
   if(!folding){fixed.push(shape);group=null;continue;}
   const stay=clip(shape.points,a,b,-sign),go=clip(shape.points,a,b,sign);
   if(stay.length>=3&&area(stay)>MIN_AREA)fixed.push(panel(stay,shape.kind));
   group=[];moved.unshift(group);
   if(go.length>=3&&area(go)>MIN_AREA)group.push(panel(go.map(reflect),otherSide(shape.kind)));
  }else if(shape.line){
   if(!folding){fixed.push(shape);continue;}
   const stay=clipSegment(shape.line,a,b,-sign),go=clipSegment(shape.line,a,b,sign);
   if(stay)fixed.push(crease(...stay));
   if(go){if(!group){group=[];moved.unshift(group);}group.push(crease(...go.map(reflect)));}
  }
 }
 const lifted=moved.flat();
 return behind?[...lifted,...fixed]:[...fixed,...lifted];
}
// Group each panel with the creases drawn on it, so a transform keeps them together.
function layers(frame){
 const groups=[];
 for(const shape of frame){
  if(shape.points)groups.push([shape]);
  else if(shape.line){if(!groups.length)groups.push([]);groups.at(-1).push(shape);}
 }
 return groups;
}
function mapFrame(groups,point,kind=k=>k){return groups.flatMap(g=>g.map(s=>s.points?panel(s.points.map(point),kind(s.kind)):crease(...s.line.map(point))));}
export function turn(frame){return mapFrame(layers(frame).reverse(),([x,y])=>[320-x,y],otherSide);}
export function rotate(frame){return mapFrame(layers(frame),([x,y])=>[320-y,x]);}
