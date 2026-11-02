'use strict';
// Read-only source contract. Never evaluates the game, starts a browser, or accesses a network.
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const rules = ['const TOTAL_ITEMS = 99;', 'const BASE_SPEED = 72;', 'const SPEED_UP_AT_REMAINING = 40;', 'const SPEED_MULTIPLIER = 1.3;', 'state.correct * 10 - state.mistakes * 10 - state.misses * 15', '["🐵", 25]', '["🙈", 25]', '["🙉", 25]', '["🙊", 24]'];
for (const rule of rules) assert.ok(source.includes(rule), `Preserve rule: ${rule}`);
assert.ok(source.includes('id="homeNameInput"'), 'Optional name belongs on home');
assert.ok(source.includes('p_limit: 30'), 'Existing bounded ranking RPC requests 30');
assert.ok(source.includes('Object.freeze({'), 'Freeze per-play data');
assert.ok(source.includes('requestId !== rankingRequestId'), 'Reject stale ranking responses');
assert.ok(source.includes('https://chameleonjp-lab.github.io/chameleonjp_lab/ranking.html?game=shiwakezaru'), 'Use observed detail URL');
assert.ok(source.includes('https://chameleonjp.codeberg.page/shiwakezaru/'), 'Keep confirmed old URL until new publication verified');
assert.ok(!source.includes('navigator.share'), 'Use X intent, not native share');
assert.ok(!source.includes('normalizePlayerName(name) === currentName'), 'Do not identify people by display name');
console.log('PASS: preserved rules and static integration contracts');
