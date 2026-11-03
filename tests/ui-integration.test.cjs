'use strict';
// Selected initialization/render/event-wiring closures with a complete in-memory DOM fake.
// No full game IIFE, browser, timers, audio device, network, installation or build.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const ui = fs.readFileSync(path.join(root, 'common-ui.js'), 'utf8');
const markup = html.slice(0, html.indexOf('<script src='));
const ids = new Set([...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
for (const source of [html, ui]) for (const match of source.matchAll(/getElementById\("([^"]+)"\)/g)) assert.ok(ids.has(match[1]), 'DOM ID exists: ' + match[1]);
function closure(name) {
  const match = new RegExp('^      (?:async )?function ' + name + '\\(', 'm').exec(html);
  assert.ok(match, name);
  const tail = html.slice(match.index);
  const next = tail.slice(1).search(/^      (?:async )?function /m);
  const end = name === 'init' ? tail.indexOf('\n\n      init();') : next + 1;
  assert.ok(end > 0);
  const code = tail.slice(0, end);
  assert.ok(!code.includes('      init();'), 'Never include whole-game bootstrap');
  return code;
}
function makeNode(id) {
  const classes = new Set();
  const handlers = new Map();
  return { id, value: '', textContent: '', dataset: {}, children: [], attributes: {}, style: {},
    classList: { add: name => classes.add(name), remove: name => classes.delete(name), contains: name => classes.has(name), toggle(name, value) { if (value) classes.add(name); else classes.delete(name); } },
    setAttribute(name, value) { this.attributes[name] = value; }, appendChild(child) { this.children.push(child); },
    replaceChildren(...children) { this.children = children; }, focus() {}, closest() { return null; },
    addEventListener(name, fn) { if (!handlers.has(name)) handlers.set(name, []); handlers.get(name).push(fn); },
    fire(name, extra = {}) { for (const fn of handlers.get(name) || []) fn({ target: this, ...extra }); },
  };
}
const nodes = new Map([...ids].map(id => [id, makeNode(id)]));
const staticText = [...markup.matchAll(/data-i18n="([^"]+)"/g)].map((m, index) => { const node = makeNode('text-' + index); node.dataset.i18n = m[1]; return node; });
const rules = makeNode('rules');
const selectors = new Map([['.rules-list', rules], ['.countdown-preview', makeNode('preview')], ['meta[name="description"]', makeNode('meta')], ['meta[property="og:description"]', makeNode('og')]]);
const documentEvents = makeNode('document');
const document = { hidden: false, documentElement: {}, getElementById: id => nodes.get(id), createElement: tag => makeNode(tag), querySelector: selector => selectors.get(selector), querySelectorAll: selector => selector === '[data-i18n]' ? staticText : [], addEventListener: (...args) => documentEvents.addEventListener(...args) };
const storage = new Map([['chameleonjp_player_name', 'Legacy'], ['shiwakezaru_best_score', '123'], ['shiwakezaru_language', 'ja'], ['shiwakezaru_audio', '{"enabled":false,"volume":0}']]);
let audioAttempts = 0;
let failStorage = false;
const window = { localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => { if (failStorage) throw new Error('fake storage denial'); storage.set(key, value); }, removeItem: key => storage.delete(key) }, AudioContext: function() { audioAttempts++; throw new Error('fake unavailable audio'); }, addEventListener() {} };
new vm.Script(ui).runInNewContext({ window, navigator: { languages: ['fr'] }, Promise }, { timeout: 1000 });
const C = window.ShiwakeCommon;
const el = Object.fromEntries([...nodes.entries()].map(([id, node]) => [id, node]));
let starts = 0; let sends = 0; let reads = 0;
const state = { status: 'home', processed: 0, score: 0, correct: 0, mistakes: 0, misses: 0, finalScore: 0, retired: false, bestUpdated: false };
const sandbox = { window, document, C, t: (...args) => C.t(...args), el, state,
  screens: { game: nodes.get('gameScreen') },
  BEST_KEY: 'shiwakezaru_best_score', RETIRED_KEY: 'shiwakezaru_has_retired', PLAYER_NAME_KEY: 'chameleonjp_player_name', GAME_PLAYER_NAME_KEY: 'shiwakezaru_player_name', TOTAL_ITEMS: 99,
  currentPlay: null, finalResult: null, submission: null, playSerial: 0, shareGeneration: 0, rankingRequestId: 0, nameSaveFailed: false,
  rankingStatusKey: 'rankingEmpty', rankingRows: [], currentZoneAssignments: null,
  makeZoneAssignments: () => ({ topLeft: '🐵' }), applyZoneAssignments: value => { sandbox.currentZoneAssignments = value; },
  startCountdown: () => { starts++; state.status = 'countdown'; },
  renderRankingList() {}, loadResultRanking: () => { reads++; }, submitScore: () => { sends++; },
  openRules() {}, closeRules() {}, shareGame() {}, retireGame() {}, shareResult() {}, finishToHome() {}, goLab() {}, copyText() {},
  getFieldMetrics: () => ({ centers: [] }), activeItems: [], placeItemNode() {},
};
const names = ['safeGetItem', 'safeSetItem', 'formatScore', 'loadBestScore', 'updateBestScoreText', 'getStoredPlayerName', 'getCurrentPlayerName', 'updatePlayerNameViews', 'requestGameStart', 'persistHomeName', 'getRemainingCount', 'updateGameHud', 'renderResult', 'setupRankPanel', 'updateRankControls', 'normalizePlayerName', 'dismissShareFallback', 'renderLocale', 'bindEvents', 'init'];
const ctx = vm.createContext(sandbox);
new vm.Script(names.map(closure).join('\n')).runInContext(ctx, { timeout: 1000 });
ctx.init();
assert.equal(document.documentElement.lang, 'ja');
assert.equal(nodes.get('homeNameInput').value, 'Legacy');
assert.equal(nodes.get('bestScoreText').textContent, '123点');
assert.equal(nodes.get('languageSelect').children.length, 15);
assert.equal(nodes.get('soundButton').attributes['aria-pressed'], 'false');
assert.equal(nodes.get('volumeInput').value, '0');
assert.equal(audioAttempts, 0, 'Init does not open audio');
assert.equal(starts + sends + reads, 0, 'Init has no play or network calls');
assert.equal(rules.children.length, 6);
nodes.get('homeNameInput').value = '   ';
nodes.get('homeNameInput').fire('input');
nodes.get('homeNameInput').fire('keydown', { key: 'Enter', isComposing: true });
assert.equal(starts, 0, 'IME Enter cannot start');
assert.equal(storage.get('shiwakezaru_player_name'), '');
assert.equal(storage.get('chameleonjp_player_name'), 'Legacy', 'Shared old key untouched');
nodes.get('startButton').fire('click');
assert.equal(starts, 1); assert.equal(sandbox.currentPlay.eligible, false); assert.equal(audioAttempts, 0);
const fixedPlay = sandbox.currentPlay;
nodes.get('languageSelect').value = 'de'; nodes.get('languageSelect').fire('change');
assert.equal(document.documentElement.lang, 'ja', 'In-play language event cannot mutate state');
assert.equal(sandbox.currentPlay, fixedPlay);
state.status = 'result'; state.score = -15; state.finalScore = -15; state.misses = 1;
sandbox.submission = { play: fixedPlay, status: 'uncertain' };
nodes.get('languageSelect').value = 'de'; nodes.get('languageSelect').fire('change');
assert.equal(document.documentElement.lang, 'de');
assert.equal(storage.get('shiwakezaru_language'), 'de');
assert.equal(nodes.get('resultTotalScore').textContent, '-15 Punkte');
assert.equal(sandbox.submission.status, 'uncertain');
assert.equal(sandbox.currentPlay, fixedPlay);
assert.equal(sends + reads, 0, 'Locale render never submits or reads rankings');
assert.equal(nodes.get('volumeInput').value, '0');
assert.equal(nodes.get('soundButton').attributes['aria-pressed'], 'false');
state.status = 'home'; C.setLanguage('ja'); ctx.renderLocale();
failStorage = true;
nodes.get('homeNameInput').value = 'New name'; nodes.get('homeNameInput').fire('input');
assert.equal(nodes.get('nameSaveStatus').textContent, C.catalogs.ja.storageFailed);
nodes.get('languageSelect').value = 'de'; nodes.get('languageSelect').fire('change');
assert.equal(nodes.get('nameSaveStatus').textContent, C.catalogs.de.storageFailed, 'Storage failure notice follows language');
assert.equal(starts, 1); assert.equal(sends + reads, 0);
console.log('PASS: literal DOM references, actual selected init/render/event wiring, saved preferences, IME/anonymous start and no-send locale rerender (fake DOM only)');
