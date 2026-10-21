import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as E from '../engine.js';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const settle=s=>{let n=0;while(s.pending||s.lastResult){assert.ok(++n<20);if(s.lastResult)E.acknowledge(s,{deferExtra:true});else E.chooseEvent(s,0);}};
function clean(){const s=E.newGame('career',23);settle(s);return s;}
function insured(){const s=clean(),p=s.clients[0];Object.assign(p,{known:3,trust:80,ready:0});s.skill=60;E.action(s,'offer',p.id,{product:p.need,deferStories:true});settle(s);return s;}

test('asking how pay works has no surprise penalty; legacy rules and recorded choices stay intact',()=>{
 const s=E.newGame('career',23),before=s.regard;E.chooseEvent(s,0);assert.equal(s.regard,before);assert.equal(s.skill,19);
 const old=E.newGame('career',23);old.flags=[];E.chooseEvent(old,0);assert.equal(old.regard,34);
 assert.deepEqual(E.importSave(E.exportSave(old)),old);
});
test('button previews exactly match discovery, trust and capped professional gains',()=>{
 for(const type of ['follow','visit'])for(const known of [0,2,3])for(const trust of [30,98,100])for(const skill of [20,40,100])for(const mood of [20,80]){
  const s=clean(),p=s.clients[0];Object.assign(p,{known,trust});s.skill=skill;s.mood=mood;
  const save=E.exportSave(s),preview=E.contactPreview(s,p,type);assert.equal(E.exportSave(s),save);
  E.action(s,type,p.id,{deferStories:true});assert.ok(preview.includes(`信任 +${p.trust-trust}`));
  assert.ok(preview.includes(p.known>known?`了解 ${p.known-known} 项资料`:'核对已有资料'));assert.equal(preview.includes('专业 +1'),s.skill>skill);
 }
});
test('a same-day sale names the next day service instead of claiming all work is completed',()=>{
 const s=insured();s.day=28;s.clients[0].lastContact=28;
 // All other customers are already contacted today so service is the remaining pending item.
 for(const c of s.clients)c.lastContact=28;s.daily.call=1;s.ap=1;s.skill=100;
 const before=E.exportSave(s),brief=E.dayBrief(s);assert.equal(brief.canFinish,true);assert.match(brief.next,/吴师傅今天已联系，明天再做首次回访/);assert.doesNotMatch(brief.next,/全部.*完成/);assert.equal(E.exportSave(s),before);
 s.day=30;s.clients[0].lastContact=30;assert.doesNotMatch(E.serviceTiming(s,s.clients[0]),/明天|31/);
});
test('clean novice guidance finishes all thirty days and only recommends executable actions',()=>{
 for(const origin of ['career','graduate']){
  const s=E.newGame(origin,23),days=[],counts={};
  while(s.phase!=='ended'){
   settle(s);let guard=0;
   while(++guard<20){const before=E.exportSave(s),b=E.dayBrief(s);assert.equal(E.exportSave(s),before);if(!b.action){assert.ok(b.canFinish);break;}
    assert.equal(E.actionReason(s,b.action,b.clientId||undefined),'',b.next);counts[b.action]=(counts[b.action]??0)+1;
    const p=s.clients.find(p=>p.id===b.clientId);E.action(s,b.action,p?.id,{product:p?.need,approach:'honest',deferStories:true});settle(s);
   }
   assert.ok(guard<20);days.push({day:s.day,premium:s.premium,ap:s.ap,hint:E.dayBrief(s).next});E.endDay(s);settle(s);assert.equal(s.phase,'night');assert.deepEqual(E.importSave(E.exportSave(s)),s);E.nextDay(s);
  }
  assert.equal(days.length,30);assert.equal(s.ending.id,'steady');assert.ok(s.policies.every(p=>p.serviced));assert.ok(s.policies.every(p=>!p.self));assert.equal(s.seen.filter(id=>/^d\d+$/.test(id)).length,30);assert.match(s.ending.body,/没有遗漏/);
 }
});
test('closing referrals explicitly reserve contact for tomorrow and persist through a closing save',()=>{
 const s=clean();s.day=15;s.seen.push('d10');s.extra.decisions.d10={choice:0,day:10};s.pending='x-plan';s.daily.closing=1;
 E.chooseEvent(s,0);assert.match(s.lastResult.text,/杨阿姨.*明天可接洽/);assert.match(E.tomorrowBrief(s),/明天可接洽：杨阿姨/);assert.deepEqual(E.importSave(E.exportSave(s)),s);
});
test('post-target continuation keeps old fields byte-identical and reflects real completed vs skipped service',()=>{
 const raw=readFileSync(new URL('./fixtures/novice-day21.json',import.meta.url),'utf8');
 const original=JSON.parse(raw).state,s=E.importSave(raw);assert.deepEqual(s,original);const b=E.dayBrief(s);assert.match(b.focus,/已达标/);
 function finish(service){const n=E.copy(s);while(n.phase!=='ended'){settle(n);if(service)for(const p of n.policies)if(!p.self&&!p.serviced&&!E.actionReason(n,'service',p.client)){E.action(n,'service',p.client,{deferStories:true});settle(n);}E.endDay(n);settle(n);E.nextDay(n);}return n;}
 const skipped=finish(false),done=finish(true);assert.match(skipped.ending.body,/1 份尚未完成（赵老师）/);assert.match(done.ending.body,/没有遗漏/);assert.equal(skipped.ending.id,done.ending.id);assert.equal(skipped.premium,done.premium);assert.match(done.ending.epilogues.join(' '),/首次回访已经核对|理赔协助已办结/);
});

test('all shipped JavaScript parses before publication',()=>{for(const file of ['app.js','engine.js','content.js','data.js','input.js'])execFileSync(process.execPath,['--check',fileURLToPath(new URL('../'+file,import.meta.url))]);});
