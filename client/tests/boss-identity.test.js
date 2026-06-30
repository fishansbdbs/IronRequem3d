import test from 'node:test';
import assert from 'node:assert/strict';
import { MISSIONS } from '../src/data/missions.js';
import { BOSS_CONFIGS } from '../src/battle/EnemyAI.js';

const lateCampaignBosses = [
  ['glassHorizon', 'prism-leviathan', 'prism-refraction'],
  ['blackOrchard', 'hollow-stag', 'orchard-root'],
  ['silentChoir', 'cantor-null', 'choir-resonance'],
  ['ashfallCradle', 'cradle-behemoth', 'ashfall-armor'],
  ['vaelsDoor', 'prototype-l0', 'prototype-mirror'],
  ['heavenStatic', 'seraphim-veil', 'gravity-seraph'],
  ['ironRequiem', 'requiem-heart', 'requiem-memory']
];

test('chapter four through ten bosses expose distinct combat identity metadata', () => {
  lateCampaignBosses.forEach(([missionKey, enemyId, profile]) => {
    const mission = MISSIONS[missionKey];
    const config = BOSS_CONFIGS[enemyId];

    assert.equal(mission.enemyId, enemyId);
    assert.equal(config.profile, profile);
    assert.ok(config.attacks.length >= 4);
    assert.ok(config.telegraphPalette?.length >= 3);
    assert.ok(config.phaseBehavior);
    assert.ok(config.deathEffect);
  });
});

test('chapter four through ten missions have event callouts and result identity copy', () => {
  lateCampaignBosses.forEach(([missionKey]) => {
    const mission = MISSIONS[missionKey];

    assert.ok(mission.resultText?.length > 50);
    assert.ok(mission.calloutEvents?.start);
    assert.ok(mission.calloutEvents?.phase);
    assert.ok(mission.calloutEvents?.lowHull);
    assert.ok(mission.calloutEvents?.victory);
  });
});
