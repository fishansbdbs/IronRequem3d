import * as THREE from 'three';
import { BATTLE_BALANCE } from '../../../shared/balance.js';
import { ModelFactory } from '../game/ModelFactory.js';
import { VFXFactory } from '../game/VFXFactory.js';

const BOSS_CONFIGS = {
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
  }
};

function angleTo(source, target) {
  const delta = target.clone().sub(source);
  return Math.atan2(delta.x, delta.z);
}

export class EnemyAI {
  constructor({ scene, bossMesh, mission, telegraphs, player, onProjectileHit, onCallout }) {
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
    this.hp = this.config.hp;
    this.maxHp = this.config.hp;
    this.attackTimer = 1.4;
    this.attackIndex = 0;
    this.projectiles = [];
    this.adds = [];
    this.addsSpawned = 0;
    this.clones = [];
    this.effects = [];
    this.phase = 1;
    this.attackState = null;
  }

  damage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    this.mesh.traverse((child) => {
      if (child.material?.emissive) child.material.emissiveIntensity = 2.4;
    });
    setTimeout(() => {
      this.mesh.traverse((child) => {
        if (child.material?.emissive) child.material.emissiveIntensity = this.phase === 2 ? 1.8 : 1.2;
      });
    }, 90);
  }

  update(dt) {
    if (this.hp <= 0) {
      this.mesh.rotation.z += dt * 1.8;
      this.mesh.position.y = Math.max(-1.4, this.mesh.position.y - dt * 1.6);
      this.updateProjectiles(dt);
      this.updateAdds(dt);
      this.updateClones(dt);
      this.updateEffects(dt);
      return;
    }

    const phaseAt = this.config.phaseAt || 0.45;
    this.phase = this.hp < this.maxHp * phaseAt ? 2 : 1;
    this.attackTimer -= dt;
    this.animateBoss(dt);

    if (this.attackTimer <= 0) {
      this.performAttack();
      this.attackTimer = this.config.attackDelay[this.phase - 1];
    }

    this.updateProjectiles(dt);
    this.updateAdds(dt);
    this.updateClones(dt);
    this.updateEffects(dt);
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
    }
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
      const clone = ModelFactory.createEchoStalker();
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
      const alive = VFXFactory.updateTimedEffect(effect, dt);
      if (!alive) this.scene.remove(effect);
      return alive;
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
    this.clearClones();
    this.projectiles = [];
    this.adds = [];
    this.effects = [];
  }
}
