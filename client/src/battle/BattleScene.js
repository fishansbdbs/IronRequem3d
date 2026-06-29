import * as THREE from 'three';
import { OBJECTIVES } from '../../../shared/constants.js';
import { MISSION_REWARD } from '../../../shared/balance.js';
import { ModelFactory } from '../game/ModelFactory.js';
import { VFXFactory } from '../game/VFXFactory.js';
import { MechaController } from './MechaController.js';
import { WeaponSystem } from './WeaponSystem.js';
import { EnemyAI } from './EnemyAI.js';
import { BossTelegraphSystem } from './BossTelegraphSystem.js';

export class BattleScene {
  constructor({ scene, cameraController, state, audio, battleUI, onVictory }) {
    this.scene = scene;
    this.cameraController = cameraController;
    this.state = state;
    this.audio = audio;
    this.battleUI = battleUI;
    this.onVictory = onVictory;
    this.root = new THREE.Group();
    this.elapsed = 0;
    this.damageDealt = 0;
    this.damageTaken = 0;
    this.shardsDefeated = 0;
    this.victoryTimer = null;
    this.impacts = [];
    this.build();
    scene.add(this.root);
  }

  build() {
    const floor = ModelFactory.createFloor(52, 52, 0x211d1c);
    this.root.add(floor);

    const road = new THREE.Mesh(
      new THREE.BoxGeometry(9, 0.08, 52),
      new THREE.MeshStandardMaterial({ color: 0x2a2e33, roughness: 0.8, metalness: 0.1 })
    );
    road.position.y = 0.13;
    this.root.add(road);

    for (let i = 0; i < 18; i += 1) {
      const height = 1 + Math.random() * 5;
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(2 + Math.random() * 2, height, 2 + Math.random() * 2),
        new THREE.MeshStandardMaterial({ color: 0x37312f, roughness: 0.85, metalness: 0.15 })
      );
      const side = i % 2 ? 1 : -1;
      building.position.set(side * (9 + Math.random() * 11), height / 2, -22 + i * 2.7);
      building.rotation.y = Math.random() * 0.4;
      building.castShadow = true;
      building.receiveShadow = true;
      this.root.add(building);
    }

    for (let i = 0; i < 26; i += 1) {
      const rubble = ModelFactory.createCrate(0.5 + Math.random() * 0.9);
      rubble.position.set((Math.random() - 0.5) * 42, 0, (Math.random() - 0.5) * 42);
      rubble.rotation.y = Math.random() * Math.PI;
      this.root.add(rubble);
    }

    const rift = new THREE.Mesh(
      new THREE.TorusGeometry(6, 0.15, 12, 80),
      ModelFactory.material('red')
    );
    rift.position.set(-18, 16, -26);
    rift.rotation.x = 1.1;
    this.root.add(rift);

    this.aegis = ModelFactory.createAegis7(0.72);
    this.aegis.position.set(-8, 0, 8);
    this.root.add(this.aegis);
    this.mecha = new MechaController(this.aegis, this.state);

    const worm = ModelFactory.createFractureWorm();
    worm.scale.setScalar(0.9);
    worm.position.set(8, 0.6, -8);
    this.root.add(worm);
    this.telegraphs = new BossTelegraphSystem(this.root);
    this.boss = new EnemyAI({
      scene: this.root,
      bossMesh: worm,
      telegraphs: this.telegraphs,
      player: this.aegis,
      onProjectileHit: (amount) => this.damagePlayer(amount)
    });

    this.weapons = new WeaponSystem({
      scene: this.root,
      mecha: this.mecha,
      boss: this.boss,
      audio: this.audio,
      onDamage: (amount, label, position) => this.recordDamage(amount, label, position)
    });

    this.stars = VFXFactory.createStars(100, 120);
    this.stars.position.y = 25;
    this.root.add(this.stars);
  }

  update(dt, input) {
    this.elapsed += dt;
    this.mecha.update(dt, input, this.cameraController);
    this.boss.update(dt);
    this.weapons.update(dt, input, this.state);
    this.telegraphs.update(dt, this.aegis, (telegraph) => this.damagePlayer(telegraph.damage));

    this.impacts = this.impacts.filter((effect) => {
      const alive = VFXFactory.updateImpact(effect, dt);
      if (!alive) this.root.remove(effect);
      return alive;
    });

    this.battleUI.update({
      mecha: this.mecha,
      boss: this.boss,
      objective: OBJECTIVES.DEFEAT_WORM
    });

    if (this.boss.hp <= 0 && !this.victoryTimer) {
      this.telegraphs.clear();
      this.boss.clearAdds();
      this.victoryTimer = 1.8;
    }

    if (this.victoryTimer !== null) {
      this.victoryTimer -= dt;
      if (this.victoryTimer <= 0) {
        this.finishVictory();
      }
    }
  }

  recordDamage(amount, label, position) {
    this.damageDealt += amount;
    this.battleUI.damage(amount, label);
    const impact = VFXFactory.createImpact('red');
    impact.position.copy(position);
    impact.position.y += 1.1;
    this.root.add(impact);
    this.impacts.push(impact);
  }

  damagePlayer(amount) {
    this.mecha.damage(amount);
    this.damageTaken += amount;
    this.audio.hit();
    this.battleUI.damage(amount, 'Hull Damage');
  }

  finishVictory() {
    const hullPercent = (this.mecha.stats.hull / this.mecha.stats.maxHull) * 100;
    this.onVictory({
      hull: hullPercent,
      time: this.elapsed,
      damageDealt: this.damageDealt,
      damageTaken: this.damageTaken,
      shardsDefeated: this.shardsDefeated,
      salvage: MISSION_REWARD.salvage,
      sync: MISSION_REWARD.sync
    });
  }

  dispose() {
    this.telegraphs?.clear();
    this.boss?.clearAdds();
    this.scene.remove(this.root);
  }
}
