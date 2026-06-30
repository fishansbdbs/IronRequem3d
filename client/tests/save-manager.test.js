import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState } from '../src/game/GameState.js';
import { createMemoryStorage, loadGame, saveGame } from '../src/game/SaveManager.js';

test('save and load round trips a versioned game state', () => {
  const storage = createMemoryStorage();
  const state = createInitialState();
  const saved = saveGame(state, storage);
  const loaded = loadGame(storage);

  assert.equal(saved, true);
  assert.deepEqual(loaded, state);
});

test('corrupted saves fall back to a fresh state instead of throwing', () => {
  const storage = createMemoryStorage({ ironRequiemSave: '{not-json' });

  assert.doesNotThrow(() => loadGame(storage));
  assert.equal(loadGame(storage).objective, 'Talk to Commander Nira.');
});

test('v0.1.0 saves migrate to v0.2.0 without losing chapter one progress', () => {
  const legacy = {
    schemaVersion: 1,
    version: '0.1.0',
    currentChapter: 'chapter-1-iron-wake',
    day: 2,
    ap: { current: 1, max: 3, spentActivities: ['speak-nira'] },
    salvage: 100,
    upgrades: { 'hull-plating': { level: 1 } },
    bonds: { nira: 2, vael: 1, rook: 0, sera: 1 },
    sync: { value: 30, max: 100 },
    completedMissions: ['operation-iron-wake'],
    launchSequenceWatched: true,
    storyFlags: { introSeen: true, firstBattleWon: true },
    settings: { masterVolume: 0.5 }
  };
  const storage = createMemoryStorage({ ironRequiemSave: JSON.stringify(legacy) });
  const migrated = loadGame(storage);

  assert.equal(migrated.version, '0.2.0');
  assert.equal(migrated.schemaVersion, 2);
  assert.equal(migrated.salvage, 100);
  assert.equal(migrated.upgrades['hull-plating'].level, 1);
  assert.equal(migrated.storyFlags.firstBattleWon, true);
  assert.ok(migrated.unlockedChapters.includes('chapter-2-hollow-signal'));
  assert.deepEqual(migrated.completedChapters, ['chapter-1-iron-wake']);
  assert.deepEqual(migrated.dialogueChoices, {});
  assert.deepEqual(migrated.enemyDefeats, {});
});
