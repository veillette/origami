import {path as C,crease as mark,square,diamond,rectangle,fold,turn,rotate,creaseLine} from './paper.js';
const extra=[];
const src=slug=>`https://www.origami-instructions.com/${slug}.html`;
const paints=['peach','sage','lilac','butter','blue','pink'];
const poly=(d,kind='front')=>({d,kind});
const deco=d=>poly(d,'decoration');
const ink=d=>poly(d,'ink');
function make(id,name,category,paper,intro,source,start,write,level='Beginner friendly'){
 let state=start;const steps=[];
 const add=(title,text,after,folds=[],arrows=[],action='Fold',note='')=>{steps.push({title,text,before:state,after,folds,arrows,action,note});state=after;};
 // `only` picks the layers that move (see fold); by default every layer folds.
 const f=(title,text,a,b,moving,behind=false,only=null)=>{
  const dx=b[0]-a[0],dy=b[1]-a[1],t=((moving[0]-a[0])*dx+(moving[1]-a[1])*dy)/(dx*dx+dy*dy);
  const target=[2*(a[0]+t*dx)-moving[0],2*(a[1]+t*dy)-moving[1]];
  add(title,text,fold(state,a,b,moving,behind,only),[creaseLine(a,b)],[`M ${moving.join(' ')} L ${target.join(' ')}`],behind?'Fold behind':'Fold');
 };
 // Reinforcing an existing crease does not draw it twice.
 const crease=(title,text,a,b)=>{const d=creaseLine(a,b);add(title,text,state.some(p=>p.d===d)?state:[...state,mark(a,b)],[d],[],'Crease & unfold');};
 const flip=(title='Turn the model over.',text='Flip the whole model left to right, keeping the top at the top.')=>add(title,text,turn(state),[],[],'Turn over');
 const finish=(text,after=state)=>add('Your model is ready.',text,after,[],[],'Finish');
 write({add,f,crease,flip,finish,get:()=>state});
 extra.push({id,name,category,paper,intro,source,start,steps,level,color:paints[extra.length%paints.length]});
}
const sq='One square · 15 × 15 cm';
// Layer selectors for folds that move one flap rather than the whole stack.
const central=p=>p.points.some(([x,y])=>Math.abs(x-160)<.01&&Math.abs(y-40)<.01);
const leftOf=x0=>p=>p.points.every(([x])=>x<=x0+1e-6);
const rightOf=x0=>p=>p.points.every(([x])=>x>=x0-1e-6);
const marks=(y=135,gap=20)=>[deco(`M ${157-gap} ${y} a 3 4 0 1 0 6 0 a 3 4 0 1 0 -6 0`),deco(`M ${157+gap} ${y} a 3 4 0 1 0 6 0 a 3 4 0 1 0 -6 0`),deco(`M 154 ${y+18} L 166 ${y+18} L 160 ${y+25} Z`)];
make('cat-face','Pointy-eared cat','Animal friends',sq,'Upturned ears, a little chin, and an optional drawn face.',src('origami-cat-face'),diamond(),({f,crease,flip,finish,get})=>{
 f('Make an upward triangle.','Bring the bottom corner to the top, white sides together.',[40,160],[280,160],[160,280]);
 crease('Mark the middle.','Fold the triangle in half left to right and reopen.',[160,40],[160,160]);
 f('Lift the right ear.','Fold the right corner upward along the slanted line. Its tip should extend above the head.',[160,160],[224,106],[280,160]);
 f('Lift the left ear.','Match the left ear to the first, leaving a gap between their tips.',[160,160],[96,106],[40,160]);
 f('Lower the central tip.','Fold only the central top layer down to make a flat forehead. Leave both ear flaps free.',[120,85],[200,85],[160,40],false,central);
 flip();finish('The folds are complete. Optional: add eyes, a small nose and whiskers with a pen.',[...get(),...marks(118,16)]);
});
make('fox-face','Woodland fox face','Animal friends',sq,'A pointed chin and two tall ears. Optional pen for the eyes.',src('origami-fox-face'),diamond(),({f,crease,flip,finish,get})=>{
 f('Make an upward triangle.','Bring the bottom point to the top point.',[40,160],[280,160],[160,280]);
 crease('Find the center.','Fold left to right and reopen to the triangle.',[160,40],[160,160]);
 f('Lower the top point.','Bring the upper point down to the middle of the lower edge.',[100,100],[220,100],[160,40]);
 f('Raise the right side.','Fold the right corner up so its lower edge sits near the center line.',[160,160],[225,105],[280,160]);
 f('Raise the left side.','Fold the left corner up to match. The two tips form the ears.',[160,160],[95,105],[40,160]);
 flip();finish('Add a nose and eyes if you like. Keep the two ear points unfolded.',[...get(),...marks(117,17)]);
});
make('rabbit-face','Long-eared rabbit','Animal friends',sq,'A narrow folded band becomes two long ears.',src('origami-rabbit-face'),diamond(),({f,crease,flip,finish,get})=>{
 f('Start with a triangle.','Bring the bottom point to the top point.',[40,160],[280,160],[160,280]);
 crease('Make the center crease.','Fold the triangle left to right and open it again.',[160,40],[160,160]);
 f('Raise a narrow band.','Fold the long lower edge up about one finger-width.',[50,148],[270,148],[160,160]);
 f('Lift the right ear.','Bring the right end upward toward the center, using the slanted guide.',[160,136],[224,82],[280,136]);
 f('Lift the left ear.','Repeat on the left so two long tips stand above the head.',[160,136],[96,82],[40,136]);
 f('Fold the chin up.','Turn the lowest corner up a little to flatten the chin.',[125,128],[195,128],[160,150]);
 flip();f('Tuck the forehead behind.','Fold the central top point away from you, keeping both ears free.',[145,72],[175,72],[160,40],true,central);
 finish('Optional: draw a little face below the ears.',[...get(),...marks(100,13)]);
});
make('bear-face','Little bear face','Animal friends',sq,'Pleated ears and a small folded muzzle.',src('origami-bear-face'),diamond(),({f,crease,flip,add,finish,get})=>{
 f('Fold a downward triangle.','Bring the top point to the bottom point.',[40,160],[280,160],[160,40]);
 crease('Mark the center.','Fold left to right and reopen.',[160,160],[160,280]);
 f('Bring the left point inward.','Fold the left corner across toward the middle.',[115,160],[90,210],[40,160]);
 f('Bring the right point inward.','Repeat with the right corner.',[205,160],[230,210],[280,160]);
 const left=[poly('M 110 120 L 210 120 L 227 169 L 190 231 L 130 231 L 93 169 Z'),poly('M 93 169 L 62 124 L 115 133 Z','light')];
 add('Pleat the left ear outward.','Move only the left flap. Fold its tip outward again, leaving a short doubled band where it joins the face.',left,['M 107 134 L 98 164'],[],'Pleat','This view is recentered to show the two ear flaps clearly.');
 const ears=[...left,poly('M 227 169 L 258 124 L 205 133 Z','light')];
 add('Pleat the right ear outward.','Match the short doubled band on the right. Leave the center of the face flat.',ears,['M 213 134 L 222 164'],[],'Pleat');
 const tipped=[left[0],poly('M 93 169 L 72 140 L 80 127 L 115 133 Z','light'),poly('M 227 169 L 248 140 L 240 127 L 205 133 Z','light')];
 add('Tuck the sharp ear tips behind.','Fold a tiny triangle behind each ear to soften the points.',tipped,['M 72 140 L 80 127','M 248 140 L 240 127'],[],'Fold behind');
 const rounded=[poly('M 110 120 L 210 120 L 227 169 L 196 220 L 124 220 L 93 169 Z'),tipped[1],tipped[2]];
 add('Flatten the chin.','Fold the lower edge behind the face to make a short, flat chin.',rounded,['M 124 220 L 196 220'],[],'Fold behind');
 // From the back, the outline joins face and ears; the tucked tips and chin now face you.
 const smooth=[poly('M 110 120 L 210 120 L 214 131.5 L 240 127 L 248 140 L 227 169 L 196 220 L 124 220 L 93 169 L 72 140 L 80 127 L 106 131.5 Z'),poly('M 72 140 L 80 127 L 90.8 141.7 Z','light'),poly('M 248 140 L 240 127 L 229.2 141.7 Z','light'),poly('M 124 220 L 196 220 L 190 209 L 130 209 Z','light')];
 add('Turn to the smooth side.','Turn the model over, keeping the ears at the top. The tucked ear tips and chin are now on the back.',smooth,[],[],'Turn over');
 finish('Optional: draw eyes and a small muzzle.',[...smooth,...marks(163,20),deco('M 144 187 Q 160 201 176 187')]);
});
// A shared kite starts the two long-bodied animals; they have different finishing folds.
function kite({crease,f}){
 crease('Mark the long diagonal.','Fold the diamond left to right and open it again.',[160,40],[160,280]);
 f('Bring the lower-left edge inward.','Match the lower-left sloping edge to the vertical center crease.',[110,110],[160,280],[40,160]);
 f('Match the lower-right edge.','Fold the lower-right edge to the same crease.',[210,110],[160,280],[280,160]);
}
make('whale','Little blue whale','Animal friends',sq,'A kite fold becomes a broad head and an upturned tail.',src('easy-origami-whale'),diamond(),api=>{
 const {f,add,finish,get}=api;kite(api);
 f('Shorten the top.','Bring the broad upper point down toward the middle.',[110,95],[210,95],[160,40]);
 f('Fold along the long center.','Fold the whole model in half lengthwise.',[160,40],[160,280],[80,160]);
 add('Turn it onto its side.','Rotate the model a quarter turn so the thin tail points left.',rotate(get()),[],[],'Rotate');
 const body=[poly('M 70 180 L 145 115 L 245 115 L 263 151 L 242 207 L 145 207 Z'),poly('M 70 180 L 103 126 L 110 185 Z','light')];
 add('Raise the tail.','Fold the thin end upward on the slanted line. Press both layers together.',body,['M 109 166 L 123 192'],['M 76 181 Q 70 142 100 129']);
 finish('Optional: add an eye near the broad head. This is a schematic side view.',[...body,deco('M 235 151 a 3 3 0 1 0 6 0 a 3 3 0 1 0 -6 0')]);
});
make('penguin','Standing penguin','Animal friends',sq,'A white belly and an outside reverse fold for the head.','https://origami.me/penguin/',diamond(),({crease,f,flip,add,finish,get})=>{
 crease('Mark the middle.','Start colored side up. Fold left to right and reopen.',[160,40],[160,280]);
 flip('Turn the white side up.','Flip the sheet without losing the vertical crease.');
 f('Narrow the left edge.','Fold the upper-left edge toward the center, leaving a slim gap.',[140,40],[95,205],[40,160]);
 f('Narrow the right edge.','Match the fold on the right, preserving the gap.',[180,40],[225,205],[280,160]);
 flip();f('Tuck the left side in.','Fold the side corner inward along the guide.',[115,125],[115,215],[65,170]);
 f('Tuck the right side in.','Repeat on the other side.',[205,125],[205,215],[255,170]);
 f('Raise the bottom point.','Fold the long bottom tip up to the lower edges of the side flaps.',[115,230],[205,230],[160,280]);
 f('Fold the penguin in half.','Use the vertical crease, keeping the white belly visible outside.',[160,40],[160,280],[90,170]);
 add('Precrease the head.','Bend the upper tip down at the neck in both directions, then reopen to the upright profile.',get(),['M 160 100 L 200 122'],[],'Crease & unfold');
 const bird=[poly('M 175 76 L 223 107 L 194 127 L 218 247 L 150 247 L 148 127 Z'),poly('M 171 126 L 194 127 L 201 231 L 163 231 Z','back')];
 add('Reverse the head outside.','Ease the top layers apart, turn the tip down over the outside, and flatten the neck on its precrease.',bird,[],[],'Outside reverse fold','The final diagram is an enlarged side view. Do not cut or pull the head off.');
 finish('Open the base a little so your penguin can stand.',bird);
},'Next-step folding');
make('fish','Triangle-tail fish','Animal friends',sq,'A waterbomb base with two overlapping tail flaps.','https://cdn.durhamcathedral.co.uk/uploads/files/Fish-origami-instructions.pdf?v=1708503160',square(),({crease,f,flip,add,finish,get})=>{
 crease('Crease the first diagonal.','Bring opposite corners together, then open.',[60,60],[260,260]);
 crease('Crease the second diagonal.','Repeat on the other diagonal and open.',[260,60],[60,260]);
 flip();crease('Make the cross crease.','Fold the top edge to the bottom edge and reopen.',[60,160],[260,160]);
 const base=[poly('M 40 235 L 160 115 L 280 235 Z'),C('M 160 115 L 160 235')];
 add('Collapse into a triangle.','Push the side middles inward and flatten the top down. Keep the open flaps at the bottom.',base,[],[],'Collapse','This is a waterbomb base: two triangular faces with folded layers between them.');
 const tail1=[...base,poly('M 160 235 L 191 149 L 264 218 Z','light')];
 add('Make the first tail flap.','Fold the top right bottom corner diagonally toward the upper-left area, leaving a pointed tail to the right.',tail1,['M 160 235 L 218 173'],['M 274 232 Q 246 180 194 153']);
 const tail2=[poly('M 60 160 L 168 76 L 168 244 Z'),poly('M 168 150 L 255 105 L 234 172 Z','light'),poly('M 168 172 L 255 226 L 234 156 Z')];
 add('Cross the other tail flap.','Fold the other front corner across the first flap. Turn the model over and rotate it so the tail points right.',tail2,['M 102 173 L 160 235'],[],'Fold & turn');
 finish('Draw an eye on the wide triangular body if you like.',[...tail2,deco('M 103 152 a 4 4 0 1 0 8 0 a 4 4 0 1 0 -8 0')]);
},'Next-step folding');
make('heart','Little paper heart','Flowers & gifts',sq,'Small corner folds soften a simple heart outline.',src('easy-origami-heart'),diamond(),({crease,f,flip,finish})=>{
 crease('Mark a vertical diagonal.','Fold left to right, then open.',[160,40],[160,280]);
 crease('Mark the other diagonal.','Fold top to bottom and open.',[40,160],[280,160]);
 f('Bring the top point to the middle.','Fold the upper corner down to the crease intersection.',[100,100],[220,100],[160,40]);
 f('Raise the lower point.','Bring the bottom point up to the folded top edge.',[55,190],[265,190],[160,280]);
 f('Raise the right half.','Bring the right lower edge up to the vertical center crease.',[160,190],[220,130],[280,160]);
 f('Raise the left half.','Bring the left lower edge up to meet the right half.',[160,190],[100,130],[40,160]);
 flip();
 // After turning over, the side points sit at (85,115) and (235,115); the lobe tips at y=70.
 f('Soften the left corner.','Fold the outer left point inward a little.',[95,105],[95,125],[85,115]);
 f('Soften the right corner.','Match the small fold at the right.',[225,105],[225,125],[235,115]);
 f('Lower the left top tip.','Fold the top-left point down to round the first lobe.',[112,85],[148,85],[130,70],false,leftOf(160));
 f('Lower the right top tip.','Repeat on the other lobe.',[172,85],[208,85],[190,70],false,rightOf(160));
 flip();finish('Flatten the back folds gently. Your heart is ready to give away.');
});
make('tulip','Flat tulip blossom','Flowers & gifts',sq,'Three points form a flat flower. This lesson makes the blossom only.','https://en.origami.plus/origami-tulip',diamond(),({f,crease,flip,finish})=>{
 f('Make an upward triangle.','Bring the bottom point to the top.',[40,160],[280,160],[160,280]);
 crease('Find the center.','Fold the triangle in half left to right and reopen.',[160,40],[160,160]);
 f('Raise the right petal.','Fold the right corner up and slightly left. Its tip should sit beside the central point.',[165,155],[233,99],[280,160]);
 f('Raise the left petal.','Match the left corner, leaving the middle point visible between the two petals.',[155,155],[87,99],[40,160]);
 f('Soften the left corner.','Fold the outer left corner behind a little to round the blossom.',[108,86],[108,116],[95,105],true);
 f('Soften the right corner.','Make a matching small fold behind on the right.',[212,86],[212,116],[225,105],true);
 finish('Keep it as a flat blossom or place it beside a paper stem. No hole or cut is needed.');
});
make('ice-cream','Paper ice cream','Flowers & gifts',sq,'A pointed cone with a contrasting folded scoop.','https://www.origamiway.com/cute-origami-ice-cream/',diamond(),({crease,f,flip,add,finish,get})=>{
 crease('Find the center line.','Fold left to right, then unfold.',[160,40],[160,280]);
 f('Shape the left side of the cone.','Bring the lower-left edge to the center crease.',[110,110],[160,280],[40,160]);
 f('Shape the right side.','Bring the lower-right edge to the same center crease.',[210,110],[160,280],[280,160]);
 flip();
 f('Fold the scoop point down.','Bring the top corner down over the cone.',[100,110],[220,110],[160,40]);
 const cone=[poly('M 108 132 L 212 132 L 160 277 Z'),poly('M 96 132 L 113 85 L 160 59 L 207 85 L 224 132 L 207 152 L 113 152 Z','back')];
 add('Pleat the scoop back upward.','Make a small fold upward in the lowered flap so a white scoop stands above the cone.',cone,['M 114 129 L 206 129'],['M 160 174 Q 201 129 160 90']);
 finish('Press the short scoop fold flat. This is an enlarged front view.',cone);
});
const houseBase=[poly('M 60 150 L 110 100 L 210 100 L 260 150 L 260 250 L 60 250 Z','back'),poly('M 60 150 L 110 100 L 160 150 Z'),poly('M 160 150 L 210 100 L 260 150 Z'),C('M 160 150 L 160 250')];
function houseSteps({crease,f,add,get}){
 crease('Mark the vertical middle.','Fold the square left to right, press, and open.',[160,60],[160,260]);
 f('Fold the top edge down.','Bring the top edge to the bottom edge.',[60,160],[260,160],[160,60]);
 f('Bring the left side inward.','Fold the left edge to the center crease.',[110,150],[110,270],[60,200]);
 f('Bring the right side inward.','Bring the right edge to the center crease.',[210,150],[210,270],[260,200]);
 const right=[poly('M 110 160 L 210 160 L 260 210 L 260 260 L 110 260 Z','back'),poly('M 160 210 L 210 160 L 260 210 Z')];
 add('Open and squash the right pocket.','Open the upper corner of the right folded panel. Bring its vertical crease onto the edge below and press the pocket into a triangle.',right,[],[],'Squash fold','The diagonal roof is made by opening a paper pocket, not cutting a corner.');
 add('Squash the left pocket too.','Open and flatten the matching pocket on the left. The outline now resembles a house.',houseBase,[],[],'Squash fold');
}
make('house','Little paper house','Useful little things',sq,'Two squash folds make a roof. Optional: draw a door and windows.',src('origami-house'),square(),api=>{
 houseSteps(api);api.finish('Flatten the roof gently. Add doors or windows with a pen if you wish.',[...houseBase,ink('M 143 250 L 143 199 L 177 199 L 177 250'),ink('M 84 182 L 114 182 L 114 211 L 84 211 Z'),ink('M 206 182 L 236 182 L 236 211 L 206 211 Z')]);
},'Next-step folding');
make('piano','Miniature piano','Useful little things',sq,'Make a house base, then open it into a standing keyboard.',src('origami-piano'),square(),api=>{
 houseSteps(api);const {add,finish}=api;
 const raised=[...houseBase,poly('M 110 170 L 210 170 L 210 220 L 110 220 Z','light')];
 add('Raise the center flap.','Lift the central lower panel upward. Crease its bottom edge firmly so it can become a keyboard.',raised,['M 110 220 L 210 220'],['M 160 245 L 160 177']);
 add('Precrease the side supports.','Fold the left and right outer panels inward along their vertical edges, then reopen them to right angles.',raised,['M 110 150 L 110 250','M 210 150 L 210 250'],[],'Crease & open');
 const piano=[poly('M 85 110 L 235 110 L 235 230 L 85 230 Z'),poly('M 85 110 L 65 135 L 65 265 L 85 230 Z','dark'),poly('M 235 110 L 255 135 L 255 265 L 235 230 Z','light'),poly('M 85 202 L 235 202 L 250 231 L 70 231 Z','back')];
 add('Lower the keyboard shelf.','Pull the center flap down to a right angle. Leave the side panels open as supports.',piano,[],[],'Open','The diagram now shows the upright piano in perspective.');
 finish('Optional: draw keys across the white shelf.',[...piano,ink('M 98 204 L 94 228'),ink('M 119 204 L 117 228'),ink('M 140 204 L 139 228'),ink('M 161 204 L 161 228'),ink('M 182 204 L 183 228'),ink('M 203 204 L 205 228'),ink('M 224 204 L 227 228')]);
},'Next-step folding');
make('envelope','Diamond-flap envelope','Useful little things',sq,'Four flaps make a small envelope. Fold the last tip into the lower pocket.','https://www.origamiway.com/origami-envelope/',diamond(),({crease,f,add,finish,get})=>{
 crease('Mark the horizontal middle.','Fold top to bottom and open to the diamond.',[40,160],[280,160]);
 f('Raise the bottom corner.','Bring the lower point a little above the middle.',[85,205],[235,205],[160,280]);
 f('Bring the left side inward.','Fold the left point across the center by about a thumb-width.',[110,90],[110,230],[40,160]);
 f('Bring the right side inward.','Overlap the right point over the left flap.',[210,90],[210,230],[280,160]);
 const pocket=[poly('M 160 40 L 210 90 L 210 205 L 110 205 L 110 90 Z','back'),poly('M 110 160 L 210 160 L 210 205 L 110 205 Z'),C('M 110 160 L 160 192 L 210 160')];
 add('Open the lower pocket edge.','Ease apart the front layers along their upper edge. Keep the side flaps flat.',pocket,[],[],'Open');
 add('Lower the top flap.','Bring the upper point down toward the bottom edge.',[poly('M 110 90 L 210 90 L 210 205 L 110 205 Z'),poly('M 110 90 L 210 90 L 160 192 Z','light')],['M 110 90 L 210 90'],['M 160 45 Q 196 115 160 188']);
 finish('Slide the tip inside the lower pocket. This small envelope is for a note, not for posting without another envelope.',[poly('M 80 105 L 240 105 L 240 240 L 80 240 Z'),poly('M 80 105 L 160 188 L 240 105 Z','light'),C('M 80 240 L 143 180'),C('M 240 240 L 177 180')]);
});
make('fan','Accordion hand fan','Play & share',sq,'Repeat equal pleats, then spread the top while holding the base.',src('origami-fan'),square(),({f,add,finish})=>{
 for(let i=0;i<7;i++){
  const y=85+i*25;
  f(i===0?'Fold the first narrow band.':`Make pleat ${i+1}.`,i===0?'Fold the top edge down by roughly one-eighth of the sheet.':'Fold the stacked band over once more, matching its width. Alternate toward and away from you.',[60,y],[260,y],[160,y-12],i%2===1);
 }
 const fan=[poly('M 160 269 L 51 139 L 58 95 L 97 112 L 117 76 L 151 103 L 181 76 L 203 112 L 242 95 L 269 139 Z'),C('M 160 269 L 58 95'),C('M 160 269 L 97 112'),C('M 160 269 L 117 76'),C('M 160 269 L 151 103'),C('M 160 269 L 181 76'),C('M 160 269 L 203 112'),C('M 160 269 L 242 95')];
 f('Pinch a short handle.','Fold one short end of the pleated strip behind, then pinch it to make a handle. No glue is needed.',[85,230],[85,265],[70,247],true);
 add('Spread the opposite end.','Keep the handle pinched and fan out the other end. Let the pleats open evenly.',fan,[],[],'Open');
 finish('Hold the pinched base while using the fan.',fan);
});
function planeBase({crease,f}){
 crease('Find the long middle crease.','Hold the rectangle upright. Fold left edge to right edge, then open.',[160,20],[160,300]);
 f('Bring the upper-left corner in.','Match the top-left short edge to the long center crease.',[65,115],[160,20],[65,20]);
 f('Bring the upper-right corner in.','Match the other top corner to the middle.',[160,20],[255,115],[255,20]);
}
make('dart','Classic paper dart','Play & share','One rectangle · A4 or US Letter','A narrow point and long wings. Make the two wing folds match.','https://www.foldnfly.com/1.html',rectangle(),api=>{
 const {f,add,finish}=api;planeBase(api);
 // The crease bisects the 45° nose edge and the center line: 22.5° from vertical.
 const noseY=20+95*(1+Math.SQRT2);
 f('Narrow the left nose edge.','Fold the upper-left sloping edge onto the center crease.',[160,20],[65,noseY],[65,115]);
 f('Narrow the right nose edge.','Make the matching fold on the right.',[160,20],[255,noseY],[255,115]);
 f('Close the body.','Fold the plane in half on the long center crease, keeping the folded nose outside.',[160,20],[160,300],[80,210],true);
 const wing=[poly('M 160 30 L 242 278 L 177 260 Z'),poly('M 160 30 L 177 260 L 150 277 Z','dark')];
 add('Fold the first wing down.','Leave a narrow strip for your fingers along the body. Fold the upper outer edge down, aligning it with the lower body edge.',wing,['M 160 65 L 177 260'],[],'Fold');
 // Seen from the other side, the plane is mirrored and the second wing lies on top.
 const wing2=[poly('M 160 30 L 78 278 L 143 260 Z'),poly('M 160 30 L 143 260 L 170 277 Z','dark')];
 add('Match the second wing.','Turn the plane over and fold the second wing to the same height.',wing2,[],[],'Turn & fold');
 const opened=[poly('M 160 35 L 258 257 L 175 230 L 160 267 Z'),poly('M 160 35 L 62 257 L 145 230 L 160 267 Z','light'),C('M 160 35 L 160 267')];
 add('Level the wings.','Open the wings until they are almost level, leaving a slight upward V. Hold the body below them.',opened,[],[],'Open');
 finish('Try a gentle level launch into clear space. Adjust both wings equally.',opened);
});
make('glider','Blunt-nose glider','Play & share','One rectangle · A4 or US Letter','A tucked nose lock and broad wings distinguish this glider from the dart.','https://www.foldnfly.com/2.html',rectangle(),api=>{
 const {f,add,finish}=api;planeBase(api);
 f('Lower the pointed nose.','Fold the triangular top down, leaving a small margin above the bottom edge.',[65,130],[255,130],[160,20]);
 f('Bring the new left corner inward.','Fold the top-left corner toward the middle, leaving the lowered nose tip exposed below.',[65,200],[160,130],[65,130]);
 f('Bring the new right corner inward.','Match the fold on the other side.',[255,200],[160,130],[255,130]);
 const locked=[poly('M 105 120 L 215 120 L 255 300 L 65 300 Z'),poly('M 145 225 L 175 225 L 160 201 Z','light')];
 add('Lock the nose flaps.','Fold the exposed little triangle upward over the two side flaps to hold them in place.',locked,['M 145 225 L 175 225'],['M 160 243 L 160 205']);
 add('Close the body outward.','Fold the whole plane in half lengthwise so the little locking triangle remains outside.',[poly('M 160 120 L 215 120 L 255 300 L 160 300 Z')],['M 160 120 L 160 300'],[],'Fold behind');
 add('Fold down one broad wing.','Fold one outer edge down, leaving a finger-width body beneath it.',[poly('M 160 120 L 218 133 L 255 300 L 173 281 Z'),poly('M 160 120 L 173 281 L 160 300 Z','dark')],['M 160 141 L 173 281']);
 const glider=[poly('M 120 91 L 200 91 L 268 250 L 175 237 L 160 267 L 145 237 L 52 250 Z'),C('M 160 100 L 160 267'),C('M 120 91 L 145 237'),C('M 200 91 L 175 237')];
 add('Match the second wing and open.','Turn over, fold the other wing to match, then open both wings into a shallow V.',glider,[],[],'Turn & open');
 finish('Hold the body under the wings and try a light, level glide.',glider);
});
make('masu-box','Little masu box','Useful little things','One square · 20 × 20 cm','A classic open box with tucked walls. Work carefully through the opening steps.',src('origami-box'),diamond(),({crease,f,add,finish,get})=>{
 crease('Mark the horizontal diagonal.','Fold top to bottom, then open.',[40,160],[280,160]);
 crease('Mark the vertical diagonal.','Fold left to right, then open.',[160,40],[160,280]);
 f('Bring the top corner inward.','Bring the top point to the middle.',[100,100],[220,100],[160,40]);
 f('Bring in the right corner.','Place the right point at the same center.',[220,100],[220,220],[280,160]);
 f('Bring in the bottom corner.','Place the bottom point at the center.',[100,220],[220,220],[160,280]);
 f('Bring in the left corner.','Fold the final point to the center.',[100,100],[100,220],[40,160]);
  crease('Precrease the left wall.','Fold the left edge of the small square to the center and reopen.',[130,100],[130,220]);
 crease('Precrease the right wall.','Match the right edge to the center and reopen.',[190,100],[190,220]);
 crease('Precrease the top wall.','Bring the top edge to the middle, press, and reopen.',[100,130],[220,130]);
 crease('Precrease the bottom wall.','Bring the bottom edge to the middle, then reopen.',[100,190],[220,190]);
 const extended=[poly('M 160 40 L 220 100 L 220 220 L 160 280 L 100 220 L 100 100 Z','back'),poly('M 100 100 L 160 160 L 100 220 Z'),poly('M 220 100 L 160 160 L 220 220 Z'),C('M 130 70 L 130 250'),C('M 190 70 L 190 250'),C('M 100 130 L 220 130'),C('M 100 190 L 220 190')];
 add('Open the top and bottom flaps.','Unfold only those two corners. Keep the left and right corners folded to the center.',extended,[],[],'Unfold');
 const walls=[poly('M 100 115 L 220 115 L 220 230 L 100 230 Z','back'),poly('M 100 115 L 75 88 L 75 205 L 100 230 Z'),poly('M 220 115 L 245 88 L 245 205 L 220 230 Z','light'),poly('M 75 88 L 160 40 L 245 88 L 220 115 L 100 115 Z','back'),poly('M 75 205 L 160 280 L 245 205 L 220 230 L 100 230 Z','back')];
 add('Raise the two long walls.','Lift the left and right sides upright along their precreases. The long unfolded ends remain sticking out.',walls,[],[],'Raise walls','The following views show the box in perspective.');
 const end1=[poly('M 100 115 L 220 115 L 220 230 L 100 230 Z','back'),poly('M 100 115 L 75 88 L 75 205 L 100 230 Z'),poly('M 220 115 L 245 88 L 245 205 L 220 230 Z','light'),poly('M 75 88 L 245 88 L 220 115 L 100 115 Z','dark'),poly('M 75 205 L 160 280 L 245 205 L 220 230 L 100 230 Z','back')];
 add('Close and tuck the first end.','Push the two diagonal corner creases inward at one end. Bring its long tip over the wall and down onto the floor.',end1,[],[],'Collapse & tuck');
 const box=[poly('M 70 94 L 250 94 L 250 223 L 70 223 Z','dark'),poly('M 70 94 L 95 132 L 95 248 L 70 223 Z'),poly('M 250 94 L 225 132 L 225 248 L 250 223 Z','light'),poly('M 95 132 L 225 132 L 225 248 L 95 248 Z','back'),poly('M 70 223 L 250 223 L 225 248 L 95 248 Z')];
 add('Close and tuck the other end.','Repeat at the opposite end, bringing the last tip onto the floor inside the box.',box,[],[],'Collapse & tuck');
 finish('Square up the four walls and press the base flat. Your box needs no glue.',box);
},'Next-step folding');
make('sailboat','Single-sail boat','Paper classics',sq,'An inside reverse fold creates a colored hull below a single sail.','https://en.origami.plus/origami-sailboat',diamond(),({f,crease,add,finish})=>{
 f('Fold the diamond in half.','Bring the left point to the right point, making a triangle with its long folded edge on the left.',[160,40],[160,280],[40,160]);
 crease('Mark the hull angle.','Fold the lower part upward on a slant, then reopen.',[160,205],[260,180]);
 crease('Reinforce from the other side.','Bend that same crease backward and reopen. The hull crease should flex in both directions.',[160,205],[260,180]);
 const sail=[poly('M 166 55 L 166 205 L 246 205 Z','back'),poly('M 65 184 L 166 205 L 260 184 L 224 250 L 101 250 Z'),poly('M 65 184 L 166 205 L 101 250 Z','light')];
 add('Reverse the hull fold inside.','Open the two triangular faces slightly along the long folded edge. Push the lower section between them along its slanted crease, then close the main fold so the sail rises above the hull.',sail,[],[],'Inside reverse fold');
 finish('Open the hull very slightly for a standing display. This is the finished side view.',sail);
},'Next-step folding');
make('samurai-helmet','Samurai helmet','Paper classics',sq,'Two horns above a layered brim: the traditional kabuto.', 'https://www.origami-fun.com/origami-samurai-hat.html',diamond(),({f,add,finish,get})=>{
 f('Fold a downward triangle.','Bring the top corner down to the bottom.',[40,160],[280,160],[160,40]);
 // Each crease runs from the top center to the middle of a sloping edge.
 f('Lower the left corner.','Bring the left side point down to the bottom point.',[160,160],[100,220],[40,160]);
 f('Lower the right corner.','Bring the right side point down to the same point.',[160,160],[220,220],[280,160]);
 const horns=[poly('M 160 70 L 250 160 L 160 250 L 70 160 Z'),poly('M 70 160 L 112 85 L 160 160 Z','light'),poly('M 250 160 L 208 85 L 160 160 Z','light')];
 add('Raise the two loose tips.','Fold each front lower tip upward in half to the upper point. Move only the two loose front flaps.',horns,['M 100 220 L 220 220'],['M 156 274 L 146 168','M 164 274 L 174 168'],'Fold','The result is enlarged to show the two front flaps clearly.');
 const spread=[poly('M 160 70 L 250 160 L 160 250 L 70 160 Z'),poly('M 70 160 L 65 73 L 137 141 Z','light'),poly('M 250 160 L 255 73 L 183 141 Z','light')];
 add('Spread the horn tips.','Fold the raised tips outward at an angle. Match the two horns.',spread,['M 101 120 L 137 141','M 219 120 L 183 141'],[],'Fold outward');
 const brim=[poly('M 160 70 L 250 160 L 160 250 L 70 160 Z'),spread[1],spread[2],poly('M 87 177 L 233 177 L 160 115 Z','back')];
 add('Raise the front lower flap.','Fold the front bottom triangle up, stopping a little below the upper point.',brim,['M 87 177 L 233 177'],['M 160 245 Q 207 177 160 120']);
 const helmet=[poly('M 160 70 L 250 160 L 224 203 L 96 203 L 70 160 Z'),spread[1],spread[2],poly('M 87 177 L 233 177 L 224 203 L 96 203 Z','light')];
 add('Roll the narrow brim upward.','Fold the little band at the bottom of the raised flap upward once more.',helmet,['M 87 177 L 233 177'],[],'Fold');
 add('Precrease the remaining flap.','Fold the back bottom flap up to the brim, press, then reopen it.',helmet,[],[],'Crease & unfold');
 finish('Open the bottom pocket and tuck the remaining flap inside. Spread the helmet slightly.',helmet);
});
make('cicada','Summer cicada','Animal friends',sq,'Layered wings and a narrow band at the top.','https://origami.me/cicada/',diamond(),({f,add,finish,get})=>{
 f('Start with an upward triangle.','Bring the bottom point up to the top.',[40,160],[280,160],[160,280]);
 f('Raise the left side point.','Bring the left point to the upper point.',[100,100],[160,160],[40,160]);
 f('Raise the right side point.','Match the right point to the top.',[220,100],[160,160],[280,160]);
 const wings=[poly('M 160 55 L 245 140 L 160 245 L 75 140 Z'),poly('M 160 55 L 75 140 L 103 240 L 160 183 Z','light'),poly('M 160 55 L 245 140 L 217 240 L 160 183 Z')];
 add('Fold the two tips down and outward.','Lower the front tips at a slight angle to form the two wings.',wings,['M 100 100 L 160 88','M 160 88 L 220 100'],['M 155 46 Q 118 90 128 150','M 165 46 Q 202 90 192 150'],'Fold outward','The result is enlarged to show the two wings.');
 const band=[...wings,poly('M 117 98 L 203 98 L 160 149 Z','back')];
 add('Lower the upper front layer.','Fold the upper point of the front layer down between the wings.',band,['M 117 98 L 203 98'],['M 160 60 L 160 145']);
 const bug=[poly('M 108 98 L 212 98 L 244 142 L 213 247 L 160 216 L 107 247 L 76 142 Z'),poly('M 108 98 L 212 98 L 160 156 Z','light'),poly('M 117 111 L 203 111 L 160 171 Z','back'),C('M 160 171 L 160 216')];
 add('Lower the remaining top layer.','Fold the second upper point downward, leaving a narrow band of the first layer visible.',bug,['M 117 111 L 203 111'],[],'Fold');
 const narrow=[poly('M 108 98 L 212 98 L 228 120 L 228 196 L 213 247 L 160 216 L 107 247 L 92 196 L 92 120 Z'),...bug.slice(1)];
 add('Tuck the sides behind.','Fold the left and right side corners behind the model to narrow its body.',narrow,['M 92 120 L 92 196','M 228 120 L 228 196'],[],'Fold behind');
 finish('Your flat cicada is ready. Keep the wing layers slightly separated.',narrow);
});
export const extraModels=extra;
