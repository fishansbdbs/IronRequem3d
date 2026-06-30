import * as THREE from 'three';
import { ModelFactory } from '../game/ModelFactory.js';
import { VFXFactory } from '../game/VFXFactory.js';
import { MechaController } from './MechaController.js';
import { WeaponSystem } from './WeaponSystem.js';
import { EnemyAI } from './EnemyAI.js';
import { BossTelegraphSystem } from './BossTelegraphSystem.js';

export class BattleScene {
  constructor({ scene, cameraController, state, audio, battleUI, mission, onVictory }) {
    this.scene = scene;
    this.cameraController = cameraController;
    this.state = state;
    this.audio = audio;
    this.battleUI = battleUI;
    this.mission = mission;
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
    this.buildEnvironment();

    this.aegis = ModelFactory.createAegis7(0.72);
    this.aegis.position.set(-8, 0, 8);
    this.root.add(this.aegis);
    this.mecha = new MechaController(this.aegis, this.state);

    const bossMesh = this.createBossMesh();
    this.root.add(bossMesh);
    this.telegraphs = new BossTelegraphSystem(this.root);
    this.boss = new EnemyAI({
      scene: this.root,
      bossMesh,
      mission: this.mission,
      telegraphs: this.telegraphs,
      player: this.aegis,
      onProjectileHit: (amount) => this.damagePlayer(amount),
      onCallout: () => this.queueCallout()
    });

    this.weapons = new WeaponSystem({
      scene: this.root,
      mecha: this.mecha,
      boss: this.boss,
      audio: this.audio,
      onDamage: (amount, label, position) => this.recordDamage(amount, label, position)
    });
  }

  buildEnvironment() {
    if (this.mission.environment === 'broadcast') {
      this.buildBroadcastDistrict();
    } else if (this.mission.environment === 'redline') {
      this.buildRedlineTunnel();
    } else {
      this.buildCityOutskirts();
    }
  }

  buildCityOutskirts() {
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

    this.stars = VFXFactory.createStars(100, 120);
    this.stars.position.y = 25;
    this.root.add(this.stars);
  }

  buildBroadcastDistrict() {
    this.root.add(ModelFactory.createFloor(54, 54, 0x18222b));

    const street = new THREE.Mesh(
      new THREE.BoxGeometry(11, 0.09, 54),
      new THREE.MeshStandardMaterial({ color: 0x252d35, roughness: 0.82, metalness: 0.12 })
    );
    street.position.y = 0.12;
    this.root.add(street);

    const tower = new THREE.Group();
    for (let i = 0; i < 5; i += 1) {
      const mast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.14, 8 - i * 0.8, 8),
        ModelFactory.material(i % 2 ? 'blue' : 'red')
      );
      mast.position.set(-12 + i * 0.8, 4 - i * 0.25, -15 + i * 0.5);
      mast.rotation.z = -0.4 + i * 0.12;
      tower.add(mast);
    }
    const dish = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.08, 8, 36),
      ModelFactory.material('blue')
    );
    dish.position.set(-9.8, 7.5, -13.8);
    dish.rotation.x = 0.8;
    tower.add(dish);
    this.root.add(tower);

    for (let i = 0; i < 12; i += 1) {
      const height = 2 + Math.random() * 4;
      const building = new THREE.Mesh(
        new THREE.BoxGeometry(3 + Math.random() * 2, height, 2.5 + Math.random() * 2),
        new THREE.MeshStandardMaterial({ color: 0x25313c, roughness: 0.86, metalness: 0.18 })
      );
      building.position.set(i % 2 ? 13 + Math.random() * 8 : -13 - Math.random() * 8, height / 2, -22 + i * 4);
      building.rotation.y = Math.random() * 0.25;
      this.root.add(building);

      const billboard = ModelFactory.createLabel(i % 2 ? 'NO SIGNAL' : 'BAND 9');
      billboard.position.set(building.position.x, height + 1.2, building.position.z);
      billboard.scale.set(3.6, 0.9, 1);
      this.root.add(billboard);
    }

    for (let i = 0; i < 7; i += 1) {
      const dishPost = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.06, 1.4, 8),
        ModelFactory.material('rail')
      );
      dishPost.position.set(-20 + i * 6.2, 0.7, 15 + Math.sin(i) * 5);
      const dishRing = new THREE.Mesh(new THREE.TorusGeometry(0.9, 0.04, 8, 28), ModelFactory.material('blue'));
      dishRing.position.copy(dishPost.position).add(new THREE.Vector3(0, 1, 0));
      dishRing.rotation.x = 0.9;
      this.root.add(dishPost, dishRing);
    }

    this.stars = VFXFactory.createStars(140, 120);
    this.stars.position.y = 22;
    this.root.add(this.stars);
  }

  buildRedlineTunnel() {
    this.root.add(ModelFactory.createFloor(48, 58, 0x151013));

    const ceiling = new THREE.Mesh(
      new THREE.BoxGeometry(48, 0.4, 58),
      new THREE.MeshStandardMaterial({ color: 0x0b0c10, roughness: 0.8, metalness: 0.2 })
    );
    ceiling.position.y = 9;
    this.root.add(ceiling);

    [-23, 23].forEach((x) => {
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(1, 8, 58),
        new THREE.MeshStandardMaterial({ color: 0x25191d, roughness: 0.75, metalness: 0.25 })
      );
      wall.position.set(x, 4, 0);
      this.root.add(wall);
    });

    [-2.1, 2.1].forEach((x) => {
      const rail = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 0.18, 55),
        new THREE.MeshStandardMaterial({ color: 0x42464f, roughness: 0.45, metalness: 0.9 })
      );
      rail.position.set(x, 0.24, 0);
      this.root.add(rail);
    });

    for (let i = 0; i < 14; i += 1) {
      const tie = new THREE.Mesh(
        new THREE.BoxGeometry(7.5, 0.12, 0.42),
        new THREE.MeshStandardMaterial({ color: 0x2d2427, roughness: 0.7, metalness: 0.3 })
      );
      tie.position.set(0, 0.32, -26 + i * 4);
      this.root.add(tie);
    }

    for (let i = 0; i < 10; i += 1) {
      const growth = new THREE.Mesh(new THREE.OctahedronGeometry(0.45 + Math.random() * 0.55), ModelFactory.material('red'));
      growth.position.set(i % 2 ? -20.8 : 20.8, 1.2 + Math.random() * 3, -24 + i * 5.2);
      growth.scale.y = 1.8;
      this.root.add(growth);
      const lamp = new THREE.PointLight(0xff3030, 1.4, 8);
      lamp.position.set(i % 2 ? -18 : 18, 4.4, -24 + i * 5.2);
      this.root.add(lamp);
    }

    const extraction = ModelFactory.createLabel('EXTRACTION');
    extraction.position.set(0, 3.2, 24);
    this.root.add(extraction);
  }

  createBossMesh() {
    const factory = ModelFactory[this.mission.bossFactory] || ModelFactory.createFractureWorm;
    const boss = factory.call(ModelFactory);
    if (this.mission.environment === 'broadcast') {
      boss.scale.setScalar(0.9);
      boss.position.set(8, 0.6, -8);
    } else if (this.mission.environment === 'redline') {
      boss.scale.setScalar(1.05);
      boss.position.set(8, 0.1, -10);
    } else {
      boss.scale.setScalar(0.9);
      boss.position.set(8, 0.6, -8);
    }
    return boss;
  }

  update(dt, input) {
    this.elapsed += dt;
    this.mecha.update(dt, input, this.cameraController);
    this.boss.update(dt);
    this.weapons.update(dt, input, this.state);
    this.telegraphs.update(dt, this.aegis, (telegraph) => this.damagePlayer(telegraph.damage));
    this.battleUI.setDistortion(this.mission.environment === 'broadcast' && Math.sin(this.elapsed * 7) > 0.82);

    this.impacts = this.impacts.filter((effect) => {
      const alive = VFXFactory.updateImpact(effect, dt);
      if (!alive) this.root.remove(effect);
      return alive;
    });

    this.battleUI.update({
      mecha: this.mecha,
      boss: this.boss,
      objective: this.mission.objective
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
      missionId: this.mission.id,
      missionName: this.mission.name,
      hull: hullPercent,
      time: this.elapsed,
      damageDealt: this.damageDealt,
      damageTaken: this.damageTaken,
      shardsDefeated: this.shardsDefeated,
      enemiesDefeated: Math.max(this.shardsDefeated, this.boss.addsSpawned || 0),
      bossDefeated: this.mission.enemy,
      salvage: this.mission.reward.salvage,
      sync: this.mission.reward.sync
    });
  }

  queueCallout() {
    const callouts = this.mission.callouts || [];
    if (!callouts.length || this.elapsed < (this.nextCalloutAt || 0)) return;
    const callout = callouts[this.calloutIndex % callouts.length];
    this.calloutIndex = (this.calloutIndex || 0) + 1;
    this.nextCalloutAt = this.elapsed + 6;
    this.battleUI.callout(callout);
  }

  dispose() {
    this.telegraphs?.clear();
    this.boss?.clearAdds();
    this.scene.remove(this.root);
  }
}
