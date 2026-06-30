import * as THREE from 'three';
import { BATTLE_BALANCE } from '../../../shared/balance.js';
import { ModelFactory } from '../game/ModelFactory.js';
import { VFXFactory } from '../game/VFXFactory.js';

export const BOSS_CONFIGS = {
  'fracture-worm': {
    hp: BATTLE_BALANCE.bossHull,
    hover: 1,
    attackDelay: [2.4, 1.75],
    addLimit: 3,
    addType: 'rift-shard',
    attacks: ['bite', 'burrow', 'spit', 'sweep', 'shards']
  },
  'echo-stalker': {
    hp: 320,
    hover: 1.35,
    attackDelay: [2.25, 1.65],
    phaseAt: 0.5,
    addLimit: 4,
    addType: 'rift-shard',
    attacks: ['signal-lance', 'static-pounce', 'echo-clone', 'tower-pulse', 'shard-call']
  },
  'redline-colossus': {
    hp: 430,
    hover: 0.45,
    attackDelay: [2.35, 1.45],
    phaseAt: 0.5,
    addLimit: 4,
    addType: 'veil-crawler',
    attacks: ['rail-slam', 'tunnel-collapse', 'core-roar', 'charge-downline', 'summon-crawlers']
  },
  'prism-leviathan': {
    profile: 'prism-refraction',
    telegraphPalette: ['glass', 'blue', 'violet'],
    phaseBehavior: 'At low hull the mirror plates split, adding extra crossing beams and shard rain.',
    deathEffect: 'crystal-shatter',
    deathColor: 'glass',
    hp: 380,
    hover: 1.1,
    attackDelay: [2.2, 1.45],
    phaseAt: 0.48,
    addLimit: 3,
    addType: 'rift-shard',
    attacks: ['prism-beam', 'shatter-rain', 'mirror-clone', 'tidal-sweep', 'reflection-pulse']
  },
  'hollow-stag': {
    profile: 'orchard-root',
    telegraphPalette: ['amber', 'red', 'violet'],
    phaseBehavior: 'The heart core lights the antlers, accelerating root snares and heartbeat pulses.',
    deathEffect: 'root-collapse',
    deathColor: 'amber',
    hp: 430,
    hover: 0.65,
    attackDelay: [2.25, 1.5],
    phaseAt: 0.5,
    addLimit: 4,
    addType: 'rift-shard',
    attacks: ['antler-charge', 'root-snare', 'thorn-wave', 'wraith-bloom', 'heartbeat-pulse']
  },
  'cantor-null': {
    profile: 'choir-resonance',
    telegraphPalette: ['violet', 'blue', 'glass'],
    phaseBehavior: 'Speaker towers wake around the arena and add slow sonic rings.',
    deathEffect: 'silent-ring-burst',
    deathColor: 'violet',
    hp: 460,
    hover: 1.4,
    attackDelay: [2.15, 1.38],
    phaseAt: 0.45,
    addLimit: 5,
    addType: 'rift-shard',
    attacks: ['sonic-ring', 'silence-field', 'resonance-beam', 'choir-summon', 'shatter-note']
  },
  'cradle-behemoth': {
    profile: 'ashfall-armor',
    telegraphPalette: ['ash', 'red', 'amber'],
    phaseBehavior: 'Armor blunts early damage, then breaks at half hull into faster high-damage attacks.',
    deathEffect: 'armor-shed',
    deathColor: 'amber',
    hp: 560,
    hover: 0.35,
    attackDelay: [2.55, 1.65],
    phaseAt: 0.52,
    addLimit: 5,
    addType: 'veil-crawler',
    attacks: ['ground-quake', 'ashfall', 'core-mortar', 'trample-charge', 'armor-break']
  },
  'prototype-l0': {
    profile: 'prototype-mirror',
    telegraphPalette: ['red', 'blue', 'violet'],
    phaseBehavior: 'Prototype swaps between melee and rifle stance, copying AEGIS attack cadence.',
    deathEffect: 'red-blue-core-split',
    deathColor: 'red',
    hp: 520,
    hover: 0.55,
    attackDelay: [2.05, 1.25],
    phaseAt: 0.48,
    addLimit: 2,
    addType: 'rift-shard',
    attacks: ['blade-rush', 'rifle-burst', 'sync-overload', 'false-overdrive', 'mirror-aegis']
  },
  'seraphim-veil': {
    profile: 'gravity-seraph',
    telegraphPalette: ['blue', 'violet', 'glass'],
    phaseBehavior: 'Gravity intensifies and safe lanes shift between wing volleys and rift collapses.',
    deathEffect: 'halo-wing-collapse',
    deathColor: 'blue',
    hp: 540,
    hover: 2.2,
    attackDelay: [2.05, 1.32],
    phaseAt: 0.46,
    addLimit: 4,
    addType: 'rift-shard',
    attacks: ['feather-lance', 'gravity-well', 'wing-barrage', 'light-dark-zones', 'rift-collapse']
  },
  'requiem-heart': {
    profile: 'requiem-memory',
    telegraphPalette: ['red', 'blue', 'violet'],
    phaseBehavior: 'Four memory phases: Worm, Signal, Prototype, then exposed Heart.',
    deathEffect: 'origin-heart-release',
    deathColor: 'violet',
    hp: 700,
    hover: 2.0,
    attackDelay: [1.95, 1.18],
    phaseAt: 0.5,
    phaseBreakpoints: [0.72, 0.45, 0.2],
    addLimit: 6,
    addType: 'rift-shard',
    attacks: ['worm-burrow-memory', 'worm-lunge-memory', 'rift-shard-memory', 'signal-beam-memory', 'signal-ring-memory', 'prototype-blade-memory', 'prototype-rifle-memory', 'heart-exposed-pulse']
  }
};

function angleTo(source, target) {
  const delta = target.clone().sub(source);
  return Math.atan2(delta.x, delta.z);
}

export class EnemyAI {
  constructor({ scene, bossMesh, mission, telegraphs, player, onProjectileHit, onCallout, onPhaseChange, onBossEffect }) {
    this.scene = scene;
    this.mesh = bossMesh;
    this.mission = mission;
    this.config = BOSS_CONFIGS[mission.enemyId] || BOSS_CONFIGS['fracture-worm'];
    this.name = mission.enemy;
    this.id = mission.enemyId;
    this.telegraphs = telegraphs;
    this.player = player;
    this.onProjectileHit = onProjectileHit;
    this.onCallout = onCallout;
    this.onPhaseChange = onPhaseChange;
    this.onBossEffect = onBossEffect;
    this.hp = this.config.hp;
    this.maxHp = this.config.hp;
    this.attackTimer = 1.4;
    this.attackIndex = 0;
    this.projectiles = [];
    this.adds = [];
    this.addsSpawned = 0;
    this.clones = [];
    this.effects = [];
    this.phase = this.resolvePhase();
    this.attackState = null;
    this.deathStarted = false;
    this.phaseAnchors = [];
  }

  damage(amount) {
    const reduced = this.id === 'cradle-behemoth' && this.phase === 1 ? amount * 0.68 : amount;
    const wasAlive = this.hp > 0;
    this.hp = Math.max(0, this.hp - reduced);
    this.mesh.traverse((child) => {
      if (child.material?.emissive) child.material.emissiveIntensity = 2.4;
    });
    setTimeout(() => {
      this.mesh.traverse((child) => {
        if (child.material?.emissive) child.material.emissiveIntensity = this.phase >= 2 ? 1.8 : 1.2;
      });
    }, 90);
    if (wasAlive && this.hp <= 0) {
      this.startDeathEffect();
    }
  }

  update(dt) {
    if (this.hp <= 0) {
      this.mesh.rotation.z += dt * 1.8;
      this.mesh.position.y = Math.max(-1.4, this.mesh.position.y - dt * 1.6);
      this.updateProjectiles(dt);
      this.updateAdds(dt);
      this.updateClones(dt);
      this.updateSheddingParts(dt);
      this.updateEffects(dt);
      return;
    }

    const nextPhase = this.resolvePhase();
    if (nextPhase !== this.phase) {
      this.phase = nextPhase;
      this.enterPhase(nextPhase);
    }
    this.attackTimer -= dt;
    this.animateBoss(dt);

    if (this.attackTimer <= 0) {
      this.performAttack();
      this.attackTimer = this.config.attackDelay[Math.min(this.phase - 1, this.config.attackDelay.length - 1)];
    }

    this.updateProjectiles(dt);
    this.updateAdds(dt);
    this.updateClones(dt);
    this.updateSheddingParts(dt);
    this.updateEffects(dt);
  }

  resolvePhase() {
    if (this.id === 'requiem-heart') {
      const percent = this.hp / this.maxHp;
      if (percent <= this.config.phaseBreakpoints[2]) return 4;
      if (percent <= this.config.phaseBreakpoints[1]) return 3;
      if (percent <= this.config.phaseBreakpoints[0]) return 2;
      return 1;
    }
    const phaseAt = this.config.phaseAt || 0.45;
    return this.hp < this.maxHp * phaseAt ? 2 : 1;
  }

  enterPhase(phase) {
    this.spawnShockwave(phase >= 3 ? 10 : 7.5, this.config.deathColor || 'red');
    this.onPhaseChange?.(phase);
    if (this.id === 'cantor-null' && phase === 2) this.spawnCantorTowers();
    if (this.id === 'cradle-behemoth' && phase === 2) this.shedCradleArmor();
    if (this.id === 'prototype-l0' && phase === 2) this.onBossEffect?.('glitch');
  }

  startDeathEffect() {
    if (this.deathStarted) return;
    this.deathStarted = true;
    const burst = VFXFactory.createDeathBurst(this.config.deathColor || 'red', this.id === 'requiem-heart' ? 2.2 : 1.5);
    burst.position.copy(this.mesh.position);
    burst.position.y += 1.2;
    this.scene.add(burst);
    this.effects.push(burst);
  }

  animateBoss(dt) {
    const clock = performance.now() * 0.002;
    this.mesh.position.y = this.config.hover + Math.sin(clock) * 0.16;
    this.mesh.lookAt(this.player.position.x, this.mesh.position.y, this.player.position.z);

    if (!this.attackState) return;
    this.attackState.time -= dt;
    const progress = 1 - this.attackState.time / this.attackState.duration;
    const strike = Math.sin(progress * Math.PI);

    if (this.attackState.name.includes('slam') || this.attackState.name.includes('bite')) {
      this.mesh.rotation.x = strike * 0.25;
      this.mesh.position.y = this.config.hover + strike * 0.4;
    } else if (this.attackState.name.includes('pounce') || this.attackState.name.includes('charge')) {
      this.mesh.position.lerp(this.attackState.target, Math.min(1, dt * 2.2));
    } else if (this.attackState.name.includes('roar') || this.attackState.name.includes('pulse')) {
      this.mesh.scale.setScalar(1 + strike * 0.08);
    } else if (this.attackState.name.includes('lance')) {
      this.mesh.rotation.z = strike * 0.16;
    }

    if (this.attackState.time <= 0) {
      this.mesh.rotation.x = 0;
      this.mesh.rotation.z = 0;
      this.mesh.scale.setScalar(1);
      this.attackState = null;
    }
  }

  performAttack() {
    const attack = this.config.attacks[this.attackIndex % this.config.attacks.length];
    this.attackIndex += 1;
    const playerPos = this.player.position.clone();
    this.onCallout?.(attack);

    if (this.performIdentityAttack(attack, playerPos)) {
      return;
    }

    if (attack === 'bite') {
      this.lineTelegraph(playerPos, { length: 11, width: 1.6, delay: 0.95, damage: 13, radius: 2.1 });
      this.attackState = { name: attack, time: 0.95, duration: 0.95, target: playerPos };
    } else if (attack === 'burrow') {
      this.circleTelegraph(playerPos, { radius: 3.2, delay: 1.05, damage: 16 });
      this.attackState = { name: attack, time: 1.05, duration: 1.05, target: playerPos };
    } else if (attack === 'sweep') {
      this.circleTelegraph(this.mesh.position.clone(), { radius: 6, delay: 1.1, damage: 12 });
      this.attackState = { name: attack, time: 1.1, duration: 1.1, target: this.mesh.position.clone() };
    } else if (attack === 'spit') {
      this.fireProjectile(playerPos, 6, 10, 0.35);
      this.attackState = { name: attack, time: 0.6, duration: 0.6, target: playerPos };
    } else if (attack === 'shards' || attack === 'shard-call') {
      this.spawnAdd();
      this.spawnAdd();
      this.attackState = { name: attack, time: 0.7, duration: 0.7, target: playerPos };
    } else if (attack === 'signal-lance') {
      this.lineTelegraph(playerPos, { length: 18, width: 1.1, delay: 0.95, damage: 15, radius: 1.6 });
      this.delayedBeam(playerPos, 0.95, 'red');
      this.attackState = { name: attack, time: 0.95, duration: 0.95, target: playerPos };
    } else if (attack === 'static-pounce') {
      this.circleTelegraph(playerPos, { radius: 3.1, delay: 0.9, damage: 15 });
      this.attackState = { name: attack, time: 0.9, duration: 0.9, target: playerPos.clone().setY(this.config.hover) };
    } else if (attack === 'echo-clone') {
      this.spawnClones();
      this.attackState = { name: attack, time: 1.0, duration: 1.0, target: playerPos };
    } else if (attack === 'tower-pulse') {
      this.circleTelegraph(this.mesh.position.clone(), { radius: 8.8, delay: 1.25, damage: 17 });
      this.spawnShockwave(8.8, 'red');
      this.attackState = { name: attack, time: 1.25, duration: 1.25, target: playerPos };
    } else if (attack === 'rail-slam') {
      this.lineTelegraph(playerPos, { length: 20, width: 2.2, delay: 1.05, damage: 18, radius: 2.4 });
      this.attackState = { name: attack, time: 1.05, duration: 1.05, target: playerPos };
    } else if (attack === 'tunnel-collapse') {
      for (let i = 0; i < (this.phase === 2 ? 5 : 3); i += 1) {
        const offset = new THREE.Vector3((Math.random() - 0.5) * 14, 0, (Math.random() - 0.5) * 14);
        this.circleTelegraph(playerPos.clone().add(offset), { radius: 2.2, delay: 1.15 + i * 0.12, damage: 12 });
      }
      this.attackState = { name: attack, time: 1.2, duration: 1.2, target: playerPos };
    } else if (attack === 'core-roar') {
      this.lineTelegraph(playerPos, { length: 16, width: 4.2, delay: 1.0, damage: 16, radius: 3.4 });
      this.delayedBeam(playerPos, 1.0, 'red');
      this.attackState = { name: attack, time: 1.0, duration: 1.0, target: playerPos };
    } else if (attack === 'charge-downline') {
      this.lineTelegraph(playerPos, { length: 24, width: 3.0, delay: 1.15, damage: 20, radius: 3.0 });
      this.attackState = { name: attack, time: 1.15, duration: 1.15, target: playerPos.clone().setY(this.config.hover) };
    } else if (attack === 'summon-crawlers') {
      this.spawnAdd();
      this.spawnAdd();
      if (this.phase === 2) this.spawnAdd();
      this.attackState = { name: attack, time: 0.8, duration: 0.8, target: playerPos };
    } else {
      this.genericAttack(attack, playerPos);
    }
  }

  performIdentityAttack(attack, playerPos) {
    switch (this.id) {
      case 'prism-leviathan':
        this.performPrismAttack(attack, playerPos);
        return true;
      case 'hollow-stag':
        this.performHollowStagAttack(attack, playerPos);
        return true;
      case 'cantor-null':
        this.performCantorAttack(attack, playerPos);
        return true;
      case 'cradle-behemoth':
        this.performCradleAttack(attack, playerPos);
        return true;
      case 'prototype-l0':
        this.performPrototypeAttack(attack, playerPos);
        return true;
      case 'seraphim-veil':
        this.performSeraphAttack(attack, playerPos);
        return true;
      case 'requiem-heart':
        this.performRequiemAttack(playerPos);
        return true;
      default:
        return false;
    }
  }

  performPrismAttack(attack, playerPos) {
    if (attack === 'prism-beam') {
      const offsets = this.phase === 2 ? [-1.3, 0, 1.3] : [-0.9, 0.9];
      offsets.forEach((offset, index) => {
        const target = playerPos.clone().add(new THREE.Vector3(offset * 2, 0, index % 2 ? -1.5 : 1.5));
        this.lineTelegraph(target, { length: 20, width: 1.0, delay: 0.82 + index * 0.08, damage: 14, color: index % 2 ? 'blue' : 'glass' });
        this.delayedBeam(target, 0.82 + index * 0.08, index % 2 ? 'blue' : 'glass');
      });
      this.attackState = { name: 'prism-beam', time: 0.95, duration: 0.95, target: playerPos };
    } else if (attack === 'shatter-rain') {
      const count = this.phase === 2 ? 8 : 5;
      for (let i = 0; i < count; i += 1) {
        const position = this.randomNear(playerPos, 8);
        this.circleTelegraph(position, { radius: 1.7 + Math.random() * 0.6, delay: 0.85 + i * 0.08, damage: 10, color: 'glass' });
        this.delayedImpact(position, 0.85 + i * 0.08, 'glass');
      }
      this.attackState = { name: 'shatter-rain', time: 1.25, duration: 1.25, target: playerPos };
    } else if (attack === 'mirror-clone') {
      this.spawnClones();
      this.ringTelegraph(this.mesh.position.clone(), { radius: 7.2, innerRadius: 3.4, delay: 1.0, damage: 11, color: 'violet' });
      if (this.phase === 2) this.lineTelegraph(playerPos, { length: 18, width: 1.2, delay: 1.05, damage: 12, color: 'glass' });
      this.attackState = { name: 'mirror-clone', time: 1.0, duration: 1.0, target: playerPos };
    } else if (attack === 'tidal-sweep') {
      this.coneTelegraph(playerPos, { radius: 10.5, angle: Math.PI * 0.82, delay: 1.05, damage: 16, color: 'blue' });
      this.attackState = { name: 'tidal-sweep', time: 1.05, duration: 1.05, target: playerPos };
    } else {
      this.ringTelegraph(this.mesh.position.clone(), { radius: 9, innerRadius: 4.2, delay: 1.05, damage: 13, color: 'glass' });
      this.spawnShockwave(9, 'blue');
      this.attackState = { name: 'reflection-pulse', time: 1.05, duration: 1.05, target: playerPos };
    }
  }

  performHollowStagAttack(attack, playerPos) {
    if (attack === 'antler-charge') {
      this.lineTelegraph(playerPos, { length: 22, width: 2.5, delay: 1.0, damage: 18, color: 'amber' });
      for (let i = 0; i < 3; i += 1) {
        const offset = playerPos.clone().lerp(this.mesh.position, i / 3).add(new THREE.Vector3((i - 1) * 1.5, 0, 0));
        this.circleTelegraph(offset, { radius: 1.4, delay: 1.05 + i * 0.08, damage: 8, color: 'red' });
      }
      this.attackState = { name: 'antler-charge', time: 1.0, duration: 1.0, target: playerPos.clone().setY(this.config.hover) };
    } else if (attack === 'root-snare') {
      const count = this.phase === 2 ? 5 : 3;
      for (let i = 0; i < count; i += 1) {
        this.circleTelegraph(this.randomNear(playerPos, 6.5), { radius: 2.4, delay: 0.92 + i * 0.08, damage: 7, status: 'slow', color: 'amber' });
      }
      this.attackState = { name: 'root-snare', time: 1.1, duration: 1.1, target: playerPos };
    } else if (attack === 'thorn-wave') {
      this.coneTelegraph(playerPos, { radius: 11.5, angle: Math.PI * 0.52, delay: 0.95, damage: 15, color: 'amber' });
      this.attackState = { name: 'thorn-wave', time: 0.95, duration: 0.95, target: playerPos };
    } else if (attack === 'heartbeat-pulse') {
      this.ringTelegraph(this.mesh.position.clone(), { radius: this.phase === 2 ? 10 : 8.2, innerRadius: 2.7, delay: 1.12, damage: 16, color: 'red' });
      this.spawnShockwave(this.phase === 2 ? 10 : 8.2, 'red');
      this.attackState = { name: 'heartbeat-pulse', time: 1.12, duration: 1.12, target: playerPos };
    } else {
      this.spawnAdd();
      this.spawnAdd();
      if (this.phase === 2) this.circleTelegraph(playerPos, { radius: 3.8, delay: 0.95, damage: 12, status: 'slow', color: 'violet' });
      this.attackState = { name: 'wraith-bloom', time: 0.9, duration: 0.9, target: playerPos };
    }
  }

  performCantorAttack(attack, playerPos) {
    if (attack === 'sonic-ring') {
      this.ringTelegraph(this.mesh.position.clone(), { radius: 8.4, innerRadius: 3.2, delay: 0.95, damage: 15, color: 'violet' });
      if (this.phase === 2) {
        this.phaseAnchors.forEach((anchor, index) => {
          this.ringTelegraph(anchor.position.clone(), { radius: 5.2, innerRadius: 2.1, delay: 1.08 + index * 0.08, damage: 9, color: 'blue' });
        });
      }
      this.spawnShockwave(8.4, 'violet');
      this.attackState = { name: 'sonic-ring', time: 1.0, duration: 1.0, target: playerPos };
    } else if (attack === 'resonance-beam') {
      this.lineTelegraph(playerPos, { length: 21, width: 1.35, delay: 0.9, damage: 16, color: 'blue' });
      this.delayedBeam(playerPos, 0.9, 'violet');
      this.attackState = { name: 'resonance-beam', time: 0.9, duration: 0.9, target: playerPos };
    } else if (attack === 'silence-field') {
      this.circleTelegraph(playerPos, { radius: 4.3, delay: 0.95, damage: 6, status: 'silence', color: 'blue' });
      this.ringTelegraph(playerPos, { radius: 6.2, innerRadius: 4.5, delay: 1.05, damage: 8, color: 'violet' });
      this.attackState = { name: 'silence-field', time: 1.05, duration: 1.05, target: playerPos };
    } else if (attack === 'shatter-note') {
      const notes = this.phase === 2 ? 6 : 4;
      for (let i = 0; i < notes; i += 1) {
        const position = this.randomNear(playerPos, 8.5);
        this.circleTelegraph(position, { radius: 1.9, delay: 0.85 + i * 0.12, damage: 11, color: i % 2 ? 'blue' : 'violet' });
        this.delayedImpact(position, 0.85 + i * 0.12, i % 2 ? 'blue' : 'violet');
      }
      this.attackState = { name: 'shatter-note', time: 1.25, duration: 1.25, target: playerPos };
    } else {
      this.spawnAdd();
      this.spawnAdd();
      if (this.phase === 2) this.spawnAdd();
      this.attackState = { name: 'choir-summon', time: 0.75, duration: 0.75, target: playerPos };
    }
  }

  performCradleAttack(attack, playerPos) {
    if (attack === 'trample-charge') {
      this.lineTelegraph(playerPos, { length: 24, width: 4.2, delay: 1.08, damage: this.phase === 2 ? 24 : 17, color: 'amber' });
      this.attackState = { name: 'trample-charge', time: 1.08, duration: 1.08, target: playerPos.clone().setY(this.config.hover) };
    } else if (attack === 'core-mortar' || attack === 'ashfall') {
      const count = this.phase === 2 ? 7 : 4;
      for (let i = 0; i < count; i += 1) {
        const position = this.randomNear(playerPos, 9.5);
        this.circleTelegraph(position, { radius: 2.2 + Math.random() * 0.7, delay: 1.0 + i * 0.08, damage: 12, color: i % 2 ? 'red' : 'amber' });
        this.delayedImpact(position, 1.0 + i * 0.08, 'amber');
      }
      this.attackState = { name: attack, time: 1.35, duration: 1.35, target: playerPos };
    } else if (attack === 'ground-quake') {
      this.ringTelegraph(this.mesh.position.clone(), { radius: 7, innerRadius: 2.2, delay: 0.92, damage: 13, color: 'red' });
      this.ringTelegraph(this.mesh.position.clone(), { radius: 11, innerRadius: 7.4, delay: 1.22, damage: 13, color: 'amber' });
      this.attackState = { name: 'ash-quake', time: 1.22, duration: 1.22, target: playerPos };
    } else {
      this.ringTelegraph(this.mesh.position.clone(), { radius: 8.8, innerRadius: 3.8, delay: 1.0, damage: this.phase === 2 ? 19 : 10, color: 'red' });
      if (this.phase === 1) this.spawnShockwave(6.5, 'amber');
      this.attackState = { name: 'armor-break', time: 1.0, duration: 1.0, target: playerPos };
    }
  }

  performPrototypeAttack(attack, playerPos) {
    if (attack === 'blade-rush') {
      this.lineTelegraph(playerPos, { length: 19, width: 2.2, delay: 0.78, damage: 18, color: 'red' });
      this.attackState = { name: 'blade-rush', time: 0.78, duration: 0.78, target: playerPos.clone().setY(this.config.hover) };
    } else if (attack === 'rifle-burst') {
      [-1.25, 0, 1.25].forEach((offset, index) => {
        const target = playerPos.clone().add(new THREE.Vector3(offset * 1.6, 0, index % 2 ? -1.2 : 1.2));
        this.lineTelegraph(target, { length: 22, width: 0.9, delay: 0.62 + index * 0.22, damage: 9, color: 'blue' });
        this.delayedBeam(target, 0.62 + index * 0.22, 'blue');
      });
      this.attackState = { name: 'rifle-burst', time: 1.15, duration: 1.15, target: playerPos };
    } else if (attack === 'false-overdrive') {
      this.coneTelegraph(playerPos, { radius: 10, angle: Math.PI * 0.55, delay: 1.0, damage: 21, color: 'violet' });
      this.onBossEffect?.('glitch');
      this.attackState = { name: 'false-overdrive', time: 1.0, duration: 1.0, target: playerPos };
    } else if (attack === 'sync-overload') {
      this.circleTelegraph(playerPos, { radius: 4.8, delay: 0.95, damage: 10, status: 'silence', color: 'violet' });
      this.onBossEffect?.('glitch');
      this.attackState = { name: 'sync-glitch', time: 0.95, duration: 0.95, target: playerPos };
    } else {
      this.spawnClones();
      this.lineTelegraph(playerPos, { length: 18, width: 1.8, delay: 0.92, damage: 13, color: this.phase === 2 ? 'blue' : 'red' });
      this.attackState = { name: 'mirror-aegis', time: 0.92, duration: 0.92, target: playerPos };
    }
  }

  performSeraphAttack(attack, playerPos) {
    if (attack === 'feather-lance') {
      const base = angleTo(this.mesh.position, playerPos);
      const fan = this.phase === 2 ? [-0.36, -0.18, 0, 0.18, 0.36] : [-0.24, 0, 0.24];
      fan.forEach((offset, index) => {
        this.orientedLineTelegraph(base + offset, { length: 22, width: 0.85, delay: 0.78 + index * 0.06, damage: 10, color: index % 2 ? 'blue' : 'glass' });
      });
      this.attackState = { name: 'feather-lance', time: 0.95, duration: 0.95, target: playerPos };
    } else if (attack === 'gravity-well') {
      this.circleTelegraph(playerPos, { radius: 5.4, delay: 1.15, damage: 14, pullStrength: 5.2, color: 'violet' });
      this.attackState = { name: 'gravity-well', time: 1.15, duration: 1.15, target: playerPos };
    } else if (attack === 'wing-barrage') {
      const base = angleTo(this.mesh.position, playerPos);
      [-0.45, 0, 0.45].forEach((offset, index) => {
        this.coneTelegraphAt(base + offset, { radius: 10, angle: Math.PI * 0.28, delay: 0.8 + index * 0.18, damage: 11, color: index % 2 ? 'violet' : 'blue' });
      });
      this.attackState = { name: 'wing-barrage', time: 1.18, duration: 1.18, target: playerPos };
    } else if (attack === 'rift-collapse') {
      const count = this.phase === 2 ? 7 : 5;
      for (let i = 0; i < count; i += 1) {
        const position = this.randomNear(playerPos, 9);
        this.circleTelegraph(position, { radius: 2.3, delay: 0.9 + i * 0.11, damage: 12, color: 'violet' });
        this.delayedImpact(position, 0.9 + i * 0.11, 'violet');
      }
      this.attackState = { name: 'rift-collapse', time: 1.35, duration: 1.35, target: playerPos };
    } else {
      this.ringTelegraph(playerPos, { radius: 6.8, innerRadius: 2.8, delay: 1.0, damage: 13, pullStrength: 3.4, color: 'glass' });
      this.attackState = { name: 'light-dark-zones', time: 1.0, duration: 1.0, target: playerPos };
    }
  }

  performRequiemAttack(playerPos) {
    const phaseSets = {
      1: ['worm-burrow-memory', 'worm-lunge-memory', 'rift-shard-memory'],
      2: ['signal-beam-memory', 'signal-ring-memory', 'signal-clone-memory'],
      3: ['prototype-blade-memory', 'prototype-rifle-memory', 'prototype-overdrive-memory'],
      4: ['heart-exposed-pulse', 'heart-crossfire', 'heart-overdrive-window']
    };
    const attacks = phaseSets[this.phase] || phaseSets[1];
    const attack = attacks[this.attackIndex % attacks.length];

    if (attack === 'worm-burrow-memory') {
      this.circleTelegraph(playerPos, { radius: 3.4, delay: 0.95, damage: 16, color: 'red' });
      this.ringTelegraph(playerPos, { radius: 6.4, innerRadius: 3.8, delay: 1.18, damage: 10, color: 'violet' });
    } else if (attack === 'worm-lunge-memory') {
      this.lineTelegraph(playerPos, { length: 20, width: 2.2, delay: 0.9, damage: 17, color: 'red' });
    } else if (attack === 'rift-shard-memory') {
      for (let i = 0; i < 5; i += 1) {
        const position = this.randomNear(playerPos, 8);
        this.circleTelegraph(position, { radius: 1.9, delay: 0.82 + i * 0.1, damage: 10, color: 'violet' });
        this.delayedImpact(position, 0.82 + i * 0.1, 'violet');
      }
    } else if (attack === 'signal-beam-memory') {
      [-0.25, 0.25].forEach((offset, index) => {
        const base = angleTo(this.mesh.position, playerPos) + offset;
        this.orientedLineTelegraph(base, { length: 23, width: 1, delay: 0.82 + index * 0.1, damage: 13, color: 'blue' });
      });
    } else if (attack === 'signal-ring-memory') {
      this.ringTelegraph(this.mesh.position.clone(), { radius: 9.4, innerRadius: 4.1, delay: 1.0, damage: 15, color: 'blue' });
      this.circleTelegraph(playerPos, { radius: 3.8, delay: 0.95, damage: 5, status: 'silence', color: 'violet' });
    } else if (attack === 'signal-clone-memory') {
      this.spawnClones();
      this.spawnAdd();
    } else if (attack === 'prototype-blade-memory') {
      this.lineTelegraph(playerPos, { length: 21, width: 2.3, delay: 0.75, damage: 18, color: 'red' });
      this.onBossEffect?.('glitch');
    } else if (attack === 'prototype-rifle-memory') {
      [-1, 0, 1].forEach((offset, index) => {
        const target = playerPos.clone().add(new THREE.Vector3(offset * 2.2, 0, 0));
        this.lineTelegraph(target, { length: 23, width: 0.95, delay: 0.62 + index * 0.18, damage: 10, color: 'blue' });
        this.delayedBeam(target, 0.62 + index * 0.18, 'blue');
      });
    } else if (attack === 'prototype-overdrive-memory') {
      this.coneTelegraph(playerPos, { radius: 11, angle: Math.PI * 0.62, delay: 1.0, damage: 22, color: 'violet' });
    } else if (attack === 'heart-crossfire') {
      const base = angleTo(this.mesh.position, playerPos);
      [-0.55, 0, 0.55].forEach((offset, index) => {
        this.orientedLineTelegraph(base + offset, { length: 24, width: 0.9, delay: 0.78 + index * 0.12, damage: 11, color: index % 2 ? 'blue' : 'red' });
      });
      this.onBossEffect?.('glitch');
    } else if (attack === 'heart-overdrive-window') {
      this.ringTelegraph(this.mesh.position.clone(), { radius: 10.5, innerRadius: 5.2, delay: 1.2, damage: 17, color: 'violet' });
      this.spawnShockwave(10.5, 'violet');
    } else {
      this.circleTelegraph(this.mesh.position.clone(), { radius: 8.5, delay: 1.0, damage: 14, color: 'red' });
      this.ringTelegraph(playerPos, { radius: 6, innerRadius: 2.4, delay: 1.18, damage: 12, pullStrength: 4, color: 'blue' });
    }

    this.attackState = { name: attack, time: 1.2, duration: 1.2, target: playerPos };
  }

  genericAttack(attack, playerPos) {
    if (attack.includes('beam') || attack.includes('lance') || attack.includes('wave') || attack.includes('memory')) {
      this.lineTelegraph(playerPos, {
        length: attack.includes('colossus') ? 24 : 18,
        width: attack.includes('wave') ? 3.4 : 1.35,
        delay: 0.95,
        damage: this.phase === 2 ? 18 : 14,
        radius: attack.includes('wave') ? 3 : 1.7
      });
      this.delayedBeam(playerPos, 0.95, attack.includes('prism') || attack.includes('seraphim') ? 'blue' : 'red');
      this.attackState = { name: attack, time: 0.95, duration: 0.95, target: playerPos };
      return;
    }

    if (attack.includes('rain') || attack.includes('ashfall') || attack.includes('barrage') || attack.includes('collapse')) {
      const count = this.phase === 2 ? 6 : 4;
      for (let i = 0; i < count; i += 1) {
        const offset = new THREE.Vector3((Math.random() - 0.5) * 17, 0, (Math.random() - 0.5) * 17);
        this.circleTelegraph(playerPos.clone().add(offset), {
          radius: 2 + Math.random() * 0.9,
          delay: 0.95 + i * 0.1,
          damage: 11
        });
      }
      this.attackState = { name: attack, time: 1.2, duration: 1.2, target: playerPos };
      return;
    }

    if (attack.includes('clone') || attack.includes('mirror')) {
      this.spawnClones();
      this.circleTelegraph(this.mesh.position.clone(), { radius: 5.5, delay: 1.05, damage: 10 });
      this.attackState = { name: attack, time: 1.05, duration: 1.05, target: playerPos };
      return;
    }

    if (attack.includes('summon') || attack.includes('bloom')) {
      this.spawnAdd();
      this.spawnAdd();
      if (this.phase === 2) this.spawnAdd();
      this.attackState = { name: attack, time: 0.8, duration: 0.8, target: playerPos };
      return;
    }

    if (attack.includes('mortar') || attack.includes('burst') || attack.includes('note')) {
      const shots = this.phase === 2 ? 4 : 2;
      for (let i = 0; i < shots; i += 1) {
        const offset = new THREE.Vector3((i - shots / 2) * 1.6, 0, i % 2 ? 1.2 : -1.2);
        this.fireProjectile(playerPos.clone().add(offset), 6.8, 10, 0.32);
      }
      this.attackState = { name: attack, time: 0.8, duration: 0.8, target: playerPos };
      return;
    }

    if (attack.includes('pulse') || attack.includes('ring') || attack.includes('field') || attack.includes('quake') || attack.includes('overload')) {
      const radius = attack.includes('heart') ? 10 : 7.5;
      this.circleTelegraph(this.mesh.position.clone(), {
        radius,
        delay: 1.15,
        damage: this.phase === 2 ? 19 : 15
      });
      this.spawnShockwave(radius, attack.includes('seraphim') ? 'blue' : 'red');
      this.attackState = { name: attack, time: 1.15, duration: 1.15, target: playerPos };
      return;
    }

    if (attack.includes('snare') || attack.includes('well') || attack.includes('zones')) {
      this.circleTelegraph(playerPos, {
        radius: attack.includes('well') ? 4.2 : 3,
        delay: 1.05,
        damage: 14
      });
      this.attackState = { name: attack, time: 1.05, duration: 1.05, target: playerPos };
      return;
    }

    this.lineTelegraph(playerPos, {
      length: 18,
      width: attack.includes('charge') || attack.includes('rush') ? 2.4 : 1.6,
      delay: 0.95,
      damage: this.phase === 2 ? 20 : 15,
      radius: 2.2
    });
    this.attackState = { name: attack, time: 0.95, duration: 0.95, target: playerPos.clone().setY(this.config.hover) };
  }

  lineTelegraph(playerPos, options) {
    const mid = this.mesh.position.clone().lerp(playerPos, 0.5);
    this.telegraphs.add('line', mid, {
      ...options,
      rotationY: angleTo(this.mesh.position, playerPos)
    });
  }

  circleTelegraph(position, options) {
    this.telegraphs.add('circle', position, options);
  }

  ringTelegraph(position, options) {
    this.telegraphs.add('ring', position, options);
  }

  coneTelegraph(playerPos, options) {
    this.telegraphs.add('cone', this.mesh.position.clone(), {
      ...options,
      rotationY: angleTo(this.mesh.position, playerPos)
    });
  }

  coneTelegraphAt(rotationY, options) {
    this.telegraphs.add('cone', this.mesh.position.clone(), {
      ...options,
      rotationY
    });
  }

  orientedLineTelegraph(rotationY, options) {
    const length = options.length || 18;
    const forward = new THREE.Vector3(Math.sin(rotationY), 0, Math.cos(rotationY));
    const position = this.mesh.position.clone().add(forward.multiplyScalar(length * 0.5));
    this.telegraphs.add('line', position, {
      ...options,
      length,
      rotationY
    });
  }

  randomNear(center, spread = 8) {
    return center.clone().add(new THREE.Vector3((Math.random() - 0.5) * spread, 0, (Math.random() - 0.5) * spread));
  }

  delayedImpact(position, delay, color = 'red') {
    setTimeout(() => {
      if (this.hp <= 0) return;
      const impact = VFXFactory.createImpact(color);
      impact.position.copy(position);
      impact.position.y += 0.8;
      this.scene.add(impact);
      this.effects.push(impact);
    }, delay * 1000);
  }

  spawnCantorTowers() {
    if (this.phaseAnchors.length) return;
    for (let i = 0; i < 3; i += 1) {
      const tower = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.42, 3.2, 12), ModelFactory.material('black').clone());
      body.position.y = 1.6;
      const speaker = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 8, 36), ModelFactory.material(i % 2 ? 'blue' : 'violet').clone());
      speaker.position.y = 3.2;
      speaker.rotation.x = Math.PI / 2;
      tower.add(body, speaker);
      const angle = (i / 3) * Math.PI * 2 + 0.35;
      tower.position.set(Math.cos(angle) * 13, 0, Math.sin(angle) * 13);
      this.scene.add(tower);
      this.phaseAnchors.push(tower);
    }
  }

  shedCradleArmor() {
    this.mesh.traverse((child) => {
      if (!child.name?.includes('arc9-plate')) return;
      child.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 3, Math.random() * 2, (Math.random() - 0.5) * 3);
      child.userData.life = 1.6;
    });
  }

  fireProjectile(playerPos, speed, damage, radius) {
    const projectile = new THREE.Mesh(
      new THREE.SphereGeometry(radius, 16, 10),
      ModelFactory.material('red').clone()
    );
    projectile.position.copy(this.mesh.position).add(new THREE.Vector3(0, 1.2, 0));
    projectile.userData.velocity = playerPos.sub(projectile.position).normalize().multiplyScalar(speed);
    projectile.userData.damage = damage;
    this.scene.add(projectile);
    this.projectiles.push(projectile);
  }

  delayedBeam(playerPos, delay, color) {
    setTimeout(() => {
      if (this.hp <= 0) return;
      const origin = this.mesh.position.clone().add(new THREE.Vector3(0, 1.4, 0));
      const target = playerPos.clone().add(new THREE.Vector3(0, 1.2, 0));
      const beam = VFXFactory.createEnergyBeam(origin.distanceTo(target), color);
      beam.position.copy(origin.clone().lerp(target, 0.5));
      beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), target.clone().sub(origin).normalize());
      this.scene.add(beam);
      this.effects.push(beam);
    }, delay * 1000);
  }

  spawnShockwave(radius, color) {
    const shockwave = VFXFactory.createShockwave(radius, color);
    shockwave.position.copy(this.mesh.position);
    shockwave.position.y = 0.18;
    this.scene.add(shockwave);
    this.effects.push(shockwave);
  }

  spawnClones() {
    this.clearClones();
    for (let i = 0; i < 2; i += 1) {
      const factory = ModelFactory[this.mission.bossFactory] || ModelFactory.createEchoStalker;
      const clone = factory.call(ModelFactory);
      clone.scale.copy(this.mesh.scale).multiplyScalar(0.9);
      clone.position.copy(this.mesh.position).add(new THREE.Vector3(i ? 4 : -4, 0, -2 + i * 4));
      clone.traverse((child) => {
        if (child.material) {
          child.material = child.material.clone();
          child.material.transparent = true;
          child.material.opacity = 0.35;
        }
      });
      clone.userData.life = 3.2;
      this.scene.add(clone);
      this.clones.push(clone);
    }
  }

  spawnAdd() {
    if (this.adds.length >= this.config.addLimit) return;
    const add = this.config.addType === 'veil-crawler'
      ? ModelFactory.createVeilCrawler()
      : ModelFactory.createRiftShard();
    const angle = Math.random() * Math.PI * 2;
    const distance = this.config.addType === 'veil-crawler' ? 11 : 8;
    add.position.set(Math.cos(angle) * distance, this.config.addType === 'veil-crawler' ? 0 : 1.6, Math.sin(angle) * distance);
    add.userData.hp = this.config.addType === 'veil-crawler' ? 24 : 18;
    add.userData.damage = this.config.addType === 'veil-crawler' ? 7 : 5;
    this.scene.add(add);
    this.adds.push(add);
    this.addsSpawned += 1;
  }

  updateProjectiles(dt) {
    this.projectiles = this.projectiles.filter((projectile) => {
      projectile.position.addScaledVector(projectile.userData.velocity, dt);
      if (projectile.position.distanceTo(this.player.position) < 1.4) {
        this.onProjectileHit(projectile.userData.damage || 10);
        this.scene.remove(projectile);
        return false;
      }
      if (projectile.position.length() > 46) {
        this.scene.remove(projectile);
        return false;
      }
      return true;
    });
  }

  updateAdds(dt) {
    this.adds = this.adds.filter((add) => {
      add.rotation.y += dt * 2.4;
      const direction = this.player.position.clone().sub(add.position).normalize();
      add.position.addScaledVector(direction, dt * (this.config.addType === 'veil-crawler' ? 2.5 : 1.8));
      if (add.position.distanceTo(this.player.position) < 1.4) {
        this.onProjectileHit(add.userData.damage || 5);
        this.scene.remove(add);
        return false;
      }
      return true;
    });
  }

  updateClones(dt) {
    this.clones = this.clones.filter((clone) => {
      clone.userData.life -= dt;
      clone.rotation.y += dt * 1.2;
      clone.traverse((child) => {
        if (child.material?.opacity !== undefined) child.material.opacity = Math.max(0, clone.userData.life / 3.2 * 0.35);
      });
      if (clone.userData.life <= 0) {
        this.scene.remove(clone);
        return false;
      }
      return true;
    });
  }

  updateEffects(dt) {
    this.effects = this.effects.filter((effect) => {
      const alive = effect.userData.effectType === 'impact'
        ? VFXFactory.updateImpact(effect, dt)
        : VFXFactory.updateTimedEffect(effect, dt);
      if (!alive) this.scene.remove(effect);
      return alive;
    });
  }

  updateSheddingParts(dt) {
    this.mesh.traverse((child) => {
      if (!child.userData?.life || !child.userData.velocity) return;
      child.userData.life -= dt;
      child.position.addScaledVector(child.userData.velocity, dt);
      child.rotation.x += dt * 2.1;
      child.rotation.z += dt * 1.4;
      if (child.material?.opacity !== undefined) {
        child.material.transparent = true;
        child.material.opacity = Math.max(0, child.userData.life / 1.6);
      }
      if (child.userData.life <= 0) {
        child.visible = false;
        child.userData.velocity = null;
      }
    });
  }

  clearClones() {
    this.clones.forEach((clone) => this.scene.remove(clone));
    this.clones = [];
  }

  clearAdds() {
    this.projectiles.forEach((projectile) => this.scene.remove(projectile));
    this.adds.forEach((add) => this.scene.remove(add));
    this.effects.forEach((effect) => this.scene.remove(effect));
    this.phaseAnchors.forEach((anchor) => this.scene.remove(anchor));
    this.clearClones();
    this.projectiles = [];
    this.adds = [];
    this.effects = [];
    this.phaseAnchors = [];
  }
}
