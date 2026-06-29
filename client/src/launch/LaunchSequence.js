import * as THREE from 'three';
import { ModelFactory } from '../game/ModelFactory.js';
import { VFXFactory } from '../game/VFXFactory.js';

const STEPS = [
  { time: 0.5, speaker: 'System', text: 'Clamp locks disengaging.' },
  { time: 1.8, speaker: 'Vael', text: 'Neural link stabilized.' },
  { time: 3.0, speaker: 'Nira', text: 'AEGIS-7, launch clearance granted.' },
  { time: 4.1, speaker: 'System', text: 'Hangar doors open.' },
  { time: 5.3, speaker: 'Vael', text: 'Thrusters ignited. Do try to enjoy one statistically excellent launch.' },
  { time: 6.6, speaker: 'System', text: 'AEGIS-7 LAUNCH' }
];

export class LaunchSequence {
  constructor({ scene, camera, overlay, onComplete, audio }) {
    this.scene = scene;
    this.camera = camera;
    this.overlay = overlay;
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
    this.root.add(ModelFactory.createFloor(18, 45, 0x121720));
    this.aegis = ModelFactory.createAegis7(1.18);
    this.aegis.position.set(0, 0, 5);
    this.root.add(this.aegis);

    this.tunnel = new THREE.Group();
    for (let i = 0; i < 28; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(5.8, 0.035, 8, 32),
        ModelFactory.material(i % 2 ? 'blue' : 'red')
      );
      ring.position.z = -i * 1.5;
      ring.rotation.x = Math.PI / 2;
      this.tunnel.add(ring);
    }
    this.tunnel.position.z = -8;
    this.root.add(this.tunnel);
    this.stars = VFXFactory.createStars(180, 90);
    this.root.add(this.stars);
    this.audio.launch();
  }

  update(dt) {
    this.elapsed = (performance.now() - this.startedAt) / 1000;
    const nextStep = STEPS.findIndex((step, index) => index > this.stepIndex && this.elapsed >= step.time);
    if (nextStep !== -1) {
      this.stepIndex = nextStep;
      this.overlay.showLaunchLine(STEPS[nextStep]);
    }

    this.aegis.position.z = 5 - Math.max(0, this.elapsed - 4) * 10;
    this.aegis.rotation.x = Math.max(0, this.elapsed - 5.5) * -0.08;
    this.tunnel.position.z += dt * 16;
    if (this.tunnel.position.z > 1) this.tunnel.position.z = -8;

    this.camera.position.set(Math.sin(this.elapsed * 0.8) * 3, 3.5 + Math.sin(this.elapsed) * 0.5, 11 - this.elapsed * 1.2);
    this.camera.lookAt(this.aegis.position.x, this.aegis.position.y + 2.5, this.aegis.position.z);

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
