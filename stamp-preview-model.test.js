import test from 'node:test';
import assert from 'node:assert/strict';
import {stampGeometry} from './stamp-preview-model.js';
test('preview geometry prints at the requested CSS size and angle on desktop and mobile',()=>{
  for(const displayWidth of [200,220,280])for(const size of [24,52,100])for(const angle of [-45,0,33,45]){
    const mark=stampGeometry(String(size),String(angle),660,displayWidth);
    assert.ok(Math.abs(mark.size*displayWidth/660-size)<1e-9);
    assert.equal(mark.angle,angle);
  }
});
test('geometry remains finite while the hidden character has no display width',()=>{
  const mark=stampGeometry(52,-15,660,0);assert.ok(Number.isFinite(mark.size));assert.equal(mark.angle,-15);
});
