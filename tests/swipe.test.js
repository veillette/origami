import {test} from 'node:test';
import assert from 'node:assert/strict';
import {swipeDirection,setupSwipe} from '../src/swipe.js';
test('only deliberate horizontal swipes navigate',()=>{
 assert.equal(swipeDirection(-60,5),1); assert.equal(swipeDirection(60,5),-1);
 for(const [x,y] of [[49,0],[60,60],[0,100]]) assert.equal(swipeDirection(x,y),0);
});
test('gesture cancellation and scrolling do not advance; swipe fires once',()=>{
 const handlers={};const moves=[];
 setupSwipe({addEventListener:(name,fn)=>handlers[name]=fn},n=>moves.push(n));
 const touch=(x,y=0)=>({clientX:x,clientY:y,identifier:1});
 const start=()=>handlers.touchstart({touches:[touch(100)],target:{closest:()=>null}});
 const end=()=>handlers.touchend({touches:[],changedTouches:[touch(0)]});
 start();handlers.touchcancel();end();
 start();handlers.touchmove({touches:[touch(100,80)]});end();
 assert.deepEqual(moves,[]);
 start();end();end();assert.deepEqual(moves,[1]);
});
