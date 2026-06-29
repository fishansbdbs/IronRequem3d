import * as THREE from 'three';
import { ModelFactory } from '../game/ModelFactory.js';
import { VFXFactory } from '../game/VFXFactory.js';

export class HangarScene {
  constructor({ scene }) {
    this.scene = scene;
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
  }

  update(dt) {
    this.clock += dt;
    this.aegis.position.y = 0.2 + Math.sin(this.clock * 1.8) * 0.04;
    this.aegis.getObjectByName('core').material.emissiveIntensity = 1.5 + Math.sin(this.clock * 5) * 0.4;
  }

  dispose() {
    this.scene.remove(this.root);
  }
}
