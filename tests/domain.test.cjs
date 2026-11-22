const assert = require('node:assert/strict');
const test = require('node:test');
const {
  calculateAge, calculateGrowth, growthCategory, growthCurveValue,
  growthZScore, kpspClassification, interpretDenverRecap
} = require('../app/src/main/assets/www/domain.js');
const reference = require('../app/src/main/assets/www/clinical-data.js');

test('umur kalender dan tanggal tidak valid', () => {
  const age = (birthDate, examDate) => calculateAge({ birthDate, examDate });
  assert.equal(age('2024-01-31', '2024-02-29').fullMonths, 1);
  assert.equal(age('2024-02-29', '2024-02-29').chartAge, 0);
  assert.equal(age('2023-02-29', '2024-03-01'), null);
  assert.equal(age('2024-02-29', '2024-02-28'), null);
});

test('tabel WHO, konversi posisi, rentang LiLA, dan edema', () => {
  const child = { birthDate: '2020-01-01', sex: 'm' };
  const calc = (examDate, measures = {}) => calculateGrowth(child, {
    examDate, measures: { weight: 12, height: 86.5, arm: 11.5, head: null, position: 'height', oedema: false, ...measures }
  });
  assert.equal(calc('2022-01-01').corrected, 87.2);
  assert.equal(calc('2022-02-01', { position: 'length' }).corrected, 85.8);
  assert.equal(calc('2022-01-01').indexes.arm.status, '11,5 hingga kurang dari 12,5 cm');
  assert.equal(calc('2022-01-01', { arm: 12.5 }).indexes.arm.status, '12,5 cm atau lebih');
  assert.equal(calc('2025-01-01').indexes.arm.status, 'Ukuran tercatat · acuan penapisan 6–59 bulan');
  assert.equal(calc('2022-01-01', { oedema: true }).indexes.wfa.z, undefined);
  assert.equal(calc('2025-02-01').indexes.wfa.z, undefined);
  assert.equal(calc('2022-01-01').indexes.hcfa.status, 'Belum diukur');
  assert.equal(growthCategory('wfa', -2), 'Berat badan normal');
  assert.equal(growthCategory('proportion', -3.0001), 'Gizi buruk');
  for (const curve of Object.values(reference.growth)) {
    for (const rows of Object.values(curve)) {
      for (const row of [rows[0], rows[Math.floor(rows.length / 2)], rows.at(-1)]) {
        for (const score of [-3, -2, 0, 1, 2, 3]) {
          assert.ok(Math.abs(growthZScore(row, growthCurveValue(row, score), true) - score) < 1e-8);
        }
      }
    }
  }
});

test('KPSP mencakup 16 formulir dan batas interpretasinya', () => {
  assert.equal(reference.kpsp.groups.length, 16);
  assert.ok(reference.kpsp.groups.every(group => group.questions.length === 10));
  for (const [score, code] of [[0, 'P'], [6, 'P'], [7, 'M'], [8, 'M'], [9, 'S'], [10, 'S']]) {
    assert.equal(kpspClassification(score), code);
  }
});

test('rekap Denver membedakan keberatan menjalani tes dan kegagalan butir', () => {
  const item = (position, response) => ({ position, response });
  assert.equal(interpretDenverRecap([]).category, 'Normal');
  assert.equal(interpretDenverRecap([item('caution', 'F')]).category, 'Normal');
  assert.equal(interpretDenverRecap([item('delay', 'F')]).category, 'Suspect');
  assert.equal(interpretDenverRecap([item('delay', 'R')]).category, 'Untestable');
  assert.equal(interpretDenverRecap([item('caution', 'R'), item('caution', 'R')]).category, 'Untestable');
});
