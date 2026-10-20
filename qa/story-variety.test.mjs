import test from 'node:test';
import assert from 'node:assert/strict';
import * as E from './legacy-engine.mjs';
import {PRODUCTS,DAYS} from '../data.js';
import {playRoute,mechanicalState} from './month-route.mjs';

test('normal thirty-day routes never replay a main, side or extra event',()=>{
 for(const origin of ['career','graduate'])for(const choice of [0,1]){
  const played=[];
  const engine={...E,chooseEvent(s,index){const story=E.storyFor(s);played.push({id:story.id,day:s.day});return E.chooseEvent(s,index);}};
  const result=playRoute(engine,PRODUCTS,origin,choice);
  assert.equal(new Set(played.map(e=>e.id)).size,played.length);
  assert.deepEqual(played.filter(e=>/^d\d+$/.test(e.id)).map(e=>[e.id,e.day]),DAYS.map(e=>[e.id,e.day]));
  assert.deepEqual(played.filter(e=>/^s\d+$/.test(e.id)).map(e=>e.id),Array.from({length:15},(_,i)=>'s'+(i+1)));
  assert.deepEqual(new Set(result.ending.seen),new Set(played.map(e=>e.id)));
 }
});

test('day 19 remains a separate job-scope question before, during and after a claim',()=>{
 for(const stage of [null,'materials','supplement','review','closed']){
  const s=E.newGame('career',9);s.day=19;s.pending='d19';
  // This is a read-only rendering matrix; claim validity and timing are covered by content tests.
  s.policies=[{client:'wu',status:'active'}];s.extra.claim=stage?{stage}:null;
  const before=structuredClone(s),scene=E.storyFor(s);
  assert.match(scene.body,/搬大件/);assert.match(scene.body,/现有保单的职业范围/);
  assert.doesNotMatch(scene.body,/材料清单|票据|费用明细|重新报案/);
  assert.deepEqual(s,before);
 }
});

test('the healthy-history question is distinct from comparison and identity verification, including sold variants',()=>{
 for(const sold of [false,true]){
  const s=E.newGame('career',9);if(sold)s.policies=[{client:'chen',status:'active'}];
  const scenes={};for(const id of ['d11','x-chen','d26']){s.pending=id;scenes[id]=E.storyFor(s);}
  assert.match(scenes.d11.body,/门诊/);assert.match(scenes['x-chen'].body,/两份产品说明/);assert.match(scenes.d26.body,/工号/);
  assert.doesNotMatch(scenes.d26.body,/还剩两行|剩下两项|还有两行/);
 }
});

test('the fee incident starts once and its later branches reach a new outcome',()=>{
 const s=E.newGame('career',9);s.pending='d5';assert.doesNotMatch(E.storyFor(s).body,/没解释清楚|缴费那页|得再.*算/);
 s.pending='d21';assert.match(E.storyFor(s).body,/期限只说了一半/);
 for(const choice of [0,1]){
  s.pending='x-lin';s.extra.decisions.d21={choice,day:21};const scene=E.storyFor(s);
  assert.match(scene.body,choice===0?/朋友想咨询/:/听她把那通电话打完/);
  assert.doesNotMatch(scene.body,/帮我看看漏了哪项|再帮她看一遍还缺什么/);
 }
});

test('pending main scenes survive save/restore and cannot resolve twice',()=>{
 // Complete normal routes supply valid pending checkpoints rather than forged save fields.
 for(const choice of [0,1]){
  const engine={...E,chooseEvent(s,index){
   if(/^d\d+$/.test(s.pending)){
    const imported=E.importSave(E.exportSave(s));
    const before=mechanicalState(s);assert.deepEqual(mechanicalState(imported),before);
    E.chooseEvent(imported,index);E.chooseEvent(s,index);
    assert.deepEqual(mechanicalState(imported),mechanicalState(s));
    const applied=E.exportSave(imported);assert.throws(()=>E.chooseEvent(imported,index));assert.equal(E.exportSave(imported),applied);
    return s.lastResult;
   }
   return E.chooseEvent(s,index);
  }};
  playRoute(engine,PRODUCTS,'career',choice);
 }
});
