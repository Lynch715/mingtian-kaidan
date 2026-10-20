import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as E from './legacy-engine.mjs';
import {PRODUCTS,DAYS,SIDE_EVENTS,DAY_FOCUS} from '../data.js';
import {EXTRA_EVENTS} from '../content.js';
import {playRoute} from './month-route.mjs';
function settle(s){let guard=0;while(s.pending||s.lastResult){assert.ok(++guard<15);if(s.lastResult)E.acknowledge(s);else E.chooseEvent(s,0);}}
function clean(){const s=E.newGame('career',23);settle(s);return s;}
function insured(){const s=clean();const p=s.clients[0];Object.assign(p,{known:3,trust:80,ready:0});s.skill=60;E.action(s,'offer','wu',{product:'accident'});settle(s);return s;}
const digest=s=>createHash('sha256').update(JSON.stringify(s)).digest('hex');
test('both origins and both story-choice routes preserve every day of pre-polish rules',()=>{
 const baseline=JSON.parse(readFileSync(new URL('./fixtures/month-polish-rule-baseline.json',import.meta.url),'utf8'));
 for(const route of baseline.routes){const result=playRoute(E,PRODUCTS,route.origin,route.choice);assert.deepEqual(result.days.map(digest),route.day_hashes,route.origin+'/'+route.choice);assert.equal(digest(result.ending),route.ending_hash);}
});
test('the existing month has thirty distinct day subjects and read-only daily guidance',()=>{
 assert.equal(DAYS.length,30);assert.equal(DAY_FOCUS.length,30);assert.equal(new Set(DAYS.map(e=>e.title)).size,30);assert.equal(new Set(DAY_FOCUS).size,30);
 const s=clean();for(let day=1;day<=30;day++){s.day=day;const before=E.exportSave(s),brief=E.dayBrief(s);assert.equal(brief.title,DAYS[day-1].title);assert.ok(brief.focus);assert.ok(brief.next);assert.equal(E.exportSave(s),before);}
 assert.equal(SIDE_EVENTS.length,15);assert.equal(EXTRA_EVENTS.length,11);s.day=3;s.ap=1;s.cash=-10;s.energy=50;s.daily.call=1;for(const p of s.clients)p.lastContact=s.day;assert.doesNotMatch(E.dayBrief(s).next,/安排社区/);
});
test('contact feedback shows actual discovered facts and trust, including capped gains',()=>{
 const s=clean();E.action(s,'follow','wu');assert.ok(s.lastResult.details.some(t=>t.includes('需求')&&t.includes('1/3')));assert.ok(s.lastResult.details.some(t=>t.includes('32 → 41')));settle(s);
 s.day=3;s.clients[0].lastContact=0;s.clients[0].trust=98;E.action(s,'visit','wu');assert.ok(s.lastResult.details.some(t=>t.includes('预算、顾虑')&&t.includes('3/3')));assert.ok(s.lastResult.details.some(t=>t.includes('信任 +2（98 → 100）')));assert.deepEqual(E.importSave(E.exportSave(s)),s);
});
test('learning announces a product qualification only when its threshold is crossed',()=>{
 const s=clean();s.skill=12;E.action(s,'study');assert.ok(s.lastResult.details.some(t=>t.includes('住院有底')));settle(s);E.action(s,'study');assert.ok(s.lastResult.details.every(t=>!t.includes('专业已达到')));
});
test('unsuccessful calls still show the real work record without inventing contacts',()=>{
 const s=E.newGame('career',3500);settle(s);E.action(s,'call');
 assert.equal(s.clients.length,4);assert.ok(s.lastResult.details.some(t=>t.includes('12 通')));assert.ok(s.lastResult.details.some(t=>t.includes('工作记录 +1')));assert.ok(s.lastResult.details.every(t=>!t.includes('客户本新增')));
});
test('support and premium milestones describe deferred rewards without crediting them early',()=>{
 const s=clean();s.work=19;const cash=s.cash;E.action(s,'study');assert.ok(s.lastResult.details.some(t=>t.includes('满 20 次')&&t.includes('月底')));assert.equal(s.cash,cash);assert.equal(s.ledger.length,0);
});
test('full-state rest never reports fabricated growth',()=>{
 const s=clean();s.energy=100;s.mood=100;E.action(s,'rest');assert.deepEqual(s.lastResult.changes,[]);assert.deepEqual(s.lastResult.details,[]);assert.match(s.lastResult.text,/都是满的/);
});
test('offer refusal explains professional and consideration constraints using current state',()=>{
 for(const reason of ['skill','time']){const s=clean(),p=s.clients.find(p=>p.id==='chen');Object.assign(p,{known:3,trust:80});s.skill=reason==='skill'?12:60;s.day=reason==='skill'?8:1;E.action(s,'offer','chen',{product:'medical'});assert.equal(s.policies.length,0);assert.match(s.lastResult.text,reason==='skill'?/需要专业 16.*当前是 12/:/最早第 6 天/);assert.ok(s.lastResult.details.some(t=>t.includes('信任 +4')));}
});
test('service feedback acknowledges completion and referrals, without new cash rewards',()=>{
 const s=insured();s.day=3;const cash=s.cash;E.action(s,'service','wu');assert.ok(s.lastResult.details.some(t=>t.includes('首次回访已完成')));assert.ok(s.lastResult.details.some(t=>t.includes('客户本新增')));assert.equal(s.cash,cash);
});
test('day 15 names the actual evening deduction and current balance before it is charged',()=>{
 for(const origin of ['career','graduate']){const s=E.newGame(origin,1);s.day=15;s.pending='d15';const before=s.cash,scene=E.storyFor(s);assert.match(scene.body,/今天晚上要扣/);assert.ok(scene.body.includes(String(origin==='career'?2200:1600)));assert.ok(scene.body.includes(String(before)));assert.equal(s.cash,before);}
});
test('sold clients, completed claims and existing self purchases get consistent daily scenes',()=>{
 const s=insured();s.pending='d6';assert.match(E.storyFor(s).body,/投保记录/);s.extra.claim={policyId:s.policies[0].id,stage:'closed',due:17};s.pending='d19';assert.match(E.storyFor(s).body,/现有保单的职业范围/);assert.doesNotMatch(E.storyFor(s).body,/补件|票据|重拍/);assert.equal(s.extra.claim.stage,'closed');
 s.pending=null;s.lastResult=null;E.buySelf(s,'accident');s.pending='d25';const scene=E.storyFor(s);assert.match(scene.body,/已经用过本月/);assert.match(scene.choices[1].label,/已购/);
});
test('night review reports the actions actually performed rather than generic monthly pressure',()=>{
 const s=clean();E.action(s,'follow','wu');settle(s);E.action(s,'study');settle(s);E.endDay(s);assert.match(s.night.review,/联系 1 位客户/);assert.match(s.night.review,/学习 1 次/);assert.doesNotMatch(s.night.review,/外呼|面谈/);assert.deepEqual(E.importSave(E.exportSave(s)),s);
});
test('legacy result and ending prose are preserved; malformed new feedback is rejected',()=>{
 const legacy=JSON.parse(readFileSync(new URL('./fixtures/legacy-checkpoints.json',import.meta.url),'utf8'));
 for(const old of [legacy.result,legacy.ended]){const restored=E.importSave(JSON.stringify(old));const copy=structuredClone(restored);delete copy.extra;assert.deepEqual(copy,old.state);}
 const s=clean();E.action(s,'follow','wu');for(const details of ['x',[{}],Array(31).fill('x')]){const d=JSON.parse(E.exportSave(s));d.state.lastResult.details=details;assert.throws(()=>E.importSave(JSON.stringify(d)),/存档内容不完整/);}
});
