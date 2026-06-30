import * as THREE from 'three';
import { ModelFactory } from '../game/ModelFactory.js';
import { VFXFactory } from '../game/VFXFactory.js';

export class HangarScene {
  constructor({ scene, mission }) {
    this.scene = scene;
    this.mission = mission;
    this.root = new THREE.Group();
    this.clock = 0;
    this.build();
    scene.add(this.root);
  }

  build() {
    this.root.add(ModelFactory.createFloor(28, 30, 0x151820));
    const rail = new THREE.Mesh(
      new THREE.BoxGeometry(2.5, 0.22, 25),
      new THREE.MeshStandardMaterial({ color: 0x2b3038, roughness: 0.5, metalness: 0.8 })
    );
    rail.position.set(0, 0.2, -1);
    this.root.add(rail);

    this.aegis = ModelFactory.createAegis7(1.15);
    this.aegis.position.set(0, 0.2, 2.8);
    this.root.add(this.aegis);

    for (let i = 0; i < 4; i += 1) {
      const clamp = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 0.35, 0.35),
        new THREE.MeshStandardMaterial({ color: 0x343a45, roughness: 0.55, metalness: 0.8 })
      );
      clamp.position.set(i < 2 ? -1.8 : 1.8, 1.2 + (i % 2) * 2.2, 2.8);
      this.root.add(clamp);
    }

    const doors = new THREE.Mesh(
      new THREE.BoxGeometry(12, 8, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x202733, roughness: 0.65, metalness: 0.7 })
    );
    doors.position.set(0, 4, -12);
    this.root.add(doors);

    for (let i = 0; i < 10; i += 1) {
      const tech = ModelFactory.createCrew(i % 2 ? 'blue' : 'amber');
      tech.scale.setScalar(0.45);
      tech.position.set(-6 + i * 1.3, 0, 6 + Math.sin(i) * 1.2);
      this.root.add(tech);
    }

    this.stars = VFXFactory.createStars(90, 80);
    this.stars.position.z = -35;
    this.root.add(this.stars);

    if (this.mission.environment === 'broadcast') {
      for (let i = 0; i < 5; i += 1) {
        const mast = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.08, 3.2, 8),
          ModelFactory.material(i % 2 ? 'blue' : 'red')
        );
        mast.position.set(-5 + i * 2.4, 1.6, -7);
        mast.rotation.z = Math.sin(i) * 0.18;
        this.root.add(mast);
      }
    }

    if (this.mission.environment === 'redline') {
      const elevator = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.2, 7),
        new THREE.MeshStandardMaterial({ color: 0x3b1a1e, roughness: 0.6, metalness: 0.65 })
      );
      elevator.position.set(0, 0.32, 1.8);
      this.root.add(elevator);
      for (let i = 0; i < 6; i += 1) {
        const lamp = new THREE.PointLight(0xff3030, 1.4, 8);
        lamp.position.set(i % 2 ? -4.4 : 4.4, 2.5, -7 + i * 2.3);
        this.root.add(lamp);
      }
    }

    if (this.mission.environment === 'glassed-coast') {
      this.addMissionProp('glass', -5, -7, 'blue', 6);
    } else if (this.mission.environment === 'black-orchard') {
      this.addMissionProp('orchard', -5, -7, 'amber', 7);
    } else if (this.mission.environment === 'silent-choir') {
      this.addMissionProp('choir', -5, -7, 'violet', 5);
    } else if (this.mission.environment === 'ashfall') {
      this.addMissionProp('ash', -5, -7, 'red', 8);
    } else if (this.mission.environment === 'sealed-lab') {
      this.addMissionProp('lab', -5, -7, 'red', 5);
    } else if (this.mission.environment === 'sky-rift') {
      this.addMissionProp('skyhook', -5, -7, 'blue', 7);
    } else if (this.mission.environment === 'veil-core') {
      this.addMissionProp('requiem', -5, -7, 'violet', 9);
    }
  }

  addMissionProp(prefix, x, z, materialKey, count) {
    for (let i = 0; i < count; i += 1) {
      const prop = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.25 + (i % 3) * 0.12),
        ModelFactory.material(materialKey).clone()
      );
      prop.name = `${prefix}-launch-prop-${i}`;
      prop.position.set(x + i * 1.55, 1.1 + Math.sin(i) * 0.35, z + Math.cos(i) * 0.55);
      prop.rotation.set(i * 0.2, i * 0.45, 0);
      this.root.add(prop);
    }
  }

  update(dt) {
    this.clock += dt;
    this.aegis.position.y = 0.2 + Math.sin(this.clock * 1.8) * 0.04;
    this.aegis.getObjectByName('core').material.emissiveIntensity = 1.5 + Math.sin(this.clock * 5) * 0.4;
    if (['broadcast', 'glassed-coast', 'silent-choir', 'sky-rift', 'veil-core'].includes(this.mission.environment)) {
      this.stars.rotation.z += dt * 0.12;
    }
  }

  dispose() {
    this.scene.remove(this.root);
  }
}
