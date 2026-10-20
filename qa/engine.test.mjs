import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,action,chooseEvent,acknowledge,endDay,nextDay,buySelf,exportSave,importSave,actionReason,progress,endingFor} from './legacy-engine.mjs';
import {DAYS,SIDE_EVENTS,PRODUCTS} from '../data.js';
function settle(s){let n=0;while(s.pending||s.lastResult){if(n++>10)throw Error('dialog cycle');if(s.lastResult)acknowledge(s);else chooseEvent(s,0);}}
function day(s){settle(s);endDay(s);settle(s);nextDay(s);}
function goodPlayer(origin,seed,policy='honest'){
 const s=newGame(origin,seed);
 while(s.phase!=='ended'){
 settle(s);let n=0;
 while(s.ap>0&&n++<15){
 let type,id,opts={};
 const service=s.clients.find(c=>!actionReason(s,'service',c.id)&&s.policies.some(p=>p.client===c.id&&!p.serviced&&p.status!=='cancelled'));
 const ready=s.clients.find(c=>!c.family&&!actionReason(s,'offer',c.id)&&c.known===3&&c.trust>=52&&s.skill>=PRODUCTS.find(p=>p.id===c.need).skill&&s.day>=c.unlocked+c.ready);
 const talk=s.clients.find(c=>!c.family&&!actionReason(s,'visit',c.id)&&c.known<3);
 const follow=s.clients.find(c=>!c.family&&!actionReason(s,'follow',c.id)&&(c.known<3||c.trust<52));
 if(s.energy<25&&!actionReason(s,'rest'))type='rest';
 else if(service){type='service';id=service.id;}
 else if(ready){type='offer';id=ready.id;opts={product:ready.need,approach:policy};}
 else if(talk){type='visit';id=talk.id;}
 else if(follow){type='follow';id=follow.id;}
 else if(s.skill<45&&!actionReason(s,'study'))type='study';
 else if(s.clients.length<12&&!actionReason(s,'community'))type='community';
 else if(!actionReason(s,'call')&&(s.daily.call??0)<1)type='call';
 else break;
 action(s,type,id,opts);settle(s);
 }
 endDay(s);settle(s);nextDay(s);
 const restored=importSave(exportSave(s));assert.deepEqual(restored,s);
 }
 return s;
}
test('30 daily scenes and 15 unique side scenes are complete',()=>{assert.equal(DAYS.length,30);assert.equal(SIDE_EVENTS.length,15);assert.equal(new Set([...DAYS,...SIDE_EVENTS].map(x=>x.id)).size,45);for(const [i,d]of DAYS.entries()){assert.equal(d.day,i+1);assert.ok(d.body.length>50);assert.ok(d.choices.length>=2);}});
test('30 days can finish without selling and no extra day or repeated settlement',()=>{const s=newGame('graduate',3);for(let i=1;i<=30;i++){assert.equal(s.day,i);day(s);}assert.equal(s.phase,'ended');assert.equal(s.day,30);assert.ok(s.ending);const cash=s.cash;assert.throws(()=>nextDay(s));assert.throws(()=>endDay(s));assert.equal(s.cash,cash);assert.equal(s.ledger.filter(x=>x.label==='房租及固定开支').length,1);assert.equal(s.ledger.filter(x=>x.label==='日常餐饮与交通').length,30);});
test('event and actions cannot resolve twice, choices cannot invent events',()=>{const s=newGame();assert.throws(()=>chooseEvent(s,7));chooseEvent(s,0);assert.throws(()=>chooseEvent(s,0));assert.throws(()=>action(s,'call'));acknowledge(s);action(s,'follow','wu');acknowledge(s);assert.throws(()=>action(s,'follow','wu'));});
test('honest sale: wrong product refuses, right product pays once after three days',()=>{const s=newGame('career',5);settle(s);const p=s.clients[0];p.known=3;p.trust=70;p.ready=0;s.skill=60;action(s,'offer',p.id,{product:'saving'});settle(s);assert.equal(s.premium,0);endDay(s);settle(s);nextDay(s);settle(s);action(s,'offer',p.id,{product:p.need});settle(s);assert.equal(s.premium,600);assert.equal(progress(s).receivable,150);for(let i=0;i<4;i++)day(s);assert.equal(s.ledger.filter(x=>x.label==='佣金到账').length,1);assert.equal(progress(s).receivable,0);});
test('mismatched pressure sale can be withdrawn by service; paid commission reverses',()=>{const s=newGame('career',5);settle(s);const p=s.clients.find(p=>p.id==='aunt');p.known=3;p.ready=0;s.skill=60;action(s,'offer',p.id,{product:'illness',approach:'pressure'});settle(s);for(let i=0;i<5;i++)day(s);settle(s);assert.equal(s.policies[0].status,'complaint');assert.equal(s.policies[0].paid,true);const cash=s.cash;action(s,'service',p.id);settle(s);assert.equal(s.premium,0);assert.equal(s.policies[0].status,'cancelled');assert.equal(s.cash,cash-1080);});
test('ignoring a complaint cancels automatically, clean sales stay active',()=>{const s=newGame();settle(s);const p=s.clients.find(p=>p.id==='aunt');p.known=3;p.ready=0;action(s,'offer',p.id,{product:'illness',approach:'pressure'});settle(s);for(let i=0;i<9;i++)day(s);assert.equal(s.policies[0].status,'cancelled');assert.equal(s.premium,0);assert.equal(s.ledger.filter(x=>x.label==='撤回佣金').length,1);});
test('self purchase pays upfront, cannot repeat, tracks ongoing burden',()=>{const s=newGame();settle(s);const before=s.cash;buySelf(s,'illness');assert.equal(s.cash,before-3600);assert.equal(s.renewal,3600);assert.equal(s.selfPremium,3600);acknowledge(s);assert.throws(()=>buySelf(s,'accident'));assert.equal(s.policies.length,1);});
test('negative cash never softlocks free actions or progression',()=>{const s=newGame();settle(s);s.cash=-100;assert.ok(actionReason(s,'community'));assert.equal(actionReason(s,'study'),'');action(s,'study');settle(s);day(s);assert.equal(s.day,2);});
test('invalid imports leave source unchanged and reject corrupted nested data',()=>{const s=newGame(),original=exportSave(s);for(const mutate of [d=>d.state.day=31,d=>d.state.energy='90',d=>d.state.clients[0].known=4,d=>d.state.clients[0].notes=[{}],d=>d.state.messages=[null],d=>d.state.pending='x',d=>d.state.premium=9999,d=>d.state.lastResult={title:'x'},d=>d.state.policies=[null]]){const d=JSON.parse(original);mutate(d);assert.throws(()=>importSave(JSON.stringify(d)));assert.equal(exportSave(s),original);}assert.throws(()=>importSave('invalid'));});
test('mid-dialog, night and ending states round-trip without rerunning effects',()=>{const s=newGame();assert.deepEqual(importSave(exportSave(s)),s);chooseEvent(s,0);assert.deepEqual(importSave(exportSave(s)),s);settle(s);endDay(s);assert.deepEqual(importSave(exportSave(s)),s);});
test('both origins have a viable full-month route without selling to friends or family',()=>{for(const origin of ['career','graduate'])for(const seed of [1,7,23,51,987]){const s=goodPlayer(origin,seed);assert.equal(s.phase,'ended');assert.ok(s.premium>=10000,`${origin}/${seed}: ${s.premium}`);assert.ok(s.cash>0);assert.ok(s.policies.every(p=>!['aunt','friend'].includes(p.client)));assert.ok(['steady','slow'].includes(s.ending.id),s.ending.id);assert.ok(s.integrity>=65);assert.ok(s.ap>=0);}});
test('randomized routes across 20 months stay finite and always finish',()=>{for(let seed=1;seed<=20;seed++){const s=newGame(seed%2?'career':'graduate',seed);let count=0;while(s.phase!=='ended'&&count++<400){settle(s);const acts=['call','study','rest','community','home'];const feasible=acts.filter(a=>!actionReason(s,a));if(s.ap&&feasible.length){const a=feasible[(seed+s.ap+s.day)%feasible.length];action(s,a);settle(s);}else{endDay(s);settle(s);nextDay(s);}}assert.equal(s.phase,'ended');assert.ok(Number.isFinite(s.cash));assert.deepEqual(importSave(exportSave(s)),s);}});
test('story dialogue respects prior purchases',async()=>{const {storyFor}=await import('./legacy-engine.mjs');const s=newGame();settle(s);const p=s.clients.find(x=>x.id==='chen');p.known=3;p.trust=90;p.ready=0;s.skill=80;action(s,'offer','chen',{product:'medical'});settle(s);s.pending='d22';const story=storyFor(s);assert.match(story.body,/已经买好/);assert.match(story.choices[1].label,/介绍一个朋友/);s.pending='d26';assert.doesNotMatch(storyFor(s).body,/还没决定/);});
test('low mood has a measurable but recoverable effect on conversation',()=>{const a=newGame('career',42),b=newGame('career',42);settle(a);settle(b);a.mood=10;b.mood=70;action(a,'follow','wu');action(b,'follow','wu');assert.ok(a.clients[0].trust<b.clients[0].trust);settle(a);action(a,'rest');assert.equal(a.mood,18);});
