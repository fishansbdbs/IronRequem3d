import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createInitialState,
  spendActionPoint,
  completeMission,
  applyUpgrade,
  recordDialogueChoice
} from '../src/game/GameState.js';

test('initial state starts chapter one with AP, zero salvage, and Arc-12 objective', () => {
  const state = createInitialState();

  assert.equal(state.version, '0.2.0');
  assert.equal(state.day, 1);
  assert.equal(state.ap.current, 3);
  assert.equal(state.salvage, 0);
  assert.equal(state.objective, 'Talk to Commander Nira.');
  assert.deepEqual(Object.keys(state.bonds).sort(), ['nira', 'rook', 'sera', 'vael']);
  assert.deepEqual(state.unlockedChapters, ['chapter-1-iron-wake']);
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
  assert.deepEqual(state.completedChapters, ['chapter-1-iron-wake']);
  assert.equal(state.currentChapter, 'chapter-2-hollow-signal');
  assert.ok(state.unlockedChapters.includes('chapter-2-hollow-signal'));
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

test('chapter two and three missions unlock the next story state and record result history', () => {
  const afterChapter1 = completeMission(createInitialState(), {
    missionId: 'operation-iron-wake',
    salvage: 100,
    sync: 15
  });
  const afterChapter2 = completeMission(afterChapter1, {
    missionId: 'operation-hollow-signal',
    salvage: 150,
    sync: 20,
    result: { missionName: 'Operation Hollow Signal', enemiesDefeated: 3, bossDefeated: 'Echo Stalker' }
  });
  const afterChapter3 = completeMission(afterChapter2, {
    missionId: 'operation-redline-descent',
    salvage: 200,
    sync: 25,
    result: { missionName: 'Operation Redline Descent', enemiesDefeated: 5, bossDefeated: 'Redline Colossus' }
  });

  assert.equal(afterChapter2.currentChapter, 'chapter-3-redline-descent');
  assert.ok(afterChapter2.unlockedChapters.includes('chapter-3-redline-descent'));
  assert.equal(afterChapter3.storyFlags.prototypeComplete, true);
  assert.equal(afterChapter3.enemyDefeats['redline-colossus'], true);
  assert.deepEqual(afterChapter3.missionResultsHistory.map((result) => result.missionId), [
    'operation-hollow-signal',
    'operation-redline-descent'
  ]);
});

test('dialogue choices save tone, story flags, and bond changes', () => {
  const state = recordDialogueChoice(createInitialState(), {
    conversationId: 'nira-chapter-2',
    choiceId: 'care-or-command',
    tone: 'defiant',
    bond: 'nira',
    bondDelta: 2,
    flags: { challengedNiraConcern: true }
  });

  assert.equal(state.bonds.nira, 2);
  assert.equal(state.dialogueChoices['nira-chapter-2'], 'care-or-command');
  assert.equal(state.toneRecord.defiant, 1);
  assert.equal(state.storyFlags.challengedNiraConcern, true);
});
