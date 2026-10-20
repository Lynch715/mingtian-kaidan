import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as E from '../engine.js';
import {PRODUCTS,SIDE_EVENTS,LEADS} from '../data.js';
import {playRoute} from './month-route.mjs';
const round=s=>assert.deepEqual(E.importSave(E.exportSave(s)),s);
function settle(s,pick=0){let guard=0;while(s.pending||s.lastResult){assert.ok(++guard<20);round(s);if(s.lastResult)E.acknowledge(s);else E.chooseEvent(s,pick);}round(s);}
function clean(){const s=E.newGame('graduate',23);settle(s);return s;}
function close(s,pick=0){E.endDay(s);settle(s,pick);assert.equal(s.phase,'night');E.nextDay(s);}

test('all 30 main stories and 15 side stories appear once, including zero-action days',()=>{
 for(const pick of [0,1]){const s=E.newGame('graduate',7);for(let day=1;day<=30;day++){settle(s,pick);assert.equal(s.ap,6);close(s,pick);}
 assert.equal(s.phase,'ended');assert.equal(s.seen.filter(id=>/^d\d+$/.test(id)).length,30);assert.deepEqual(s.seen.filter(id=>/^s\d+$/.test(id)),SIDE_EVENTS.map(e=>e.id));
 assert.equal(s.ledger.filter(x=>x.label==='日常餐饮与交通').length,30);assert.equal(s.ledger.filter(x=>x.label==='房租及固定开支').length,1);round(s);}
});

test('normal routes spread sales across weeks, retain a viable honest ending, and round-trip every action',()=>{
 const results=[];
 for(const origin of ['graduate','career'])for(const choice of [0,1])for(const seed of [1,7,23,51,987]){
  const engine={...E,newGame:()=>E.newGame(origin,seed),action(s,...args){const r=E.action(s,...args);round(s);return r;},chooseEvent(s,...args){const r=E.chooseEvent(s,...args);round(s);return r;}};
  const r=playRoute(engine,PRODUCTS,origin,choice),s=r.ending;
  assert.equal(s.phase,'ended');assert.equal(s.ending.id,'steady');assert.ok(s.cash>0);assert.ok(s.premium>=10000);assert.ok(s.policies.every(p=>!p.self&&!['aunt','friend'].includes(p.client)));
  const reached=r.days.find(d=>d.premium>=10000).day;assert.ok(reached>=20&&reached<=26,`${origin}/${seed}/${choice}: target day ${reached}`);
  assert.ok(s.policies.some(p=>p.day>=25));assert.ok(r.days[14].skill<100);assert.ok(s.seen.includes('x-plan')&&s.seen.includes('x-lin'));assert.equal(s.seen.filter(id=>/^s\d+$/.test(id)).length,15);
  for(const week of [[1,7],[8,14],[15,21],[22,30]])assert.ok(s.policies.some(p=>p.day>=week[0]&&p.day<=week[1]),JSON.stringify(week));
  results.push({origin,seed,choice,targetDay:reached,premium:s.premium,cash:s.cash});
 }
 assert.equal(results.length,20);
});

test('an earlier sale milestone is never followed by a surprise side story when acknowledged',()=>{
 const s=clean(),p=s.clients[0];Object.assign(p,{known:3,trust:80,ready:0});E.action(s,'offer','wu',{product:'accident'});
 assert.deepEqual(s.lastResult.milestones,['第一份客户保单，办成了']);E.acknowledge(s);assert.equal(s.pending,null);assert.equal(s.phase,'day');
});

test('consideration dates are visible before spending, and the preview is read-only',()=>{
 const s=clean(),p=s.clients.find(p=>p.id==='chen');Object.assign(p,{known:3,trust:80});s.skill=20;s.day=4;
 const before=E.exportSave(s),preview=E.offerReadiness(s,p);assert.equal(preview.ready,false);assert.equal(preview.day,9);assert.match(preview.text,/最早第 9 天/);assert.equal(E.exportSave(s),before);
 s.day=10;s.skill=80;const wrong=E.offerReadiness(s,p,PRODUCTS.find(p=>p.id==='saving'));assert.equal(wrong.ready,false);assert.match(wrong.text,/需求不符/);assert.match(wrong.text,/超出已知预算/);
});

test('completed service cannot consume another action and each client receives a specific reply',()=>{
 const s=clean(),p=s.clients[0];Object.assign(p,{known:3,trust:80,ready:0});E.action(s,'offer','wu',{product:'accident'});settle(s);close(s);settle(s);E.action(s,'service','wu');assert.match(s.lastResult.text,/职业范围|申请材料/);settle(s);close(s);settle(s);
 assert.match(E.actionReason(s,'service','wu'),/首次回访已完成/);const before=E.exportSave(s);assert.throws(()=>E.action(s,'service','wu'));assert.equal(E.exportSave(s),before);
});

test('full contact books receive a truthful plan and Lin follow-up, with no phantom referral',()=>{
 const route=playRoute(E,PRODUCTS,'graduate',0),s=route.ending;
 for(const id of ['x-plan','x-lin']){const scene=E.storyFor({...structuredClone(s),pending:id}),first=scene.choices[0];assert.doesNotMatch(scene.body,/新咨询转给你|朋友想咨询/);assert.doesNotMatch(first.text,/新的联系再|接下咨询/);}
 assert.equal(s.clients.length,12);
});

test('old checkpoint fields and existing consideration dates are never migrated or replayed',()=>{
 const samples=JSON.parse(readFileSync(new URL('./fixtures/pre-pace-checkpoints.json',import.meta.url),'utf8'));
 for(const {save}of samples){const old=JSON.parse(save).state,s=E.importSave(save);assert.deepEqual(s,old);assert.equal(E.paced(s),false);const cash=s.cash,ledger=s.ledger.length;round(s);assert.equal(s.cash,cash);assert.equal(s.ledger.length,ledger);
  if(s.phase==='night'){E.nextDay(s);while(s.phase!=='ended'){settle(s);close(s);}round(s);assert.ok(s.seen.includes('d30'));}
 }
});

test('job-scope and completed-work stories give closure without inventing another pending task',()=>{
 const s=clean();s.pending='d19';assert.match(E.storyFor(s).choices[0].text,/这次问询已答复/);E.chooseEvent(s,0);assert.match(s.clients[0].notes[0].text,/这次问询已答复/);settle(s);s.pending='d29';assert.match(E.storyFor(s).choices[0].text,/目前没有客户保单需要回访|首次回访已经做完|可以交表/);
});

test('ordinary contact actions do not chain side stories; a queued closing survives save/load',()=>{
 const s=clean();close(s);settle(s);E.action(s,'follow','wu');E.acknowledge(s);assert.equal(s.pending,null);const cash=s.cash;E.endDay(s);assert.equal(s.phase,'day');assert.ok(s.pending);assert.equal(s.cash,cash);round(s);settle(s);assert.equal(s.phase,'night');assert.equal(s.cash,cash-45);const final=E.exportSave(s);assert.throws(()=>E.endDay(s));assert.equal(E.exportSave(s),final);
});

test('the UI also defers stories on an old save, without changing stored client dates or balances',()=>{
 const old=JSON.parse(readFileSync(new URL('./fixtures/pre-pace-checkpoints.json',import.meta.url),'utf8')).find(x=>x.origin==='graduate'&&x.day===4),s=E.importSave(old.save);
 E.nextDay(s);settle(s);const client=s.clients.find(p=>p.stage!=='sold'&&p.lastContact!==s.day),date=client.unlocked+client.ready,cash=s.cash;
 if(client){E.action(s,'follow',client.id,{deferStories:true});E.acknowledge(s,{deferExtra:true});assert.equal(s.pending,null);assert.equal(client.unlocked+client.ready,date);assert.equal(s.cash,cash);}
 close(s);round(s);
});

test('legacy players who stop doing extra actions still receive the remaining side stories',()=>{
 const old=JSON.parse(readFileSync(new URL('./fixtures/pre-pace-checkpoints.json',import.meta.url),'utf8')).find(x=>x.origin==='graduate'&&x.day===15),s=E.importSave(old.save);
 E.nextDay(s);while(s.phase!=='ended'){settle(s);close(s);}assert.equal(s.seen.filter(id=>/^s\d+$/.test(id)).length,15);round(s);
});
