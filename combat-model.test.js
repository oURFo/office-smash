import test from 'node:test';
import assert from 'node:assert/strict';
import {injuryStage,addInjury,recoverInjury,profiles} from './combat-model.js';
test('rapid hits progress through all injury stages and cap damage',()=>{
  let damage=0;const seen=new Set([injuryStage(damage)]);
  for(let i=0;i<20;i++){damage=addInjury(damage,1);seen.add(injuryStage(damage));}
  assert.deepEqual([...seen],[0,1,2,3]);assert.equal(damage,100);
});
test('recovery passes all stages and reaches zero without going negative',()=>{
  let damage=100;const seen=new Set([injuryStage(damage)]);
  for(let i=0;i<140;i++){damage=recoverInjury(damage,.1);seen.add(injuryStage(damage));}
  assert.deepEqual([...seen],[3,2,1,0]);assert.equal(damage,0);
});
test('recovery depends on elapsed time and stronger tools cause more injury',()=>{
  assert.equal(recoverInjury(80,1),recoverInjury(recoverInjury(80,.5),.5));
  assert.ok(addInjury(0,12)>addInjury(0,1));assert.equal(profiles.length,25);
  assert.equal(new Set(profiles.map(p=>p[0])).size,25);
});
