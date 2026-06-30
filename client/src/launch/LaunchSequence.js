import * as THREE from 'three';
import { ModelFactory } from '../game/ModelFactory.js';
import { VFXFactory } from '../game/VFXFactory.js';

export class LaunchSequence {
  constructor({ scene, camera, overlay, mission, onComplete, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.overlay = overlay;
    this.mission = mission;
    this.onComplete = onComplete;
    this.audio = audio;
    this.root = new THREE.Group();
    this.elapsed = 0;
    this.startedAt = performance.now();
    this.stepIndex = -1;
    this.done = false;
    this.build();
    scene.add(this.root);
  }

  build() {
    const floorColor = this.mission.environment === 'redline' ? 0x241117 : 0x121720;
    this.root.add(ModelFactory.createFloor(18, 45, floorColor));
    this.aegis = ModelFactory.createAegis7(1.18);
    this.aegis.position.set(0, 0, 5);
    this.root.add(this.aegis);

    this.tunnel = new THREE.Group();
    for (let i = 0; i < 28; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(5.8, 0.035, 8, 32),
        ModelFactory.material(this.mission.environment === 'broadcast' ? (i % 3 ? 'blue' : 'red') : i % 2 ? 'blue' : 'red')
      );
      ring.position.z = -i * 1.5;
      ring.rotation.x = Math.PI / 2;
      this.tunnel.add(ring);
    }
    this.tunnel.position.z = -8;
    this.root.add(this.tunnel);
    this.stars = VFXFactory.createStars(180, 90);
    this.root.add(this.stars);

    if (this.mission.environment === 'redline') {
      for (let i = 0; i < 12; i += 1) {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.12, 42),
          new THREE.MeshStandardMaterial({ color: 0x5b2028, roughness: 0.5, metalness: 0.8 })
        );
        rail.position.set(i % 2 ? -3.2 : 3.2, 0.5, -12);
        rail.rotation.z = (i - 6) * 0.015;
        this.root.add(rail);
      }
    }

    this.audio.launch();
  }

  update(dt) {
    this.elapsed = (performance.now() - this.startedAt) / 1000;
    const steps = this.mission.launchLines;
    const nextStep = steps.findIndex((step, index) => index > this.stepIndex && this.elapsed >= step.time);
    if (nextStep !== -1) {
      this.stepIndex = nextStep;
      this.overlay.showLaunchLine(steps[nextStep]);
    }

    const descent = this.mission.environment === 'redline';
    this.aegis.position.z = 5 - Math.max(0, this.elapsed - 4) * (descent ? 5 : 10);
    this.aegis.position.y = descent ? -Math.max(0, this.elapsed - 4.2) * 1.2 : 0;
    this.aegis.rotation.x = Math.max(0, this.elapsed - 5.5) * (descent ? 0.05 : -0.08);
    this.tunnel.position.z += dt * (descent ? 9 : 16);
    if (this.tunnel.position.z > 1) this.tunnel.position.z = -8;
    if (this.mission.environment === 'broadcast') {
      this.stars.rotation.z += dt * 0.9;
    }

    this.camera.position.set(Math.sin(this.elapsed * 0.8) * 3, 3.5 + Math.sin(this.elapsed) * 0.5, 11 - this.elapsed * 1.2);
    this.camera.lookAt(this.aegis.position.x, this.aegis.position.y + 2.5, this.aegis.position.z);
    this.camera.rotation.z += this.mission.environment === 'broadcast' ? Math.sin(this.elapsed * 18) * 0.01 : 0;

    if (this.elapsed > 8.2 && !this.done) {
      this.done = true;
      this.onComplete();
    }
  }

  skip() {
    if (!this.done) {
      this.done = true;
      this.onComplete();
    }
  }

  dispose() {
    this.scene.remove(this.root);
  }
}
