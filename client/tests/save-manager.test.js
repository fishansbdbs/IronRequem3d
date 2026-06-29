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
