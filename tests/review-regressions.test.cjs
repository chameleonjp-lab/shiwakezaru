'use strict';
// Focused, independent-review-only regression fixture. Pure Node builtins and fakes.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const ui = fs.readFileSync(path.join(root, 'common-ui.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
function closure(name) {
  const match = new RegExp('^      (?:async )?function ' + name + '\\(', 'm').exec(html);
  const start = match ? match.index : -1;
  assert.ok(start >= 0);
  const tail = html.slice(start);
  const end = tail.slice(1).search(/^      (?:async )?function /m);
  assert.ok(end >= 0);
  return tail.slice(0, end + 1);
}
function fixture(failure = '') {
  const counters = { stop: 0, oscillatorDisconnect: 0, gainDisconnect: 0, suspend: 0, created: 0 };
  let resumeResolve;
  let resumePromise;
  const resumeRequests = [];
  const oscillators = [];
  let audio;
  class FakeAudio {
    constructor() { audio = this; this.state = 'suspended'; this.currentTime = 10; this.destination = {}; }
    resume() { resumePromise = new Promise(resolve => { resumeResolve = () => { this.state = 'running'; resolve(); }; }); resumeRequests.push({ resolve: resumeResolve, promise: resumePromise }); return resumePromise; }
    suspend() { counters.suspend++; this.state = 'suspended'; return Promise.resolve(); }
    createOscillator() {
      counters.created++;
      const oscillator = { frequency: { setValueAtTime() {} }, connect() {}, start() { if (failure === 'start') throw new Error('start fake'); }, stop() { counters.stop++; if (failure === 'stop') throw new Error('stop fake'); }, disconnect() { counters.oscillatorDisconnect++; } };
      oscillators.push(oscillator); return oscillator;
    }
    createGain() {
      if (failure === 'gain') throw new Error('gain fake');
      return { gain: { setValueAtTime() {}, linearRampToValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {}, disconnect() { counters.gainDisconnect++; } };
    }
  }
  const nodes = new Map();
  const node = id => { if (!nodes.has(id)) nodes.set(id, { setAttribute() {}, appendChild() {}, value: '', textContent: '' }); return nodes.get(id); };
  const document = { hidden: false, getElementById: node, createElement: () => ({}) };
  const window = { AudioContext: FakeAudio, localStorage: { getItem: () => null, setItem() {} } };
  new vm.Script(ui).runInNewContext({ window, navigator: { languages: ['en'] }, Promise }, { timeout: 1000 });
  window.ShiwakeCommon.init(document);
  return { C: window.ShiwakeCommon, document, counters, oscillators, resumeRequests, resolve: () => resumeResolve(), settled: () => resumePromise, getAudio: () => audio };
}
const failures = [];
async function check(name, fn) { try { await fn(); console.log('PASS', name); } catch (error) { failures.push(name); console.error('FAIL', name, error.message); } }
async function main() {
  await check('explicit Chinese script beats region', () => assert.equal(fixture().C.chooseLanguage(null, ['zh-Hans-TW']), 'zh-Hans'));
  await check('partial gain failure disposes oscillator', async () => {
    const f = fixture('gain'); f.C.unlockAudio(); f.resolve(); await f.settled(); f.C.sound('correct');
    assert.equal(f.counters.oscillatorDisconnect, 1);
  });
  await check('start failure disposes both nodes', async () => {
    const f = fixture('start'); f.C.unlockAudio(); f.resolve(); await f.settled(); f.C.sound('correct');
    assert.equal(f.counters.oscillatorDisconnect, 1); assert.equal(f.counters.gainDisconnect, 1);
  });
  await check('stop exception does not prevent disconnect', async () => {
    const f = fixture('stop'); f.C.unlockAudio(); f.resolve(); await f.settled(); f.C.sound('correct'); f.C.silence();
    assert.equal(f.counters.oscillatorDisconnect, 1); assert.equal(f.counters.gainDisconnect, 1);
  });
  await check('late resume after mute is suspended again', async () => {
    const f = fixture(); f.C.unlockAudio(); f.C.toggleSound(); f.resolve(); await f.settled();
    assert.equal(f.getAudio().state, 'suspended');
  });
  await check('late resume after hidden is suspended again', async () => {
    const f = fixture(); f.C.unlockAudio(); f.document.hidden = true; f.C.silence(); f.resolve(); await f.settled();
    assert.equal(f.getAudio().state, 'suspended');
  });
  await check('name cap does not leave a high surrogate', () => {
    const ctx = vm.createContext({}); new vm.Script(closure('normalizePlayerName')).runInContext(ctx, { timeout: 1000 });
    const value = ctx.normalizePlayerName('a'.repeat(15) + '🐵');
    assert.ok(value.length <= 16); assert.ok(!/[\uD800-\uDBFF]$/.test(value));
  });
  await check('old resume cannot cancel newer allowed gesture', async () => {
    const f = fixture(); f.C.unlockAudio();
    f.document.hidden = true; f.C.silence(); f.document.hidden = false; f.C.unlockAudio();
    assert.equal(f.resumeRequests.length, 2);
    f.resumeRequests[1].resolve(); await f.resumeRequests[1].promise;
    f.resumeRequests[0].resolve(); await f.resumeRequests[0].promise;
    assert.equal(f.getAudio().state, 'running');
  });
  await check('onended after manual disposal disconnects only once', async () => {
    const f = fixture(); f.C.unlockAudio(); f.resolve(); await f.settled(); f.C.sound('correct'); f.C.silence();
    f.oscillators[0].onended();
    assert.equal(f.counters.oscillatorDisconnect, 1); assert.equal(f.counters.gainDisconnect, 1);
  });
  await check('small action controls override legacy dimensions', () => {
    assert.ok(html.includes('.retire-btn, .ranking-refresh-btn { min-height: 44px; }'));
    assert.ok(html.includes('.game-hud { height: auto; min-height: 57px; }'));
  });
  await check('unverified successful response is not labelled accepted', () => {
    assert.ok(fixture().C.catalogs.en.sent.includes('not verified'));
  });
  await check('X verifies opener detach before navigation', () => {
    let navigated = false;
    const popup = { get opener() { return {}; }, set opener(_) {}, location: { replace() { navigated = true; } }, close() {}, document: { createElement: () => ({}), head: { appendChild() {} } } };
    const ctx = vm.createContext({ shareGeneration: 0, window: { open: () => popup }, document: { getElementById: () => ({ classList: { add() {}, remove() {} }, focus() {} }) }, encodeURIComponent });
    new vm.Script(closure('dismissShareFallback') + closure('openXShare')).runInContext(ctx, { timeout: 1000 }); ctx.openXShare('test');
    assert.equal(navigated, false);
  });
  await check('X blank context sets no-referrer before navigation', () => {
    const sequence = [];
    const popup = { opener: {}, location: { replace() { sequence.push('navigate'); } }, document: { createElement: () => ({}), head: { appendChild(meta) { if (meta.name === 'referrer' && meta.content === 'no-referrer') sequence.push('no-referrer'); } } } };
    const ctx = vm.createContext({ shareGeneration: 0, window: { open: () => popup }, document: { getElementById: () => ({ classList: { add() {}, remove() {} }, focus() {} }) }, encodeURIComponent });
    new vm.Script(closure('dismissShareFallback') + closure('openXShare')).runInContext(ctx, { timeout: 1000 }); ctx.openXShare('test');
    assert.deepEqual(sequence, ['no-referrer', 'navigate']);
  });
  await check('clipboard fallback removes textarea after copy throws', () => {
    let removed = 0; let restored = 0;
    const textarea = { setAttribute() {}, style: {}, focus() {}, select() {}, remove() { removed++; } };
    const ctx = vm.createContext({ document: { activeElement: { focus() { restored++; } }, createElement: () => textarea, body: { appendChild() {} }, execCommand() { throw new Error('fake copy failure'); } } });
    new vm.Script(closure('fallbackCopy')).runInContext(ctx, { timeout: 1000 });
    assert.throws(() => ctx.fallbackCopy('text'));
    assert.equal(removed, 1); assert.equal(restored, 1);
  });
  await check('stale clipboard completion does not announce in newer share flow', async () => {
    let complete; const messages = [];
    const ctx = vm.createContext({ shareGeneration: 1, navigator: { clipboard: { writeText: () => new Promise(resolve => { complete = resolve; }) } }, window: { isSecureContext: true }, showToast: text => messages.push(text), t: key => key, fallbackCopy() {}, console, Promise });
    new vm.Script(closure('copyText')).runInContext(ctx, { timeout: 1000 });
    const copied = ctx.copyText('old flow'); ctx.shareGeneration = 2; complete(); await copied;
    assert.equal(messages.length, 0);
  });
  await check('failed legacy copy is not immediately repeated', async () => {
    let attempts = 0;
    const ctx = vm.createContext({ shareGeneration: 1, navigator: {}, window: { isSecureContext: false }, showToast() {}, t: key => key, fallbackCopy() { attempts++; throw new Error('fake denied'); }, console, Promise });
    new vm.Script(closure('copyText')).runInContext(ctx, { timeout: 1000 }); await ctx.copyText('text');
    assert.equal(attempts, 1);
  });
  await check('real share entry and close invalidate pending copy generation', async () => {
    let complete; let focused = 0; const messages = [];
    const node = { classList: { add() {}, remove() {} }, focus() { focused++; } };
    const ctx = vm.createContext({ shareGeneration: 0, state: { status: 'result' }, el: { shareResultButton: node }, navigator: { clipboard: { writeText: () => new Promise(resolve => { complete = resolve; }) } }, window: { isSecureContext: true, open: () => null }, document: { getElementById: () => node }, showToast: text => messages.push(text), t: key => key, fallbackCopy() {}, Promise, encodeURIComponent });
    new vm.Script(closure('dismissShareFallback') + closure('openXShare') + closure('copyText')).runInContext(ctx, { timeout: 1000 });
    ctx.openXShare('first'); assert.equal(ctx.shareGeneration, 1);
    const copied = ctx.copyText('first'); ctx.dismissShareFallback(true); assert.equal(ctx.shareGeneration, 2);
    ctx.openXShare('second'); assert.equal(ctx.shareGeneration, 3);
    complete(); await copied; assert.equal(messages.length, 0); assert.ok(focused > 0);
    for (const caller of ['requestGameStart', 'finishGame', 'finishToHome']) assert.ok(closure(caller).includes('dismissShareFallback();'), caller + ' invalidates share');
    assert.ok(html.includes('addEventListener("click", () => dismissShareFallback(true))'));
  });
  if (failures.length) { console.error(failures.length + ' focused regressions failed'); process.exitCode = 1; }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
