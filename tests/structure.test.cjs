const assert = require('node:assert/strict');
const { existsSync, readFileSync } = require('node:fs');
const { join, resolve } = require('node:path');
const test = require('node:test');

const app = resolve(__dirname, '../app/src/main');
const www = join(app, 'assets/www');
const html = readFileSync(join(www, 'index.html'), 'utf8');
const js = readFileSync(join(www, 'app.js'), 'utf8');

test('aset UI, rujukan DOM, dan panduan tersedia dari paket lokal', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  for (const [, id] of js.matchAll(/(?:getElementById|visitElement)\('([^']+)'\)/g)) {
    assert.ok(ids.includes(id), 'Elemen hilang ' + id);
  }
  for (const [, asset] of html.matchAll(/<(?:script|link)\b[^>]*(?:src|href)="([^"]+)"/g)) {
    assert.match(asset, /^[a-z][a-z0-9./-]*$/);
    assert.ok(existsSync(join(www, asset)), 'Aset hilang ' + asset);
    if (asset.endsWith('.css')) {
      for (const [, font] of readFileSync(join(www, asset), 'utf8').matchAll(/url\(['"]?(media\/[^)'"]+)/g)) {
        assert.ok(existsSync(join(www, font)), 'Font hilang ' + font);
      }
    }
  }
  const data = require(join(www, 'clinical-data.js'));
  for (const image of data.kpsp.images) {
    assert.ok(existsSync(join(www, image)), 'Ilustrasi hilang ' + image);
  }
  const denver = readFileSync(join(www, 'media/denver-sheet.png'));
  assert.deepEqual([denver.readUInt32BE(16), denver.readUInt32BE(20)], [2905, 4096]);
  assert.equal([...js.matchAll(/id: '[a-z-]+', group: '(?:child|school|maternal|adult|older)'/g)].length, 13);
  assert.doesNotMatch(js, /\blocalStorage\b|\bwindow\.print\(/);
});

test('manifest V1 offline dan kontrak native diberi origin lokal', () => {
  const android = readFileSync(join(app, 'AndroidManifest.xml'), 'utf8');
  const activity = readFileSync(join(app, 'java/id/bukusakuanak/posyandu/MainActivity.kt'), 'utf8');
  assert.doesNotMatch(android, /android\.permission\.INTERNET/);
  assert.match(android, /android:allowBackup="false"/);
  assert.match(activity, /addWebMessageListener\(this, "BukuSakuNative", setOf\(ASSET_ORIGIN\)\)/);
  assert.match(activity, /ApplicationInfo\.FLAG_DEBUGGABLE != 0/);
});
