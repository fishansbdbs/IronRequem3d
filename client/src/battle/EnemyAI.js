import * as THREE from 'three';
import { BATTLE_BALANCE } from '../../../shared/balance.js';
import { ModelFactory } from '../game/ModelFactory.js';

const ATTACKS = ['bite', 'burrow', 'spit', 'sweep', 'shards'];

export class EnemyAI {
  constructor({ scene, bossMesh, telegraphs, player, onProjectileHit }) {
    this.scene = scene;
    this.mesh = bossMesh;
    this.telegraphs = telegraphs;
    this.player = player;
    this.onProjectileHit = onProjectileHit;
    this.hp = BATTLE_BALANCE.bossHull;
    this.maxHp = BATTLE_BALANCE.bossHull;
    this.attackTimer = 1.5;
    this.attackIndex = 0;
    this.projectiles = [];
    this.shards = [];
    this.phase = 1;
  }

  damage(amount) {
    this.hp = Math.max(0, this.hp - amount);
    this.mesh.traverse((child) => {
      if (child.material?.emissive) child.material.emissiveIntensity = 2.2;
    });
    setTimeout(() => {
      this.mesh.traverse((child) => {
        if (child.material?.emissive) child.material.emissiveIntensity = 1.2;
      });
    }, 90);
  }

  update(dt) {
    if (this.hp <= 0) {
      this.mesh.rotation.z += dt * 1.8;
      this.mesh.position.y = Math.max(-1.4, this.mesh.position.y - dt * 1.6);
      return;
    }

    this.phase = this.hp < this.maxHp * 0.45 ? 2 : 1;
    this.attackTimer -= dt;
    this.mesh.position.y = 1 + Math.sin(performance.now() * 0.002) * 0.18;
    this.mesh.lookAt(this.player.position.x, this.mesh.position.y, this.player.position.z);

    if (this.attackTimer <= 0) {
      this.performAttack();
      this.attackTimer = this.phase === 2 ? 1.75 : 2.4;
    }

    this.updateProjectiles(dt);
    this.updateShards(dt);
  }

  performAttack() {
    const attack = ATTACKS[this.attackIndex % ATTACKS.length];
    this.attackIndex += 1;
    const playerPos = this.player.position.clone();

    if (attack === 'bite') {
      this.telegraphs.add('line', this.mesh.position.clone().lerp(playerPos, 0.45), {
        length: 11,
        width: 1.6,
        delay: 0.95,
        damage: 13,
        radius: 2.1
      });
    } else if (attack === 'burrow') {
      this.telegraphs.add('circle', playerPos, { radius: 3.2, delay: 1.05, damage: 16 });
    } else if (attack === 'sweep') {
      this.telegraphs.add('circle', this.mesh.position.clone(), { radius: 6, delay: 1.1, damage: 12 });
    } else if (attack === 'spit') {
      const projectile = new THREE.Mesh(
        new THREE.SphereGeometry(0.35, 16, 10),
        ModelFactory.material('red')
      );
      projectile.position.copy(this.mesh.position).add(new THREE.Vector3(0, 1.2, 0));
      projectile.userData.velocity = playerPos.sub(projectile.position).normalize().multiplyScalar(6);
      this.scene.add(projectile);
      this.projectiles.push(projectile);
    } else if (attack === 'shards') {
      this.spawnShard();
    }
  }

  spawnShard() {
    if (this.shards.length >= BATTLE_BALANCE.shardLimit) return;
    const shard = ModelFactory.createRiftShard();
    const angle = Math.random() * Math.PI * 2;
    shard.position.set(Math.cos(angle) * 8, 1.6, Math.sin(angle) * 8);
    shard.userData.hp = 18;
    this.scene.add(shard);
    this.shards.push(shard);
  }

  updateProjectiles(dt) {
    this.projectiles = this.projectiles.filter((projectile) => {
      projectile.position.addScaledVector(projectile.userData.velocity, dt);
      if (projectile.position.distanceTo(this.player.position) < 1.4) {
        this.onProjectileHit(10);
        this.scene.remove(projectile);
        return false;
      }
      if (projectile.position.length() > 42) {
        this.scene.remove(projectile);
        return false;
      }
      return true;
    });
  }

  updateShards(dt) {
    this.shards = this.shards.filter((shard) => {
      shard.rotation.y += dt * 2;
      const direction = this.player.position.clone().sub(shard.position).normalize();
      shard.position.addScaledVector(direction, dt * 1.8);
      if (shard.position.distanceTo(this.player.position) < 1.4) {
        this.onProjectileHit(5);
        this.scene.remove(shard);
        return false;
      }
      return true;
    });
  }

  clearAdds() {
    this.projectiles.forEach((projectile) => this.scene.remove(projectile));
    this.shards.forEach((shard) => this.scene.remove(shard));
    this.projectiles = [];
    this.shards = [];
  }
}
