import test from 'node:test';
import assert from 'node:assert/strict';
import { createInitialState, spendActionPoint, completeMission, applyUpgrade } from '../src/game/GameState.js';

test('initial state starts chapter one with AP, zero salvage, and Arc-12 objective', () => {
  const state = createInitialState();

  assert.equal(state.version, '0.1.0');
  assert.equal(state.day, 1);
  assert.equal(state.ap.current, 3);
  assert.equal(state.salvage, 0);
  assert.equal(state.objective, 'Talk to Commander Nira.');
  assert.deepEqual(Object.keys(state.bonds).sort(), ['nira', 'rook', 'sera', 'vael']);
});

test('spending an action point records the activity once and increases bond', () => {
  const state = createInitialState();
  const updated = spendActionPoint(state, 'speak-nira', 'nira');

  assert.equal(updated.ap.current, 2);
  assert.deepEqual(updated.ap.spentActivities, ['speak-nira']);
  assert.equal(updated.bonds.nira, 1);
  assert.equal(state.ap.current, 3);
});

test('mission completion rewards salvage, sync, and completed mission flag', () => {
  const state = completeMission(createInitialState(), {
    missionId: 'operation-iron-wake',
    salvage: 100,
    sync: 12
  });

  assert.equal(state.salvage, 100);
  assert.equal(state.sync.value, 12);
  assert.deepEqual(state.completedMissions, ['operation-iron-wake']);
});

test('upgrade purchase spends salvage and increments stat level', () => {
  const rewarded = completeMission(createInitialState(), {
    missionId: 'operation-iron-wake',
    salvage: 100,
    sync: 0
  });
  const upgraded = applyUpgrade(rewarded, 'hull-plating');

  assert.equal(upgraded.salvage, 50);
  assert.equal(upgraded.upgrades['hull-plating'].level, 1);
  assert.equal(upgraded.stats.hull, 125);
});
