const assert = require('node:assert/strict');
const test = require('node:test');
const { createVisitPersistence, createNativeRequest } = require('../app/src/main/assets/www/native-store.js');

const state = { version: 1, selected: null, children: [], visits: [] };

test('perubahan disalin sebelum antre, dengan revisi yang berurutan', async () => {
  const writes = [];
  const transport = async (action, args) => {
    if (action === 'load') return { revision: 3, state };
    writes.push(args);
    return { revision: args.revision + 1 };
  };
  const store = createVisitPersistence(transport);
  assert.equal(await store.load(), state);
  const draft = { ...state, selected: 'first' };
  const first = store.save(draft);
  draft.selected = 'second';
  const second = store.save(draft);
  await Promise.all([first, second]);
  assert.deepEqual(writes.map(w => [w.revision, w.state.selected]), [[3, 'first'], [4, 'second']]);
});

test('gagal simpan mempertahankan revisi dan menunda impor sampai perubahan disimpan ulang', async () => {
  let fail = true;
  const store = createVisitPersistence(async (action, args) => {
    if (action === 'save') {
      assert.equal(args.revision, 0);
      if (fail) throw Error('disk full');
      return { revision: 1 };
    }
    if (action === 'import') return { cancelled: true };
    throw Error('unexpected');
  });
  await assert.rejects(store.save(state), /disk full/);
  await assert.rejects(store.importLegacy(), /Simpan ulang/);
  fail = false;
  await store.save(state);
  assert.equal(await store.importLegacy(), null);
});

test('penghubung memasangkan respons sesuai ID dan meneruskan galat', async () => {
  const sent = [];
  const fake = { postMessage: value => sent.push(JSON.parse(value)) };
  const request = createNativeRequest(fake);
  const left = request('load');
  const right = request('print', { visitId: 'a', recordId: 'b' });
  fake.onmessage({ data: JSON.stringify({ id: sent[1].id, error: 'failed' }) });
  fake.onmessage({ data: JSON.stringify({ id: sent[0].id, result: state }) });
  assert.deepEqual(await left, state);
  await assert.rejects(right, /failed/);
});
