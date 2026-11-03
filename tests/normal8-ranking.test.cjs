'use strict';
// Builtins only; pure validator and selected closures with fake fetch/DOM.
// Never evaluates the game IIFE or contacts any backend.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const validator = fs.readFileSync(path.join(root, 'normal-score-ack8.js'), 'utf8');
assert.equal(crypto.createHash('sha256').update(validator).digest('hex'), '157871e38fcc2e75184f3c44d09624aa06355afc7feebad4aa8a5cdfa04a2a16');
function closure(name) {
  const match = new RegExp('^      (?:async )?function ' + name + '\\(', 'm').exec(html);
  assert.ok(match, name);
  const tail = html.slice(match.index);
  const end = tail.slice(1).search(/^      (?:async )?function /m) + 1;
  assert.ok(end > 0, name + ' boundary');
  return tail.slice(0, end);
}
const names = ['readSubmitScoreResponse', 'submitScore', 'getRankingRank', 'getRankingScore', 'getRankingName', 'formatScore', 'renderRankingList'];
let calls = 0;
let rankingReads = 0;
let resolveFetch;
const list = { children: [], appendChild(node) { this.children.push(node); }, set innerHTML(_) { this.children = []; } };
const sandbox = {
  Promise,
  GAME_SLUG: 'shiwakezaru', CLIENT_VERSION: 'fixture', SUPABASE_URL: 'https://backend.invalid', SUPABASE_PUBLISHABLE_KEY: 'fake-only',
  finalResult: null, submission: null, state: { status: 'result' }, rankingStatusKey: '',
  isSupabaseConfigured: () => true, updateRankControls() {}, showToast() {},
  loadResultRanking: () => { rankingReads++; },
  fetch: () => { calls++; return new Promise(resolve => { resolveFetch = resolve; }); },
  t: (key, params = {}) => key === 'points' ? `${params.n} points` : key,
  el: { rankingList: list, rankingStatus: {} },
  document: { createElement: () => ({ children: [], append(...nodes) { this.children.push(...nodes); } }) },
};
const ctx = vm.createContext(sandbox);
new vm.Script(validator + '\n' + names.map(closure).join('\n')).runInContext(ctx, { timeout: 1000 });
const expected = { gameSlug: 'shiwakezaru', scoreOrder: 'desc', displayName: 'Alice', score: 0 };
const ack = (overrides = {}) => [{ accepted: true, result_normalized_name: 'Alice', result_display_name: 'Alice', result_first_score: 0, result_best_score: 0, result_play_count: 1, is_first_play: true, is_new_best: true, ...overrides }];
const response = payload => ({ ok: true, status: 200, text: async () => JSON.stringify(payload) });
const failures = [];
async function check(name, fn) { try { await fn(); console.log('PASS', name); } catch (error) { failures.push(name); console.error('FAIL', name, error.message); } }
async function main() {
  await check('normal8 reader accepts exact matching first-play row', async () => {
    const result = await ctx.readSubmitScoreResponse(response(ack()), expected);
    assert.equal(result.accepted, true); assert.equal(result.result_display_name, 'Alice');
  });
  await check('normal8 reader rejects success without exact 8-field matching response', async () => {
    for (const payload of [null, [], {}, { accepted: true }, ack()[0], [ack()[0], ack()[0]], ack({ extra: true }), ack({ accepted: false }), ack({ result_display_name: 'Bob' }), ack({ result_normalized_name: 'alice' }), ack({ result_play_count: '1' }), ack({ result_best_score: null }), ack({ result_best_score: 1 })]) {
      await assert.rejects(ctx.readSubmitScoreResponse(response(payload), expected));
    }
  });
  await check('known historical int4 best is accepted without changing submitted score', async () => {
    const result = await ctx.readSubmitScoreResponse(response(ack({ result_first_score: 2147483647, result_best_score: 2147483647, result_play_count: 9, is_first_play: false, is_new_best: false })), expected);
    assert.equal(result.result_best_score, 2147483647);
  });
  await check('actual submit caller rejects mismatched ACK and does not refetch or retry', async () => {
    const beforeCalls = calls; const beforeReads = rankingReads;
    const play = Object.freeze({ name: 'Alice', eligible: true });
    ctx.finalResult = Object.freeze({ play, retired: false, finalScore: 0 }); ctx.submission = { play, status: 'idle' };
    const sending = ctx.submitScore(); resolveFetch(response(ack({ result_normalized_name: 'Bob', result_display_name: 'Bob' }))); await sending;
    assert.equal(ctx.submission.status, 'uncertain'); assert.equal(rankingReads - beforeReads, 0);
    await ctx.submitScore(); assert.equal(calls - beforeCalls, 1);
  });
  await check('actual submit caller accepts original immutable name and score snapshot', async () => {
    const beforeReads = rankingReads;
    const play = Object.freeze({ name: 'Alice', eligible: true });
    ctx.finalResult = Object.freeze({ play, retired: false, finalScore: 0 }); ctx.submission = { play, status: 'idle' };
    const attempt = ctx.submission; const sending = ctx.submitScore();
    const nextPlay = Object.freeze({ name: 'Bob', eligible: true });
    ctx.finalResult = Object.freeze({ play: nextPlay, retired: false, finalScore: 200 });
    ctx.submission = { play: nextPlay, status: 'idle' };
    resolveFetch(response(ack())); await sending;
    assert.equal(attempt.status, 'sent'); assert.equal(ctx.submission.status, 'idle'); assert.equal(rankingReads - beforeReads, 0);
  });
  await check('current valid negative score receipt triggers one ranking refresh', async () => {
    const beforeReads = rankingReads; const beforeCalls = calls;
    const play = Object.freeze({ name: 'Alice', eligible: true });
    ctx.finalResult = Object.freeze({ play, retired: false, finalScore: -15 }); ctx.submission = { play, status: 'idle' };
    const sending = ctx.submitScore(); resolveFetch(response(ack({ result_first_score: -15, result_best_score: -15 }))); await sending;
    assert.equal(ctx.submission.status, 'sent'); assert.equal(rankingReads - beforeReads, 1); assert.equal(calls - beforeCalls, 1);
  });
  await check('ranking uses actual best_score, not aliases or null-to-zero coercion', () => {
    for (const row of [{}, { best_score: null }, { best_score: undefined }, { best_score: '' }, { best_score: '0' }, { best_score: false }, { best_score: NaN }, { best_score: Infinity }, { best_score: 0.5 }, { best_score: 2147483648 }, { best_score: null, first_score: 88, score: 99 }]) assert.equal(ctx.getRankingScore(row), null);
    for (const score of [-2147483648, -15, 0, 990, 2147483647]) assert.equal(ctx.getRankingScore({ best_score: score }), score);
  });
  await check('ranking preserves server 1/1/3 ties and never invents missing ranks', () => {
    assert.deepEqual([1, 1, 3].map(rank_no => ctx.getRankingRank({ rank_no })), [1, 1, 3]);
    for (const row of [{}, { rank_no: null }, { rank_no: 0 }, { rank_no: 1.5 }, { rank_no: false }, { rank_no: '1' }, { rank_no: '01' }, { rank_no: '1e0' }, { rank_no: Number.MAX_SAFE_INTEGER + 1 }, { rank_no: null, rank: 1 }]) assert.equal(ctx.getRankingRank(row), null);
  });
  await check('actual ranking renderer shows unknown as dash but valid zero as zero', () => {
    ctx.renderRankingList([{ rank_no: 1, display_name: 'First', best_score: 0 }, { rank_no: 1, display_name: 'Tie', best_score: 0 }, { rank_no: 3, display_name: '<img onerror=evil>', best_score: null }]);
    assert.deepEqual(list.children.map(row => row.children[0].textContent), ['1', '1', '3']);
    assert.deepEqual(list.children.map(row => row.children[2].textContent), ['0 points', '0 points', '—']);
    assert.equal(list.children[2].children[1].textContent, '<img onerror=evil>');
  });
  if (failures.length) { console.error(failures.length + ' focused tests failed'); process.exitCode = 1; }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
