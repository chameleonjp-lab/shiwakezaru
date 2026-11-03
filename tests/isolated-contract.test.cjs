'use strict';
// Full game is only syntax-compiled, never evaluated. Selected closures run with local fakes.
// Builtins only; no timers, sockets, subprocesses, browser, installs, real audio or real storage.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'common-ui.js'), 'utf8');
const validator = fs.readFileSync(path.join(root, 'normal-score-ack8.js'), 'utf8');
const inline = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
assert.equal(inline.length, 1);
new vm.Script(inline[0], { filename: 'index-inline-syntax-only.js' });
const saved = new Map();
const windowFake = { localStorage: { getItem: k => saved.get(k) ?? null, setItem: (k, v) => saved.set(k, v) } };
const uiContext = vm.createContext({ window: windowFake, navigator: { languages: ['ja'] } });
new vm.Script(ui, { filename: 'common-ui.js' }).runInContext(uiContext, { timeout: 1000 });
const C = windowFake.ShiwakeCommon;
assert.equal(C.languages.length, 15);
const keys = Object.keys(C.catalogs.en).sort();
for (const [id] of C.languages) {
  assert.deepEqual(Object.keys(C.catalogs[id]).sort(), keys, id + ' key coverage');
  C.setLanguage(id);
  for (const key of keys) {
    assert.equal(typeof C.catalogs[id][key], 'string');
    assert.ok(C.catalogs[id][key].length > 0);
    assert.ok(!C.t(key, { n: 99, name: '<img>', type: '🐵' }).includes('{'), id + '/' + key);
  }
  assert.equal(C.catalogs[id].rulesText.split('\n').length, 6);
}
assert.equal(C.chooseLanguage('ja', ['fr']), 'ja');
assert.equal(C.chooseLanguage(null, ['xx', 'zh-TW']), 'zh-Hant');
assert.equal(C.chooseLanguage(null, ['pt-PT']), 'pt-BR');
assert.equal(C.chooseLanguage(null, ['unknown']), 'en');
assert.equal(C.parseAudio(null).enabled, true);
assert.ok(C.parseAudio(null).volume > 0);
assert.equal(C.parseAudio('{"enabled":false,"volume":0}').enabled, false);
assert.equal(C.parseAudio('{"enabled":false,"volume":0}').volume, 0);
assert.equal(C.parseAudio('null').volume, 0.35);

function selected(name) {
  const regex = new RegExp('^      (?:async )?function ' + name + '\\(', 'm');
  const match = regex.exec(inline[0]);
  assert.ok(match, 'Known closure: ' + name);
  const rest = inline[0].slice(match.index);
  const end = rest.slice(1).search(/^      (?:async )?function /m);
  assert.ok(end >= 0, 'Closure boundary: ' + name);
  return rest.slice(0, end + 1);
}
const names = ['normalizePlayerName', 'getStoredPlayerName', 'getCurrentPlayerName', 'requestGameStart', 'persistHomeName', 'submitScore', 'readSubmitScoreResponse', 'loadResultRanking', 'readRankingResponse', 'getRankingRank', 'openXShare', 'dismissShareFallback'];
const selectedSource = names.map(selected).join('\n');
let countdowns = 0;
let calls = [];
let resolveSubmit;
let resolveFirstRanking;
let resolveSecondRanking;
const classFake = { add() {}, remove() {} };
const nodes = new Map();
const node = id => { if (!nodes.has(id)) nodes.set(id, { value: '', textContent: '', classList: classFake, focus() {} }); return nodes.get(id); };
const sandbox = {
  Object, Number, String, Boolean, JSON, Promise, encodeURIComponent,
  currentPlay: null, finalResult: null, submission: null, playSerial: 0, shareGeneration: 0, nameSaveFailed: false,
  state: { status: 'home' }, rankingRequestId: 0, rankingRows: [], rankingStatusKey: '',
  GAME_PLAYER_NAME_KEY: 'own', PLAYER_NAME_KEY: 'legacy', GAME_SLUG: 'shiwakezaru', CLIENT_VERSION: 'test-only',
  SUPABASE_URL: 'https://invalid.example', SUPABASE_PUBLISHABLE_KEY: 'fake-only',
  el: { homeNameInput: { value: '' }, resultRankingPanel: {}, refreshRankingButton: {}, rankingStatus: {} },
  C: { unlockAudio() {}, sound() {} },
  t: key => key, updatePlayerNameViews() {}, updateRankControls() {}, showToast() {},
  safeGetItem: key => saved.get(key) ?? null, safeSetItem: (key, value) => { saved.set(key, value); return true; },
  startCountdown: () => { countdowns++; sandbox.state.status = 'countdown'; },
  isSupabaseConfigured: () => true,
  document: { getElementById: node },
  window: { open: () => null },
  fetch: (...args) => { calls.push(args); return new Promise(resolve => { resolveSubmit = resolve; }); },
  renderRankingStatus: key => { sandbox.rankingStatusKey = key; },
  renderRankingList: rows => { sandbox.renderedRows = rows; },
};
const ctx = vm.createContext(sandbox);
new vm.Script(validator + '\n' + selectedSource, { filename: 'selected-reviewed-closures.js' }).runInContext(ctx, { timeout: 1000 });
const response = (payload, ok = true) => ({ ok, status: ok ? 200 : 400, text: async () => JSON.stringify(payload) });

async function main() {
  saved.set('legacy', 'old name');
  assert.equal(sandbox.getStoredPlayerName(), 'old name');
  saved.set('own', '');
  assert.equal(sandbox.getStoredPlayerName(), '', 'Cleared own name does not resurrect shared name');
  sandbox.el.homeNameInput.value = '   ';
  sandbox.requestGameStart();
  assert.equal(sandbox.currentPlay.eligible, false);
  assert.ok(Object.isFrozen(sandbox.currentPlay));
  sandbox.requestGameStart();
  assert.equal(countdowns, 1, 'Double start is ignored');
  sandbox.state.status = 'result';
  sandbox.finalResult = Object.freeze({ play: sandbox.currentPlay, retired: false, finalScore: 100 });
  await sandbox.submitScore();
  assert.equal(calls.length, 0, 'Anonymous result never sent');
  sandbox.state.status = 'home';
  sandbox.el.homeNameInput.value = ' Alice ';
  sandbox.requestGameStart();
  const play = sandbox.currentPlay;
  sandbox.finalResult = Object.freeze({ play, retired: false, finalScore: -15 });
  sandbox.state.status = 'result';
  const sending = sandbox.submitScore();
  sandbox.el.homeNameInput.value = 'Bob';
  await sandbox.submitScore();
  assert.equal(calls.length, 1, 'Concurrent submissions guarded');
  const body = JSON.parse(calls[0][1].body);
  assert.equal(body.p_display_name, 'Alice');
  assert.equal(body.p_score, -15);
  assert.deepEqual(Object.keys(body).sort(), ['p_client_version', 'p_display_name', 'p_game_slug', 'p_score']);
  sandbox.state.status = 'home';
  sandbox.requestGameStart();
  const nextAttempt = sandbox.submission;
  resolveSubmit(response([{ accepted: true, result_normalized_name: 'Alice', result_display_name: 'Alice', result_first_score: -15, result_best_score: -15, result_play_count: 1, is_first_play: true, is_new_best: true }]));
  await sending;
  assert.equal(sandbox.submission, nextAttempt);
  assert.equal(nextAttempt.status, 'idle', 'Old completion cannot mark new play sent');
  sandbox.finalResult = Object.freeze({ play: sandbox.currentPlay, retired: true, finalScore: 20 });
  await sandbox.submitScore();
  assert.equal(calls.length, 1, 'Retire never sent');
  sandbox.finalResult = Object.freeze({ play: sandbox.currentPlay, retired: false, finalScore: 20 });
  sandbox.fetch = () => Promise.reject(new Error('fake network failure'));
  await sandbox.submitScore();
  assert.equal(sandbox.submission.status, 'uncertain');
  await sandbox.submitScore();
  assert.equal(sandbox.submission.status, 'uncertain', 'No ambiguous retry');
  assert.equal(sandbox.getRankingRank({ score: 20 }, 0), null, 'No invented tie rank');
  assert.equal(sandbox.getRankingRank({ rank_no: 2 }, 9), 2);
  await assert.rejects(sandbox.readRankingResponse(response({ unexpected: true })));
  await assert.rejects(sandbox.readSubmitScoreResponse({ ok: true, text: async () => '{bad' }));
  sandbox.fetch = () => new Promise(resolve => { if (!resolveFirstRanking) resolveFirstRanking = resolve; else resolveSecondRanking = resolve; });
  const older = sandbox.loadResultRanking();
  const newer = sandbox.loadResultRanking({ force: true });
  resolveSecondRanking(response([{ display_name: 'new', score: 99 }]));
  await newer;
  resolveFirstRanking(response([{ display_name: 'old', score: 1 }]));
  await older;
  assert.equal(sandbox.renderedRows[0].display_name, 'new', 'Stale response rejected');
  sandbox.openXShare('日本語 & #仕分けざる\nhttps://example.invalid/');
  assert.ok(node('shareFallbackText').value.includes('日本語 &'));
  let target;
  sandbox.window.open = () => ({ opener: 'old', location: { replace: url => { target = url; } }, document: { createElement: () => ({}), head: { appendChild() {} } } });
  sandbox.openXShare('test & #仕分けざる\nline');
  assert.equal(new URL(target).searchParams.get('text'), 'test & #仕分けざる\nline');
  console.log('PASS: isolated locale/storage/name/submission/ranking/X closures; no game IIFE or network executed');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
