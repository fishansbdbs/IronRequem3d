import * as THREE from 'three';
import { ModelFactory } from '../game/ModelFactory.js';
import { createHubInteractables } from './HubNPCs.js';
import { InteractionSystem } from './InteractionSystem.js';

export class Arc12Hub {
  constructor({ scene, cameraController, state, onInteract }) {
    this.scene = scene;
    this.cameraController = cameraController;
    this.hubState = state;
    this.onInteract = onInteract;
    this.root = new THREE.Group();
    this.interaction = new InteractionSystem();
    this.interactables = [];
    this.alertLights = [];
    this.clock = 0;
    this.player = ModelFactory.createKaito();
    this.player.position.set(0, 0, 1.5);
    this.root.add(this.player);
    this.build();
    this.scene.add(this.root);
  }

  build() {
    const floor = ModelFactory.createFloor(22, 20, 0x171b24);
    this.root.add(floor);

    const grid = new THREE.GridHelper(22, 22, 0x2b8ca2, 0x27313e);
    grid.position.y = 0.09;
    this.root.add(grid);

    const windowWall = new THREE.Mesh(
      new THREE.BoxGeometry(18, 5, 0.22),
      new THREE.MeshStandardMaterial({ color: 0x0b1019, roughness: 0.4, metalness: 0.4 })
    );
    windowWall.position.set(0, 2.4, -10);
    this.root.add(windowWall);

    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(13, 3.2),
      ModelFactory.material('glass')
    );
    glass.position.set(0, 2.6, -9.86);
    this.root.add(glass);

    const hangarDoor = new THREE.Mesh(
      new THREE.BoxGeometry(6, 3.4, 0.35),
      new THREE.MeshStandardMaterial({ color: 0x2a3039, roughness: 0.6, metalness: 0.65 })
    );
    hangarDoor.position.set(0, 1.7, 9.8);
    this.root.add(hangarDoor);

    const areas = [
      ['Command Center', -6, -7],
      ['Research Terminal', 5.5, -6.5],
      ['Upgrade Bay', -6.5, 6],
      ['Pilot Quarters', 6, 6.2],
      ['Observation Window', 0, -8.8],
      ['Vael Sync', 5.5, -3.3]
    ];

    areas.forEach(([label, x, z]) => {
      const sprite = ModelFactory.createLabel(label);
      sprite.position.set(x, 2.8, z);
      this.root.add(sprite);
    });

    for (let i = 0; i < 12; i += 1) {
      const light = new THREE.PointLight(i % 2 ? 0x59d8ff : 0xff3b3b, 1.2, 8);
      light.position.set(-10 + i * 1.8, 3.4, i % 2 ? -7.5 : 7.5);
      this.alertLights.push(light);
      this.root.add(light);
    }

    createHubInteractables().forEach((item) => {
      const group = new THREE.Group();
      group.position.copy(item.position);
      group.add(item.model);
      const label = ModelFactory.createLabel(item.label);
      label.position.set(0, 2.45, 0);
      group.add(label);
      this.root.add(group);
      this.interactables.push({ ...item, group });
    });

    if (this.hubState.currentChapter === 'chapter-2-hollow-signal') {
      const repairRig = new THREE.Mesh(
        new THREE.BoxGeometry(3.5, 0.18, 1.4),
        new THREE.MeshStandardMaterial({ color: 0x3a4652, roughness: 0.55, metalness: 0.75 })
      );
      repairRig.position.set(0, 0.25, 8.2);
      this.root.add(repairRig);
    }

    if (this.hubState.currentChapter === 'chapter-3-redline-descent') {
      const staticVeil = new THREE.Mesh(
        new THREE.TorusGeometry(1.4, 0.035, 8, 48),
        ModelFactory.material('red')
      );
      staticVeil.position.set(5.5, 2.5, -4.8);
      staticVeil.rotation.x = Math.PI / 2;
      this.root.add(staticVeil);
      this.redlineStatic = staticVeil;
    }
  }

  setEmergency(active) {
    this.emergency = active;
  }

  update(dt, input, state) {
    this.clock += dt;
    const speed = input.isDown('ShiftLeft') || input.isDown('ShiftRight') ? 6.8 : 4.2;
    const move = input.movementVector();
    const { forward, right } = this.cameraController.getForwardRight();
    const direction = forward.multiplyScalar(-move.z).add(right.multiplyScalar(move.x));

    if (direction.lengthSq() > 0.001) {
      direction.normalize();
      this.player.position.addScaledVector(direction, speed * dt);
      this.player.rotation.y = Math.atan2(direction.x, direction.z);
    }

    this.player.position.x = THREE.MathUtils.clamp(this.player.position.x, -9.2, 9.2);
    this.player.position.z = THREE.MathUtils.clamp(this.player.position.z, -8.4, 8.4);

    this.player.children.forEach((part) => {
      if (part.name.includes('leg') || part.name.includes('arm')) {
        part.rotation.x = Math.sin(this.clock * 8) * (direction.lengthSq() > 0.001 ? 0.18 : 0.03);
      }
    });

    this.alertLights.forEach((light, index) => {
      const chapterBoost = state.currentChapter === 'chapter-3-redline-descent' ? 0.55 : 0;
      light.intensity = state.storyFlags.emergencyStarted
        ? 1.4 + chapterBoost + Math.sin(this.clock * 8 + index) * 0.8
        : 0.45 + chapterBoost;
    });

    if (this.redlineStatic) {
      this.redlineStatic.rotation.z += dt * 0.8;
      this.redlineStatic.scale.setScalar(1 + Math.sin(this.clock * 5) * 0.05);
    }

    const current = this.interaction.update(this.player, this.interactables);
    if (current && input.consumePressed('KeyE')) {
      this.onInteract(current);
    }

    return current ? `E - ${current.label}` : '';
  }

  dispose() {
    this.scene.remove(this.root);
  }
}
