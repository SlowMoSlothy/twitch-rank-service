import test from 'node:test';
import assert from 'node:assert/strict';
import { parseWatchtime, rankFor } from '../api/rank.js';

test('parses StreamElements duration strings', () => {
  assert.equal(parseWatchtime('0 secs'), 0);
  assert.equal(parseWatchtime('30 mins'), 0.5);
  assert.equal(parseWatchtime('2 hours 30 mins'), 2.5);
  assert.equal(parseWatchtime('1 day 4 hours'), 28);
  assert.equal(parseWatchtime('1 week 2 days 3 hours'), 219);
  assert.equal(parseWatchtime('1 month'), 730);
  assert.equal(parseWatchtime('1 year'), 8760);
});

test('uses the expected rank boundaries', () => {
  const cases = [
    [0, '⚪ Unranked'], [4.999, '⚪ Unranked'],
    [5, '🟤 Bronze'], [10, '⚪ Silber'], [25, '🟡 Gold'],
    [50, '💠 Platin'], [100, '💎 Diamant'], [200, '🟣 Meister'],
    [350, '🔴 Großmeister'], [600, '🔥 Elite'], [1000, '👑 Legende'],
  ];
  for (const [hours, expected] of cases) assert.equal(rankFor(hours), expected);
});
