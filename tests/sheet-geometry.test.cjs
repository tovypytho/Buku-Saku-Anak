const assert = require('node:assert/strict');
const test = require('node:test');
const {
  constrainSheetPosition,
  anchorSheetZoom
} = require('../app/src/main/assets/www/sheet-geometry.js');

test('geser berhenti di tepi lembar yang diperbesar', () => {
  assert.equal(constrainSheetPosition(-972, 318, 848), -530);
  assert.equal(constrainSheetPosition(61, 318, 848), 0);
  assert.equal(constrainSheetPosition(-140, 318, 848), -140);
});

test('axis yang lebih sempit dari penampil dipusatkan kembali', () => {
  assert.equal(constrainSheetPosition(-972, 318, 318), 0);
  assert.equal(constrainSheetPosition(-800, 460, 448), 6);
});

test('cubit mempertahankan titik lembar di bawah tengah kedua jari', () => {
  const start = { scale: 0.25, x: -40, y: -80 };
  const from = { x: 120, y: 140 };
  const to = { x: 140, y: 125 };
  const next = anchorSheetZoom(start, 0.5, from, to);
  assert.equal((next.x + (from.x - start.x) / start.scale * next.scale), to.x);
  assert.equal((next.y + (from.y - start.y) / start.scale * next.scale), to.y);
  assert.deepEqual(anchorSheetZoom(start, start.scale, from), start);
});
