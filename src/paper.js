// Geometry for flat folds: clip every visible paper panel at the crease, then
// reflect the moving portion. 3-D openings use separately authored schematic views.
export const panel=(points,kind='front')=>({points,kind,d:`M ${points.map(p=>p.join(' ')).join(' L ')} Z`});
export const path=(d,kind='crease')=>({d,kind});
export const square=()=>[panel([[60,60],[260,60],[260,260],[60,260]],'back')];
export const diamond=()=>[panel([[160,40],[280,160],[160,280],[40,160]],'back')];
export const rectangle=()=>[panel([[65,20],[255,20],[255,300],[65,300]],'back')];
const cross=(a,b,p)=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);
function clip(points,a,b,sign){
 const out=[];
 for(let i=0;i<points.length;i++){
  const p=points[i],q=points[(i+1)%points.length],dp=cross(a,b,p)*sign,dq=cross(a,b,q)*sign;
  if(dp>=-1e-7)out.push(p);
  if((dp>1e-7&&dq< -1e-7)||(dp< -1e-7&&dq>1e-7)){const t=dp/(dp-dq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}
 }
 return out;
}
function area(points){return Math.abs(points.reduce((s,p,i)=>{const q=points[(i+1)%points.length];return s+p[0]*q[1]-q[0]*p[1];},0))/2;}
export function fold(frame,a,b,moving,behind=false){
 const sign=Math.sign(cross(a,b,moving));if(!sign)throw Error('Moving point lies on crease');
 const dx=b[0]-a[0],dy=b[1]-a[1],norm=dx*dx+dy*dy;if(!norm)throw Error('Empty crease');
 const reflect=p=>{const t=((p[0]-a[0])*dx+(p[1]-a[1])*dy)/norm;return[2*(a[0]+t*dx)-p[0],2*(a[1]+t*dy)-p[1]];};
 const fixed=[],moved=[];
 for(const shape of frame){if(!shape.points)continue;
  const stay=clip(shape.points,a,b,-sign),go=clip(shape.points,a,b,sign);
  if(stay.length>=3&&area(stay)>0.01)fixed.push(panel(stay,shape.kind));
  if(go.length>=3&&area(go)>0.01)moved.unshift(panel(go.map(reflect),shape.kind==='back'?'front':'back'));
 }
 return behind?[...moved,...fixed]:[...fixed,...moved];
}
export function turn(frame){return [...frame].reverse().filter(p=>p.points).map(p=>panel(p.points.map(([x,y])=>[320-x,y]),p.kind==='back'?'front':'back'));}
export function rotate(frame){return frame.filter(p=>p.points).map(p=>panel(p.points.map(([x,y])=>[320-y,x]),p.kind));}
export function creaseLine(a,b){return `M ${a.join(' ')} L ${b.join(' ')}`;}
