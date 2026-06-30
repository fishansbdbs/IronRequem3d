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
    this.glitchTimer = 0;
    this.lowHullCalloutPlayed = false;
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
      onCallout: () => this.queueCallout(),
      onPhaseChange: () => this.queueEventCallout('phase', true),
      onBossEffect: (effect) => this.handleBossEffect(effect)
    });

    this.weapons = new WeaponSystem({
      scene: this.root,
      mecha: this.mecha,
      boss: this.boss,
      audio: this.audio,
      onDamage: (amount, label, position) => this.recordDamage(amount, label, position)
    });
    this.queueEventCallout('start', true);
  }

  buildEnvironment() {
    switch (this.mission.environment) {
      case 'broadcast':
        this.buildBroadcastDistrict();
        break;
      case 'redline':
        this.buildRedlineTunnel();
        break;
      case 'glassed-coast':
        this.buildGlassedCoast();
        break;
      case 'black-orchard':
        this.buildBlackOrchard();
        break;
      case 'silent-choir':
        this.buildSilentChoir();
        break;
      case 'ashfall':
        this.buildAshfallCradle();
        break;
      case 'sealed-lab':
        this.buildSealedLab();
        break;
      case 'sky-rift':
        this.buildSkyRift();
        break;
      case 'veil-core':
        this.buildVeilCore();
        break;
      default:
        this.buildCityOutskirts();
        break;
    }
  }

  buildBattlefieldBase(color, starCount = 120) {
    this.root.add(ModelFactory.createFloor(56, 56, color));
    this.stars = VFXFactory.createStars(starCount, 125);
    this.stars.position.y = 24;
    this.root.add(this.stars);
  }

  addPillars(count, materialKey, radius = 20) {
    for (let i = 0; i < count; i += 1) {
      const height = 1.8 + Math.random() * 4;
      const pillar = new THREE.Mesh(
        new THREE.BoxGeometry(0.7 + Math.random() * 0.9, height, 0.7 + Math.random() * 0.9),
        ModelFactory.material(materialKey).clone()
      );
      const angle = (i / count) * Math.PI * 2;
      pillar.position.set(Math.cos(angle) * radius + (Math.random() - 0.5) * 3, height / 2, Math.sin(angle) * radius + (Math.random() - 0.5) * 3);
      pillar.rotation.y = Math.random() * Math.PI;
      pillar.castShadow = true;
      pillar.receiveShadow = true;
      this.root.add(pillar);
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

  buildGlassedCoast() {
    this.buildBattlefieldBase(0x1b2a2b, 150);

    const tide = new THREE.Mesh(
      new THREE.PlaneGeometry(44, 18),
      new THREE.MeshStandardMaterial({ color: 0x173842, transparent: true, opacity: 0.36, roughness: 0.12, metalness: 0.2 })
    );
    tide.rotation.x = -Math.PI / 2;
    tide.position.set(0, 0.17, 15);
    this.root.add(tide);

    for (let i = 0; i < 16; i += 1) {
      const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.55 + Math.random() * 1.1), ModelFactory.material(i % 2 ? 'glass' : 'blue').clone());
      shard.position.set((Math.random() - 0.5) * 46, 0.65 + Math.random() * 1.7, (Math.random() - 0.5) * 46);
      shard.scale.y = 1.7 + Math.random();
      shard.rotation.set(Math.random(), Math.random(), Math.random());
      this.root.add(shard);
    }

    for (let i = 0; i < 5; i += 1) {
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.16, 3.2, 1.7), ModelFactory.material('glass').clone());
      mirror.position.set(-18 + i * 9, 1.7, -17 + Math.sin(i) * 2);
      mirror.rotation.y = -0.45 + i * 0.22;
      this.root.add(mirror);
    }

    const horizon = ModelFactory.createLabel('GLASS HORIZON');
    horizon.position.set(0, 4, -24);
    horizon.scale.set(4, 1, 1);
    this.root.add(horizon);
  }

  buildBlackOrchard() {
    this.buildBattlefieldBase(0x191a13, 110);
    for (let i = 0; i < 9; i += 1) {
      const vein = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 7 + Math.random() * 4), ModelFactory.material(i % 2 ? 'red' : 'amber').clone());
      vein.position.set((Math.random() - 0.5) * 34, 0.2, (Math.random() - 0.5) * 34);
      vein.rotation.y = Math.random() * Math.PI;
      this.root.add(vein);
    }
    for (let i = 0; i < 22; i += 1) {
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.24, 3 + Math.random() * 3, 7), ModelFactory.material('rail').clone());
      trunk.position.set((Math.random() - 0.5) * 44, 1.5, (Math.random() - 0.5) * 44);
      trunk.rotation.z = (Math.random() - 0.5) * 0.45;
      this.root.add(trunk);

      const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.55 + Math.random() * 0.45), ModelFactory.material(i % 2 ? 'amber' : 'red').clone());
      crown.position.copy(trunk.position).add(new THREE.Vector3(0, 2.2 + Math.random(), 0));
      this.root.add(crown);
    }
    this.addPillars(8, 'amber', 19);
  }

  buildSilentChoir() {
    this.buildBattlefieldBase(0x111821, 150);
    this.addPillars(12, 'blue', 18);
    for (let i = 0; i < 4; i += 1) {
      const tower = new THREE.Group();
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.46, 4.2, 12), ModelFactory.material('black').clone());
      body.position.y = 2.1;
      const dish = new THREE.Mesh(new THREE.TorusGeometry(0.95, 0.05, 8, 42), ModelFactory.material(i % 2 ? 'violet' : 'blue').clone());
      dish.position.y = 4.15;
      dish.rotation.x = Math.PI / 2;
      tower.add(body, dish);
      const angle = (i / 4) * Math.PI * 2;
      tower.position.set(Math.cos(angle) * 15, 0, Math.sin(angle) * 15);
      this.root.add(tower);
    }
    for (let i = 0; i < 4; i += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(5 + i * 3, 0.035, 8, 96), ModelFactory.material(i % 2 ? 'violet' : 'blue'));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.2 + i * 0.08;
      this.root.add(ring);
    }
    const altar = ModelFactory.createLabel('SILENT CHOIR');
    altar.position.set(0, 4.2, -22);
    this.root.add(altar);
  }

  buildAshfallCradle() {
    this.buildBattlefieldBase(0x231816, 95);
    for (let i = 0; i < 24; i += 1) {
      const wreck = ModelFactory.createCrate(0.65 + Math.random() * 1.1);
      wreck.position.set((Math.random() - 0.5) * 42, 0, (Math.random() - 0.5) * 42);
      wreck.rotation.set(Math.random() * 0.4, Math.random() * Math.PI, Math.random() * 0.3);
      this.root.add(wreck);
    }
    for (let i = 0; i < 5; i += 1) {
      const crater = new THREE.Mesh(new THREE.TorusGeometry(3 + i * 1.4, 0.07, 8, 64), ModelFactory.material('red'));
      crater.rotation.x = Math.PI / 2;
      crater.position.set((Math.random() - 0.5) * 20, 0.18, (Math.random() - 0.5) * 20);
      this.root.add(crater);
    }
    for (let i = 0; i < 6; i += 1) {
      const vent = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.36, 1.1, 9), ModelFactory.material(i % 2 ? 'red' : 'amber').clone());
      vent.position.set((Math.random() - 0.5) * 38, 0.55, (Math.random() - 0.5) * 38);
      vent.rotation.z = (Math.random() - 0.5) * 0.45;
      this.root.add(vent);
    }
  }

  buildSealedLab() {
    this.root.add(ModelFactory.createFloor(48, 48, 0x11151a));
    const gridMat = new THREE.MeshStandardMaterial({ color: 0x222c36, roughness: 0.55, metalness: 0.65 });
    for (let i = 0; i < 9; i += 1) {
      const lineA = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 48), gridMat);
      lineA.position.set(-24 + i * 6, 0.18, 0);
      const lineB = new THREE.Mesh(new THREE.BoxGeometry(48, 0.08, 0.08), gridMat);
      lineB.position.set(0, 0.19, -24 + i * 6);
      this.root.add(lineA, lineB);
    }
    this.addPillars(10, 'red', 20);
    for (let i = 0; i < 4; i += 1) {
      const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.65, 0.65, 2.4, 16), ModelFactory.material(i % 2 ? 'blue' : 'red').clone());
      pod.position.set(-15 + i * 10, 1.2, 14);
      pod.rotation.z = Math.PI / 2;
      this.root.add(pod);
      const cable = new THREE.Mesh(new THREE.TorusGeometry(1.2, 0.035, 8, 36), ModelFactory.material('rail').clone());
      cable.position.set(pod.position.x, 0.28, 10.8);
      cable.rotation.x = Math.PI / 2;
      this.root.add(cable);
    }
    const door = ModelFactory.createLabel('L-0 BLACK ARCHIVE');
    door.position.set(0, 4.4, -23);
    door.scale.set(4.2, 1, 1);
    this.root.add(door);
  }

  buildSkyRift() {
    this.buildBattlefieldBase(0x121d2a, 190);
    for (let i = 0; i < 10; i += 1) {
      const cloud = new THREE.Mesh(new THREE.IcosahedronGeometry(1.1 + Math.random() * 1.2), ModelFactory.material(i % 2 ? 'glass' : 'blue').clone());
      cloud.position.set((Math.random() - 0.5) * 48, 4 + Math.random() * 7, (Math.random() - 0.5) * 48);
      cloud.material.transparent = true;
      cloud.material.opacity = 0.28;
      this.root.add(cloud);
    }
    const skyhook = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, 36, 10), ModelFactory.material('blue'));
    skyhook.position.set(-18, 8, -18);
    skyhook.rotation.z = 0.6;
    this.root.add(skyhook);
    for (let i = 0; i < 7; i += 1) {
      const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.55 + Math.random() * 0.55), ModelFactory.material(i % 2 ? 'violet' : 'glass').clone());
      shard.position.set((Math.random() - 0.5) * 42, 2.4 + Math.random() * 5, (Math.random() - 0.5) * 42);
      shard.rotation.set(Math.random(), Math.random(), Math.random());
      this.root.add(shard);
    }
  }

  buildVeilCore() {
    this.buildBattlefieldBase(0x150f1e, 220);
    for (let i = 0; i < 5; i += 1) {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(5 + i * 3.4, 0.06, 8, 120), ModelFactory.material(i % 2 ? 'violet' : 'red'));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = 0.22 + i * 0.12;
      this.root.add(ring);
    }
    this.addPillars(14, 'violet', 22);
    ['WORM MEMORY', 'SIGNAL MEMORY', 'L-0 MEMORY', 'SERAPH MEMORY'].forEach((label, index) => {
      const fragment = ModelFactory.createLabel(label);
      const angle = (index / 4) * Math.PI * 2;
      fragment.position.set(Math.cos(angle) * 18, 3.6 + index * 0.25, Math.sin(angle) * 18);
      fragment.scale.set(2.2, 0.62, 1);
      this.root.add(fragment);
    });
    const aperture = ModelFactory.createLabel('REQUIEM HEART');
    aperture.position.set(0, 5.2, -24);
    aperture.scale.set(4.5, 1, 1);
    this.root.add(aperture);
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
    } else if (this.mission.environment === 'ashfall') {
      boss.scale.setScalar(0.9);
      boss.position.set(8, 0.1, -9);
    } else if (this.mission.environment === 'sky-rift') {
      boss.scale.setScalar(0.95);
      boss.position.set(8, 1.7, -9);
    } else if (this.mission.environment === 'veil-core') {
      boss.scale.setScalar(1.05);
      boss.position.set(8, 1.2, -9);
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
    this.telegraphs.update(dt, this.aegis, (telegraph) => this.handleTelegraphTrigger(telegraph));
    this.glitchTimer = Math.max(0, this.glitchTimer - dt);
    this.battleUI.setDistortion(
      this.glitchTimer > 0 ||
      (['broadcast', 'silent-choir', 'veil-core'].includes(this.mission.environment) && Math.sin(this.elapsed * 7) > 0.82)
    );

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
      this.queueEventCallout('victory', true);
      this.victoryTimer = 1.8;
    }

    if (!this.lowHullCalloutPlayed && this.mecha.stats.hull / this.mecha.stats.maxHull <= 0.32) {
      this.lowHullCalloutPlayed = true;
      this.queueEventCallout('lowHull', true);
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
    if (amount <= 0) return;
    this.mecha.damage(amount);
    this.damageTaken += amount;
    this.audio.hit();
    this.battleUI.damage(amount, 'Hull Damage');
  }

  handleTelegraphTrigger(telegraph) {
    if (telegraph.status === 'slow') {
      this.mecha.applySlow(1.8, 0.48);
      this.battleUI.damage(0, 'Root Snare');
    }
    if (telegraph.status === 'silence') {
      this.weapons.applySilence(2.1);
      this.battleUI.damage(0, 'Rifle Silenced');
    }
    this.damagePlayer(telegraph.damage);
  }

  handleBossEffect(effect) {
    if (effect === 'glitch') {
      this.glitchTimer = Math.max(this.glitchTimer, 2.2);
    }
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
      resultText: this.mission.resultText,
      salvage: this.mission.reward.salvage,
      sync: this.mission.reward.sync
    });
  }

  queueEventCallout(event, force = false) {
    const callout = this.mission.calloutEvents?.[event];
    if (!callout) return;
    if (!force && this.elapsed < (this.nextEventCalloutAt || 0)) return;
    this.nextEventCalloutAt = this.elapsed + 3;
    this.nextCalloutAt = this.elapsed + 4.5;
    this.battleUI.callout(callout);
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
