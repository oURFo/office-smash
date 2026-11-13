import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {extraTools,backgrounds,colors,restoreState,purchase} from './shop-model.js';
import {profiles} from './combat-model.js';
const toolCatalog=Array.from({length:15},()=>['existing','',10,1]).concat(extraTools);
test('old saves retain coins, unlocked tools, hits and add new defaults',()=>{
  const state=restoreState({coins:621,owned:[0,1,14],hits:50,best:12});
  assert.equal(state.coins,621);assert.deepEqual(state.owned,[0,1,14]);
  assert.equal(state.hits,50);assert.equal(state.best,12);
  assert.deepEqual(state.ownedBackgrounds,['office']);assert.deepEqual(state.ownedColors,[]);
});
test('insufficient funds never unlock or deduct; buying the same item never double charges',()=>{
  const state=restoreState({coins:39});
  assert.deepEqual(purchase(state,'color','color-0'),{ok:false,reason:'funds',missing:1});
  assert.equal(state.coins,39);assert.deepEqual(state.ownedColors,[]);
  state.coins=40;assert.equal(purchase(state,'color','color-0').bought,true);
  assert.equal(state.coins,0);assert.equal(purchase(state,'color','color-0').bought,false);
  assert.equal(state.coins,0);assert.deepEqual(state.ownedColors,['color-0']);
});
test('all 10 tools, 5 scenes and 20 individual colors can be purchased and restored',()=>{
  const state=restoreState({coins:50000});let total=0;
  extraTools.forEach((item,i)=>{assert.ok(item[2]>0);assert.equal(purchase(state,'tool',i+15,toolCatalog).ok,true);total+=item[2];});
  backgrounds.slice(1).forEach(item=>{assert.ok(item.cost>0);assert.ok(purchase(state,'background',item.id).ok);total+=item.cost;});
  colors.forEach(item=>{assert.ok(item.cost>0);assert.ok(purchase(state,'color',item.id).ok);total+=item.cost;});
  state.background='space';state.color='color-19';
  const restored=restoreState(JSON.parse(JSON.stringify(state)));
  assert.equal(restored.coins,50000-total);assert.equal(restored.owned.length,12);
  assert.equal(restored.ownedBackgrounds.length,6);assert.equal(restored.ownedColors.length,20);
  assert.equal(restored.background,'space');assert.equal(restored.color,'color-19');
});
test('corrupt entries and locked selections are removed while paid unlocks remain',()=>{
  const state=restoreState({coins:-1,owned:[24,25,-1,1.5,24],ownedBackgrounds:['space','fake'],ownedColors:['color-2','color-99'],background:'night',color:'color-1'});
  assert.equal(state.coins,0);assert.deepEqual(state.owned,[0,1,24]);
  assert.deepEqual(state.ownedBackgrounds,['office','space']);assert.deepEqual(state.ownedColors,['color-2']);
  assert.equal(state.background,'office');assert.equal(state.color,null);
  const before=JSON.stringify(state);assert.equal(purchase(state,'color','invalid').ok,false);assert.equal(JSON.stringify(state),before);
});
test('every added tool has combat profile and vector art, all scenes have assets',()=>{
  assert.equal(toolCatalog.length,25);assert.equal(profiles.length,25);assert.equal(colors.length,20);
  assert.equal(new Set(colors.map(c=>c.hex)).size,20);
  for(let i=15;i<25;i++)assert.ok(existsSync(new URL(`./assets/tool-${i}.svg`,import.meta.url)));
  for(const bg of backgrounds.slice(1))assert.match(readFileSync(new URL(`./assets/bg-${bg.id}.svg`,import.meta.url),'utf8'),/<svg/);
});
