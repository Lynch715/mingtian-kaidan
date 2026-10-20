import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {installZoomGuard} from '../input.js';
import * as E from './legacy-engine.mjs';
import {PRODUCTS} from '../data.js';
import {playRoute} from './month-route.mjs';
const guarded=()=>{const target=new EventTarget();installZoomGuard(target);return target;};
function input(type,props={},cancelable=true){const event=new Event(type,{cancelable});Object.assign(event,props);return event;}
test('two-finger touches are blocked at start and move',()=>{const t=guarded();for(const type of ['touchstart','touchmove']){const e=input(type,{touches:[{},{}]});t.dispatchEvent(e);assert.equal(e.defaultPrevented,true);}});
test('single-finger vertical and horizontal scrolling stays available',()=>{const t=guarded();for(const type of ['touchstart','touchmove'])for(const touches of [[{}],[]]){const e=input(type,{touches});t.dispatchEvent(e);assert.equal(e.defaultPrevented,false);}});
test('Safari gesture start and change are blocked',()=>{const t=guarded();for(const type of ['gesturestart','gesturechange']){const e=input(type);t.dispatchEvent(e);assert.equal(e.defaultPrevented,true);}});
test('trackpad pinch is blocked while ordinary wheel scrolling is unchanged',()=>{const t=guarded();for(const ctrlKey of [true,false]){const e=input('wheel',{ctrlKey});t.dispatchEvent(e);assert.equal(e.defaultPrevented,ctrlKey);}});
test('noncancelable touch events never throw',()=>{const t=guarded(),e=input('touchmove',{touches:[{},{}]},false);assert.doesNotThrow(()=>t.dispatchEvent(e));assert.equal(e.defaultPrevented,false);});
test('desktop, Apple and manifest icons exist with the declared PNG dimensions',()=>{
 const html=readFileSync(new URL('../index.html',import.meta.url),'utf8');assert.match(html,/maximum-scale=1/);assert.match(html,/user-scalable=no/);assert.match(html,/apple-touch-icon/);assert.match(html,/manifest.webmanifest/);
 const manifest=JSON.parse(readFileSync(new URL('../manifest.webmanifest',import.meta.url),'utf8'));assert.equal(manifest.start_url,'./');assert.equal(manifest.scope,'./');
 for(const [path,size]of [['assets/favicon-32.png',32],['assets/apple-touch-icon.png',180],...manifest.icons.map(i=>[i.src,Number(i.sizes.split('x')[0])])]){const b=readFileSync(new URL('../'+path,import.meta.url));assert.equal(b.subarray(1,4).toString(),'PNG');assert.equal(b.readUInt32BE(16),size);assert.equal(b.readUInt32BE(20),size);}
 for(const relative of [...html.matchAll(/(?:src|href)="([^"?#]+)(?:\?[^"#]*)?"/g)].map(m=>m[1]))assert.ok(existsSync(new URL('../'+relative,import.meta.url)),relative);
});
test('every chosen action on four normal month routes yields a visible result with true state changes',t=>{
 const days=new Set(),types=new Set();let actions=0;
 for(const origin of ['career','graduate'])for(const choice of [0,1]){
  const routeDays=new Set();
  const engine={...E,action(s,type,id,options){
   const before=structuredClone(s);const result=E.action(s,type,id,options);actions++;days.add(s.day);routeDays.add(s.day);types.add(type);
   assert.ok(s.lastResult?.title?.length>0);assert.ok(s.lastResult.text.trim().length>0);
   for(const change of s.lastResult.changes)assert.equal(change.delta,s[change.key]-before[change.key]);
   const restored=E.importSave(E.exportSave(s));assert.deepEqual(restored.lastResult,s.lastResult);assert.equal(restored.cash,s.cash);
   return result;
  }};
  playRoute(engine,PRODUCTS,origin,choice);assert.equal(routeDays.size,30,origin+choice);
 }
 assert.equal(days.size,30);assert.ok(actions>=120);t.diagnostic(JSON.stringify({actions,types:[...types]}));for(const type of ['call','community','study','rest','follow','visit','offer','service'])assert.ok(types.has(type),type);
});
test('home, relationship and capped-rest actions also provide explicit results without fictitious gains',()=>{
 const s=E.newGame('career',3);E.chooseEvent(s,0);E.acknowledge(s);
 for(const [type,id]of [['home'],['bond','friend'],['rest']]){s.energy=100;s.mood=100;E.action(s,type,id);assert.ok(s.lastResult.text.trim());assert.ok(!s.lastResult.changes.some(c=>['energy','mood'].includes(c.key)&&c.delta>0));E.acknowledge(s);}
});
