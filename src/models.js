// Original schematic diagrams of traditional models. Coordinates are recentered
// between views for readability. Each step shows the paper BEFORE and AFTER.
const P=(d,side='front')=>({d,kind:side});
const C=d=>({d,kind:'crease'});
const D=d=>({d,kind:'decoration'});
const square=[P('M 60 60 L 260 60 L 260 260 L 60 260 Z','back')];
const diamond=[P('M 160 30 L 290 160 L 160 290 L 30 160 Z','back')];
const up=[P('M 40 220 L 160 100 L 280 220 Z')];
const down=[P('M 40 100 L 280 100 L 160 220 Z')];
const rect=[P('M 60 20 L 260 20 L 260 300 L 60 300 Z','back')];
const half=[P('M 60 100 L 260 100 L 260 240 L 60 240 Z')];
const roofL=[P('M 60 100 L 260 100 L 260 240 L 60 240 L 60 200 L 160 100 Z'),P('M 160 100 L 160 200 L 60 200 Z','light')];
const roof=[P('M 60 200 L 160 100 L 260 200 L 260 240 L 60 240 Z'),P('M 60 200 L 160 100 L 160 200 Z','light'),C('M 160 100 L 160 200')];
const brim=[...roof,P('M 60 160 L 260 160 L 260 200 L 60 200 Z','light')];
const hat=[P('M 60 200 L 160 100 L 260 200 Z'),P('M 60 180 L 260 180 L 260 200 L 60 200 Z','light'),C('M 160 100 L 160 180')];
const hatFront=[...roof,P('M 60 180 L 260 180 L 260 200 L 60 200 Z','light')];
const step=(title,text,after,folds=[],arrows=[],action='Fold',note='')=>({title,text,after,folds,arrows,action,note});
function model(id,name,category,color,paper,intro,source,start,steps){
 let before=start;
 return {id,name,category,color,paper,intro,source,start,steps:steps.map(s=>{const result={...s,before};before=s.after;return result;})};
}
const dogL=[P('M 140 100 L 280 100 L 160 220 L 73.33 133.33 Z'),P('M 140 100 L 73.33 133.33 L 80 180 Z','dark')];
const dogE=[P('M 140 100 L 180 100 L 246.67 133.33 L 160 220 L 73.33 133.33 Z'),P('M 140 100 L 73.33 133.33 L 80 180 Z','dark'),P('M 180 100 L 246.67 133.33 L 240 180 Z','dark')];
const dogF=[P('M 140 100 L 180 100 L 246.67 133.33 L 184 196 L 136 196 L 73.33 133.33 Z'),P('M 140 100 L 73.33 133.33 L 80 180 Z','dark'),P('M 180 100 L 246.67 133.33 L 240 180 Z','dark')];
const cupL=[P('M 110 150 L 160 100 L 280 220 L 140 220 Z'),P('M 110 150 L 210 150 L 140 220 Z','light')];
const cupR=[P('M 110 150 L 160 100 L 210 150 L 180 220 L 140 220 Z'),P('M 110 150 L 210 150 L 140 220 Z','light'),P('M 210 150 L 110 150 L 180 220 Z')];
const cupF=[P('M 110 150 L 160 100 L 210 150 L 180 220 L 140 220 Z'),P('M 110 150 L 210 150 L 160 200 Z','light')];
const cupFlat=[P('M 110 150 L 210 150 L 180 220 L 140 220 Z'),P('M 110 150 L 210 150 L 160 200 Z','light')];
const cupOpen=[P('M 85 126 L 235 126 L 206 247 L 114 247 Z'),P('M 85 126 Q 160 99 235 126 Q 160 160 85 126 Z','dark'),P('M 85 126 L 160 199 L 235 126 Q 160 160 85 126 Z','light')];
const bookmarkPocket=[...up,P('M 100 160 L 220 160 L 160 220 Z','back')];
const markLeft=[P('M 160 100 L 280 220 L 160 220 L 100 160 Z'),P('M 100 160 L 160 100 L 160 220 Z','light'),P('M 160 160 L 220 160 L 160 220 Z','back')];
const markDiamond=[P('M 160 100 L 220 160 L 160 220 L 100 160 Z'),P('M 100 160 L 160 100 L 160 220 Z','light'),C('M 160 100 L 160 220')];
const markFinal=[P('M 160 70 L 250 160 L 160 250 L 70 160 Z'),P('M 70 160 L 250 160 L 160 250 Z','light'),C('M 70 160 L 160 250 L 250 160')];
const boatDiamond=[P('M 160 70 L 250 160 L 160 250 L 70 160 Z'),C('M 160 70 L 160 250'),P('M 70 160 L 160 190 L 160 250 Z','light')];
const boatOne=[...boatDiamond,P('M 70 160 L 250 160 L 160 70 Z','light')];
const boatTriangle=[P('M 70 160 L 250 160 L 160 70 Z'),C('M 160 70 L 160 160')];
const boatSmall=[P('M 160 90 L 230 160 L 160 230 L 90 160 Z'),P('M 160 90 L 160 230 L 90 160 Z','light')];
const boatFinal=[P('M 160 80 L 105 208 L 215 208 Z','light'),P('M 45 182 L 160 218 L 275 182 L 226 259 L 94 259 Z'),P('M 45 182 L 160 218 L 94 259 Z','dark')];
// The four first folds turn an axis-aligned square into a diamond.
const firstFrames=[
 [P('M 160 60 L 260 60 L 260 260 L 60 260 L 60 160 Z','back'),P('M 160 60 L 160 160 L 60 160 Z')],
 [P('M 160 60 L 260 160 L 260 260 L 60 260 L 60 160 Z','back'),P('M 160 60 L 160 160 L 60 160 Z'),P('M 160 60 L 260 160 L 160 160 Z','light')],
 [P('M 160 60 L 260 160 L 160 260 L 60 260 L 60 160 Z','back'),P('M 160 60 L 160 160 L 60 160 Z'),P('M 160 60 L 260 160 L 160 160 Z','light'),P('M 260 160 L 160 260 L 160 160 Z')],
 [P('M 160 60 L 260 160 L 160 260 L 60 160 Z'),C('M 160 60 L 160 260'),C('M 60 160 L 260 160')],
];
const secondFrames=[
 [P('M 110 110 L 210 110 L 260 160 L 160 260 L 60 160 Z'),P('M 110 110 L 210 110 L 160 160 Z','light')],
 [P('M 110 110 L 210 110 L 210 210 L 160 260 L 60 160 Z'),P('M 110 110 L 210 110 L 160 160 Z','light'),P('M 210 110 L 210 210 L 160 160 Z','dark')],
 [P('M 110 110 L 210 110 L 210 210 L 110 210 L 60 160 Z'),P('M 110 110 L 210 110 L 160 160 Z','light'),P('M 210 110 L 210 210 L 160 160 Z','dark'),P('M 210 210 L 110 210 L 160 160 Z','light')],
 [P('M 110 110 L 210 110 L 210 210 L 110 210 Z'),P('M 110 110 L 210 110 L 160 160 Z','light'),P('M 210 110 L 210 210 L 160 160 Z','dark'),P('M 210 210 L 110 210 L 160 160 Z','light'),C('M 110 110 L 210 210')],
];
const fortuneFinal=[P('M 160 64 L 250 155 L 160 185 L 70 155 Z'),P('M 160 64 L 160 185 L 70 155 Z','light'),P('M 70 155 L 160 185 L 160 272 L 90 218 Z','dark'),P('M 250 155 L 160 185 L 160 272 L 230 218 Z','light'),C('M 160 185 L 160 272')];
export const models=[
model('puppy','Floppy-eared puppy','First folds','peach','One square · 15 × 15 cm','A few simple folds turn a square into a little friend. Optional: draw a face at the end.','https://web-japan.org/kidsweb/virtual/origami/exploring02a.html',diamond,[
 step('Make a downward triangle.','Start white side up. Bring the top corner down to the bottom corner, matching both side edges.',down,['M 30 160 L 290 160'],['M 160 48 Q 225 145 160 275'],'Fold','The diagram recenters the folded triangle. Its long edge should now be at the top.'),
 step('Find the middle.','Bring the left corner to the right corner, press the vertical crease, then open back to the triangle.',[...down,C('M 160 100 L 160 220')],['M 160 100 L 160 220'],['M 55 110 Q 160 65 263 110'],'Crease & unfold'),
 step('Fold one ear down.','Make the diagonal fold shown across the left corner, bringing that point downward into an ear.',dogL,['M 140 100 L 73.33 133.33'],['M 45 104 Q 38 159 80 178']),
 step('Make the second ear.','Fold the right side point down, roughly matching the first ear.',dogE,['M 180 100 L 246.67 133.33'],['M 275 104 Q 282 159 240 178']),
 step('Tuck the chin behind.','Fold the bottom tip away from you along the short line. Press it flat on the back.',dogF,['M 136 196 L 184 196'],['M 160 218 Q 195 190 160 180'],'Fold behind'),
 step('Give your puppy a face.','The folding is complete. If you like, use a pen for eyes and a nose.',[...dogF,D('M 128 143 a 3 4 0 1 0 6 0 a 3 4 0 1 0 -6 0'),D('M 186 143 a 3 4 0 1 0 6 0 a 3 4 0 1 0 -6 0'),D('M 150 164 L 170 164 L 160 176 Z')],[],[],'Finish'),
]),
model('cup','Little paper cup','First folds','sage','One square · 15 × 15 cm','Two overlapping corners become a tiny open pocket. No scissors or glue.','https://web-japan.org/kidsweb/virtual/origami/exploring02b.html',diamond,[
 step('Fold a triangle, point up.','Place the white side up. Bring the bottom corner to the top corner and press the long bottom crease.',up,['M 30 160 L 290 160'],['M 160 275 Q 218 160 160 45']),
 step('Bring the left point across.','Fold the left point onto the right sloping edge. Adjust it until the new flap’s top edge is horizontal.',cupL,['M 110 150 L 140 220'],['M 48 216 Q 100 112 207 151']),
 step('Overlap from the right.','Fold the right point across to the left end of that horizontal edge.',cupR,['M 210 150 L 180 220'],['M 274 216 Q 215 112 113 151']),
 step('Lower the front top flap.','Fold only the front layer of the top point down over the two side flaps.',cupF,['M 110 150 L 210 150'],['M 160 104 Q 203 150 160 196']),
 step('Fold the back flap behind.','Fold the remaining top point away from you, over the back of the cup.',cupFlat,['M 110 150 L 210 150'],['M 160 104 Q 120 150 160 196'],'Fold behind'),
 step('Open the pocket.','Ease the front and back layers apart at the top. Gently squeeze the sides to open your little container.',cupOpen,[],['M 153 150 L 130 126','M 167 150 L 190 126'],'Open','The final diagram is a slightly tilted view of the opening.'),
]),
model('bookmark','Corner bookmark','Useful little things','lilac','One square · 15 × 15 cm','Fold a pocket that slips over a page corner. A useful first project.','https://wordsforlife.org.uk/activities/make-an-origami-bookmark/',diamond,[
 step('Start with an upward triangle.','With the white side facing you, bring the bottom point to the top point.',up,['M 30 160 L 290 160'],['M 160 275 Q 215 160 160 45']),
 step('Crease the left corner upward.','Bring the left corner to the top point. Crease, then unfold it back to the triangle.',[...up,C('M 100 160 L 160 220')],['M 100 160 L 160 220'],['M 45 218 Q 80 132 159 104'],'Crease & unfold'),
 step('Crease the right corner upward.','Bring the right corner to the top point, press, and unfold again.',[...up,C('M 100 160 L 160 220'),C('M 220 160 L 160 220')],['M 220 160 L 160 220'],['M 275 218 Q 240 132 161 104'],'Crease & unfold'),
 step('Make the pocket opening.','Fold only the front top point down to the middle of the bottom edge. Keep the back triangle upright.',bookmarkPocket,['M 100 160 L 220 160'],['M 160 104 Q 199 160 160 216']),
 step('Lift the left corner again.','Use its existing crease to fold the left corner up to the top point.',markLeft,['M 100 160 L 160 220'],['M 45 218 Q 80 132 159 104']),
 step('Tuck that tip inside.','Bend the raised left tip downward and slide it inside the pocket made in step 4.',[P('M 160 100 L 280 220 L 160 220 L 100 160 Z'),P('M 100 160 L 160 220 L 160 160 Z','light'),C('M 100 160 L 220 160')],['M 100 160 L 160 160'],['M 160 104 Q 135 158 157 199'],'Tuck'),
 step('Lift the right corner.','Use its diagonal crease to bring the remaining right corner up to the top point.',markDiamond,['M 220 160 L 160 220'],['M 274 216 Q 230 131 163 105']),
 step('Tuck the right tip inside.','Bend the raised right tip downward and slide it into the same pocket. Flatten gently.',[P('M 160 100 L 220 160 L 160 220 L 100 160 Z'),P('M 100 160 L 220 160 L 160 220 Z','light')],['M 160 160 L 220 160'],['M 165 107 Q 194 165 164 198'],'Tuck'),
 step('Turn the pocket over.','Turn the model over and rotate it so the opening fits a page corner. Slide the corner of a page between the layers.',markFinal,[],[],'Finish','The finished diagram is enlarged. Do not unfold the tucked corners.'),
]),
model('hat','Paper captain’s hat','Paper classics','butter','One rectangle · A4 or US Letter','A classic paper hat. Printer paper makes a small model; a larger sheet makes a larger hat.','https://www.origami-fun.com/origami-hat.html',rect,[
 step('Find the vertical center.','Hold the rectangle upright. Fold the left edge to the right edge, crease, then open it.',[...rect,C('M 160 20 L 160 300')],['M 160 20 L 160 300'],['M 65 155 Q 160 95 255 155'],'Crease & unfold'),
 step('Fold the top half down.','Bring the top short edge to the bottom short edge. Keep the folded edge at the top.',half,['M 60 160 L 260 160'],['M 155 26 Q 220 162 155 294']),
 step('Fold the upper-left corner inward.','Bring the top-left corner down so its top edge lies on the center crease.',roofL,['M 60 200 L 160 100'],['M 65 106 Q 110 164 155 197']),
 step('Match it on the right.','Fold the upper-right corner to the same center crease. A strip should remain below the roof.',roof,['M 160 100 L 260 200'],['M 255 106 Q 210 164 165 197']),
 step('Fold half the front strip upward.','Lift only the front layer of the lower strip. Bring its lower edge up to the base of the triangles.',[...roof,P('M 60 200 L 260 200 L 260 220 L 60 220 Z','light')],['M 60 220 L 260 220'],['M 158 237 Q 195 221 158 202']),
 step('Roll that brim up once more.','Fold the doubled front strip upward again over the bottom of the triangles.',hatFront,['M 60 200 L 260 200'],['M 158 218 Q 190 200 158 184']),
 step('Turn the whole hat over.','Flip it left to right without unfolding it. The remaining long strip is now facing you.',roof,[],[],'Turn over'),
 step('Raise half the remaining strip.','Fold the bottom edge of the strip up to the base of the triangles.',[...roof,P('M 60 200 L 260 200 L 260 220 L 60 220 Z','light')],['M 60 220 L 260 220'],['M 158 237 Q 195 221 158 202']),
 step('Fold the second brim again.','Roll that doubled strip upward once more. Both sides now have narrow brims.',hat,['M 60 200 L 260 200'],['M 158 218 Q 190 200 158 184']),
 step('Open your hat.','Separate the two layers along the bottom opening. Gently spread them into a hat shape.',[P('M 60 205 L 160 85 L 260 205 Z'),P('M 45 204 L 246 185 L 275 218 L 66 240 Z','light'),P('M 66 240 L 275 218 L 235 236 L 92 253 Z','dark')],[],[],'Open'),
]),
model('boat','Little paper boat','Paper classics','blue','One rectangle · A4 or US Letter','A paper hat becomes a diamond, then opens into a boat. Take the opening steps slowly.','https://www.origami-fun.com/origami-boat.html',rect,[
 step('Mark the center.','Fold the upright rectangle left edge to right edge, then open.',[...rect,C('M 160 20 L 160 300')],['M 160 20 L 160 300'],['M 65 150 Q 160 95 255 150'],'Crease & unfold'),
 step('Fold the top edge down.','Match the top short edge to the bottom short edge. Keep the closed edge at the top.',half,['M 60 160 L 260 160'],['M 160 26 Q 220 162 160 294']),
 step('Bring the top-left corner inward.','Fold the upper-left corner to the center line, making half a roof.',roofL,['M 60 200 L 160 100'],['M 65 106 Q 110 164 155 197']),
 step('Bring in the top-right corner.','Match the other corner to the same center line.',roof,['M 160 100 L 260 200'],['M 255 106 Q 210 164 165 197']),
 step('Raise the front lower strip.','Fold only the front lower strip up over the base of the roof. Tuck its overhanging corners around the triangle edges.',brim,['M 60 200 L 260 200'],['M 160 236 Q 200 201 160 169']),
 step('Turn the paper over.','Flip the model left to right without opening the folds. Keep the point at the top.',roof,[],[],'Turn over'),
 step('Raise the back strip too.','Fold the remaining lower strip upward, wrapping its corners around the edges.',[P('M 60 200 L 160 100 L 260 200 Z'),P('M 100 160 L 220 160 L 260 200 L 60 200 Z','light')],['M 60 200 L 260 200'],['M 160 237 Q 199 200 160 164']),
 step('Open the bottom into a diamond.','Put your thumbs into the bottom opening. Pull the front and back apart, bring the side corners together, and flatten as a diamond.',boatDiamond,[],['M 147 213 L 100 213','M 173 213 L 220 213'],'Open & flatten','The corners that were at the left and right now lie together at the bottom.'),
 step('Lift the front bottom point.','Fold only the front lower point up to meet the top point.',boatOne,['M 70 160 L 250 160'],['M 160 245 Q 213 160 160 76']),
 step('Turn the diamond over.','Flip it left to right, keeping the upper point at the top. The remaining lower flap faces you.',boatDiamond,[],[],'Turn over'),
 step('Raise the remaining lower point.','Fold the bottom point to the top point. You now have a small triangle.',boatTriangle,['M 70 160 L 250 160'],['M 160 245 Q 213 160 160 76']),
 step('Open and flatten once more.','Open the bottom of this smaller triangle. Bring the two side corners together and flatten into a smaller diamond.',boatSmall,[],['M 149 157 L 110 175','M 171 157 L 210 175'],'Open & flatten'),
 step('Pull the two upper tips apart.','Find the two separate points at the top of the diamond. Gently pull them outward in opposite directions.',boatFinal,[],['M 155 97 Q 104 109 57 175','M 165 97 Q 216 109 263 175'],'Pull open'),
 step('Set the hull into shape.','Open the underside slightly with your fingers. Press the base gently so the boat can stand.',boatFinal,[],[],'Finish','The final diagram is a side view; the center triangle rises above the hull.'),
]),
model('fortune-teller','Fortune teller','Play & share','pink','One square · 20 × 20 cm','Four pockets for your fingers and plenty of room for secret messages.','https://origami-resource-center.com/fortune-teller/',square,[
 step('Find the first diagonal.','Fold one corner onto the opposite corner, then open the paper.',[...square,C('M 60 60 L 260 260')],['M 60 60 L 260 260'],['M 253 67 Q 180 130 67 253'],'Crease & unfold'),
 step('Mark the other diagonal.','Fold the other pair of opposite corners together, then open. The two creases cross at the center.',[...square,C('M 60 60 L 260 260'),C('M 260 60 L 60 260')],['M 260 60 L 60 260'],['M 68 67 Q 150 130 252 253'],'Crease & unfold'),
 step('Fold the top-left corner to the center.','Bring the first corner to the crease intersection.',firstFrames[0],['M 160 60 L 60 160'],['M 65 65 L 155 155']),
 step('Bring in the top-right corner.','Place the second point at the same center intersection.',firstFrames[1],['M 160 60 L 260 160'],['M 255 65 L 165 155']),
 step('Bring in the bottom-right corner.','Fold the third corner to the center.',firstFrames[2],['M 260 160 L 160 260'],['M 255 255 L 165 165']),
 step('Bring in the last corner.','Fold the bottom-left point in. All four points meet in the middle.',firstFrames[3],['M 160 260 L 60 160'],['M 65 255 L 155 165']),
 step('Turn the whole model over.','Flip it left to right without opening the folded corners. Keep a point at the top.',[P('M 160 60 L 260 160 L 160 260 L 60 160 Z','back')],[],[],'Turn over'),
 step('Fold the top point to the center.','Start a second set of corner folds on this side.',secondFrames[0],['M 110 110 L 210 110'],['M 160 65 L 160 155']),
 step('Fold the right point inward.','Bring the right point to the middle.',secondFrames[1],['M 210 110 L 210 210'],['M 255 160 L 165 160']),
 step('Fold the bottom point inward.','Bring the bottom point to the middle.',secondFrames[2],['M 210 210 L 110 210'],['M 160 255 L 160 165']),
 step('Fold the left point inward.','Bring the final point to the middle to finish a smaller square.',secondFrames[3],['M 110 210 L 110 110'],['M 65 160 L 155 160']),
 step('Flex it in both directions.','Fold the little square in half top to bottom and reopen. Repeat left to right and reopen.',[...secondFrames[3],C('M 110 160 L 210 160'),C('M 160 110 L 160 210')],['M 110 160 L 210 160','M 160 110 L 160 210'],[],'Crease & unfold'),
 step('Open the four finger pockets.','On the back, slip a thumb or forefinger under each square flap. Bring your fingertips together so the center rises.',fortuneFinal,[],[],'Open','The illustration now shows the raised model rather than a flat top view.'),
 step('Add your own messages.','Take it off your fingers to decorate the four outside flaps. Add numbers and messages inside, then open and close it to play.',fortuneFinal,[],[],'Finish'),
]),
];
export const modelById=new Map(models.map(m=>[m.id,m]));
