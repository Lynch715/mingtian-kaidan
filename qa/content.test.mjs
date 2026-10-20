import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {newGame,action,chooseEvent,acknowledge,endDay,nextDay,exportSave,importSave,storyFor,actionReason} from './legacy-engine.mjs';
import {EXTRA_EVENTS,nextExtraEvent,claimSummary} from '../content.js';
import {LEADS,DAYS,SIDE_EVENTS} from '../data.js';
const round=s=>assert.deepEqual(importSave(exportSave(s)),s);
function settle(s,pick=()=>0){let count=0;while(s.pending||s.lastResult){assert.ok(++count<15,'dialog cycle');round(s);if(s.lastResult)acknowledge(s);else chooseEvent(s,pick(s.pending));}round(s);}
function advance(s,to,pick){while(s.day<to){settle(s,pick);endDay(s);settle(s);round(s);nextDay(s);}settle(s,pick);}
function insured(){const s=newGame('career',17);settle(s);const p=s.clients.find(p=>p.id==='wu');Object.assign(p,{known:3,trust:80,ready:0});s.skill=60;action(s,'offer','wu',{product:'accident'});settle(s);return s;}
function prepareEvent(s,id){assert.equal(nextExtraEvent(s),id);acknowledge(s);assert.equal(s.pending,id);round(s);}
function legacyState(raw){const d=JSON.parse(raw);delete d.state.extra;return d;}
test('eleven additional scenes have unique ids and complete two-choice text',()=>{
 assert.equal(EXTRA_EVENTS.length,11);assert.equal(new Set([...DAYS,...SIDE_EVENTS,...EXTRA_EVENTS].map(e=>e.id)).size,56);
 for(const e of EXTRA_EVENTS){assert.ok(e.body.trim().length>0,e.id);assert.equal(e.choices.length,2);for(const c of e.choices){assert.ok(c.label.length>5);assert.ok(c.text.length>30);}}
});
test('each of four exclusive scenes triggers only for an unlocked, contacted, unserved client',()=>{
 for(const id of ['wu','chen','lu','tang']){
  const s=newGame();settle(s);s.day=3;s.extra.decisions={};
  if(!s.clients.some(p=>p.id===id))s.clients.push({...LEADS.find(p=>p.id===id),trust:25,known:0,stage:'new',met:0,lastContact:0,offerDay:0,unlocked:2,notes:[],served:0,source:'社区'});
  const p=s.clients.find(p=>p.id===id);assert.equal(nextExtraEvent(s),null);
  p.known=1;p.stage='talking';prepareEvent(s,'x-'+id);const before=p.trust;chooseEvent(s,0);assert.ok(p.trust>before);assert.match(p.notes[0].text,new RegExp(storyFor({...s,pending:'x-'+id}).title));settle(s);assert.equal(nextExtraEvent(s),null);
  p.stage='sold';s.day++;assert.equal(nextExtraEvent(s),null);
 }
});
test('additional scenes do not consume an extra contact or time slot and both choices are playable',()=>{
 for(const choice of [0,1]){const s=newGame();settle(s);s.day=3;action(s,'follow','wu');assert.equal(s.pending,null);acknowledge(s);assert.equal(s.pending,'x-wu');const ap=s.ap,contact=s.clients[0].lastContact;chooseEvent(s,choice);settle(s);assert.equal(s.ap,ap);assert.equal(s.clients[0].lastContact,contact);assert.ok(actionReason(s,'follow','wu'));}
});
test('only one additional scene can resolve each day and it never replaces a pending original scene',()=>{
 const s=newGame();settle(s);s.day=2;for(const p of s.clients){p.known=1;p.stage='talking';}
 s.pending='d2';assert.equal(nextExtraEvent(s),null);settle(s);assert.equal(s.seen.filter(id=>id.startsWith('x-')).length,1);assert.ok(!s.seen.includes('x-chen'));
 s.day=3;prepareEvent(s,'x-chen');settle(s);assert.ok(s.seen.includes('x-chen'));
});
test('family-list consequences arrive across days and respect both earlier choices',()=>{
 for(const choice of [0,1]){const t=newGame();settle(t);endDay(t);settle(t);nextDay(t);chooseEvent(t,choice);settle(t);advance(t,4);assert.ok(!t.seen.includes('x-family'));advance(t,5);assert.ok(t.seen.includes('x-family'));
 const body=storyFor({...t,pending:'x-family'}).body;assert.match(body,choice===1?/填满的亲友表/:/愿意继续联系的人/);round(t);}
});
test('honest and overstated plans produce different later text and resources',()=>{
 const states=[];for(const choice of [0,1]){const s=newGame();advance(s,9);endDay(s);settle(s);nextDay(s);chooseEvent(s,choice);settle(s);advance(s,13);const n=s.clients.length;advance(s,14);assert.ok(s.seen.includes('x-plan'));assert.equal(s.clients.length,n+(choice===0?1:0));states.push(s);}
 assert.match(storyFor({...states[0],pending:'x-plan'}).body,/记录接得上/);assert.match(storyFor({...states[1],pending:'x-plan'}).body,/还没落实/);
});
test('helping Lin with her sister returns as an authorised referral; rest alone has a different follow-up',()=>{
 for(const choice of [0,1]){const s=newGame();advance(s,20);endDay(s);settle(s);nextDay(s);chooseEvent(s,choice);settle(s);advance(s,23);const n=s.clients.length;advance(s,24);assert.ok(s.seen.includes('x-lin'));assert.equal(s.clients.length,n+(choice===0?1:0));assert.match(storyFor({...s,pending:'x-lin'}).body,choice===0?/同意|愿意/:/姐姐的问题还没回完/);}
});
test('claim eligibility requires the matching active policy and enough remaining days',()=>{
 const s=newGame();settle(s);s.day=12;s.extra.decisions={};assert.equal(nextExtraEvent(s),null);
 const insuredState=insured();insuredState.day=12;insuredState.extra.decisions={};const p=insuredState.policies[0];
 for(const change of [{risk:true},{product:'medical'},{status:'complaint'},{status:'cancelled'}]){const t=structuredClone(insuredState);Object.assign(t.policies[0],change);assert.notEqual(nextExtraEvent(t),'x-claim-report');}
 insuredState.day=25;assert.notEqual(nextExtraEvent(insuredState),'x-claim-report');insuredState.day=12;assert.equal(nextExtraEvent(insuredState),'x-claim-report');
});
test('complete documents and supplement routes finish the claim across separate days',()=>{
 for(const choice of [0,1]){const s=insured(),steps=[];advance(s,11);const basePremium=s.premium;
 advance(s,20,id=>{if(id.startsWith('x-claim-'))steps.push({id,day:s.day});return id==='x-claim-materials'?choice:0;});
 assert.equal(s.extra.claim.stage,'closed');assert.deepEqual(steps.map(e=>e.id),choice===0?['x-claim-report','x-claim-materials','x-claim-result']:['x-claim-report','x-claim-materials','x-claim-supplement','x-claim-result']);
 assert.ok(steps.every((e,i)=>i===0||e.day>steps[i-1].day));assert.equal(s.premium,basePremium);assert.equal(s.policies.length,1);assert.ok(s.ledger.every(e=>!e.label.includes('理赔')));assert.match(claimSummary(s,'wu'),/860/);assert.equal(claimSummary(s,'chen'),'');round(s);
 }
});
test('a claim starting on day 24 still finishes before month end on the slower route',()=>{
 const s=newGame();settle(s);advance(s,20);const p=s.clients[0];Object.assign(p,{known:3,trust:80,ready:0});s.skill=60;action(s,'offer','wu',{product:'accident'});settle(s);
 advance(s,30,id=>id==='x-claim-materials'?1:0);assert.equal(s.extra.decisions['x-claim-report'].day,24);assert.equal(s.extra.decisions['x-claim-result'].day,29);assert.equal(s.extra.claim.stage,'closed');endDay(s);settle(s);nextDay(s);round(s);
});
test('pending extra story and its result restore with no duplicated effects or extra leads',()=>{
 const s=newGame();advance(s,4);endDay(s);settle(s);nextDay(s);chooseEvent(s,0);acknowledge(s);assert.equal(s.pending,'x-family');
 const pending=importSave(exportSave(s));chooseEvent(pending,0);const applied=exportSave(pending);assert.throws(()=>chooseEvent(pending,0));assert.equal(exportSave(pending),applied);
 const restored=importSave(applied);acknowledge(restored);acknowledge(restored);assert.equal(restored.journal.filter(e=>e.title===EXTRA_EVENTS.find(e=>e.id==='x-family').title).length,1);round(restored);
});
test('all claim stages survive save/restore without repeated settlement',()=>{
 const s=insured();advance(s,11);while(s.day<=20){
 if(s.pending){round(s);const claim=s.pending.startsWith('x-claim-'),cash=s.cash,premium=s.premium;chooseEvent(s,s.pending==='x-claim-materials'?1:0);if(claim){assert.equal(s.cash,cash);assert.equal(s.premium,premium);}round(s);}
 else if(s.lastResult){const before=s.cash;const restored=importSave(exportSave(s));assert.equal(restored.cash,before);acknowledge(s);}
 else{endDay(s);settle(s);round(s);nextDay(s);}
 }assert.equal(s.extra.claim.stage,'closed');assert.equal(s.journal.filter(e=>e.title===EXTRA_EVENTS.find(e=>e.id==='x-claim-result').title).length,1);
});
test('legacy fixture preserves every original field, pending scene and account entry',()=>{
 const raw=readFileSync(new URL('./fixtures/day4-before-sale.json',import.meta.url),'utf8');const old=JSON.parse(raw);assert.equal(old.state.extra,undefined);const upgraded=importSave(raw),without=structuredClone(upgraded);delete without.extra;assert.deepEqual(without,old.state);assert.equal(upgraded.version,1);round(upgraded);
});
test('genuine original-engine story, result, night and ending saves preserve their history',()=>{
 const samples=JSON.parse(readFileSync(new URL('./fixtures/legacy-checkpoints.json',import.meta.url),'utf8'));
 for(const old of Object.values(samples)){
  const before=structuredClone(old.state),restored=importSave(JSON.stringify(old)),without=structuredClone(restored);delete without.extra;assert.deepEqual(without,before);assert.ok(restored.extra);round(restored);
 }
});
test('legacy flags restore only provable choices, never invent the old Lin choice',()=>{
 for(const choice of [0,1]){const s=newGame();advance(s,24,()=>choice);const old=legacyState(exportSave(s));old.state.seen=old.state.seen.filter(id=>!id.startsWith('x-'));const restored=importSave(JSON.stringify(old));assert.equal(restored.extra.decisions.d2.choice,choice);assert.equal(restored.extra.decisions.d10.choice,choice);assert.equal(restored.extra.decisions.d21,undefined);assert.ok(!restored.seen.includes('x-family'));}
});
test('malformed extra state and inconsistent claim checkpoints are rejected without touching the source',()=>{
 const s=insured();advance(s,20);const raw=exportSave(s);
 for(const edit of [e=>e.extra=null,e=>e.extra=[],e=>e.extra.decisions=[],e=>e.extra.decisions.fake={choice:0,day:1},e=>e.extra.decisions.d2.choice=5,e=>e.extra.decisions.d2.day=31,e=>e.extra.claim.policyId='missing',e=>e.extra.claim.stage='materials',e=>e.extra.claim.due='25',e=>e.extra.claim=null,e=>e.extra.claim=false,e=>e.extra.claim=0,e=>delete e.extra.decisions['x-claim-report'],e=>e.pending='x-claim-supplement']){const parsed=JSON.parse(raw);edit(parsed.state);assert.throws(()=>importSave(JSON.stringify(parsed)));assert.equal(exportSave(s),raw);}
});

test('an imported expansion checkpoint must satisfy actual trigger conditions',()=>{
 const base=newGame();settle(base);
 for(const id of ['x-wu','x-tang','x-family','x-plan','x-lin','x-claim-report','x-claim-materials']){
  const candidate=structuredClone(base);candidate.pending=id;
  assert.throws(()=>importSave(exportSave(candidate)),/存档内容不完整/);
 }
});
