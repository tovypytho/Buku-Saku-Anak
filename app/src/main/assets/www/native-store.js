/* The Android activity owns the database. The page keeps a working copy for rendering. */
function createVisitPersistence(request) {
  let revision = 0;
  let tail = Promise.resolve(true);

  const restore = reply => {
    revision = reply.revision;
    return reply.state;
  };
  return {
    async load() {
      return restore(await request('load'));
    },
    save(store) {
      const state = JSON.parse(JSON.stringify(store));
      const operation = tail.then(async () => {
        const reply = await request('save', { revision, state });
        revision = reply.revision;
      });
      tail = operation.then(() => true, () => false);
      return operation;
    },
    async importLegacy() {
      if (!await tail) throw new Error('Simpan ulang perubahan sebelum mengimpor riwayat.');
      const reply = await request('import');
      if (reply.cancelled) return null;
      if (reply.importError) throw new Error(reply.importError);
      return { data: restore(reply), addedVisits: reply.addedVisits };
    },
    print(visitId, recordId) {
      return request('print', { visitId, recordId });
    }
  };
}

function createNativeRequest(transport) {
  let nextId = 0;
  const pending = new Map();
  if (transport) {
    transport.onmessage = event => {
      const { id, result, error } = JSON.parse(event.data);
      const handlers = pending.get(id);
      if (!handlers) return;
      pending.delete(id);
      if (error) handlers.reject(new Error(error));
      else handlers.resolve(result);
    };
  }
  return (action, args = {}) => new Promise((resolve, reject) => {
    if (!transport) {
      reject(new Error('Buka halaman ini dari aplikasi Android.'));
      return;
    }
    const id = ++nextId;
    pending.set(id, { resolve, reject });
    try {
      transport.postMessage(JSON.stringify({ id, action, args }));
    } catch (error) {
      pending.delete(id);
      reject(error);
    }
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { createVisitPersistence, createNativeRequest };
}
