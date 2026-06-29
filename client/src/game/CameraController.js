import * as THREE from 'three';

export class CameraController {
  constructor(camera) {
    this.camera = camera;
    this.target = new THREE.Vector3();
    this.yaw = Math.PI * 0.18;
    this.pitch = 0.42;
    this.distance = 9;
    this.height = 2.2;
    this.sensitivity = 0.004;
  }

  setMode(mode) {
    if (mode === 'battle') {
      this.distance = 13;
      this.height = 4.5;
      this.pitch = 0.32;
    } else if (mode === 'menu') {
      this.distance = 16;
      this.height = 5;
      this.pitch = 0.18;
    } else {
      this.distance = 9;
      this.height = 2.3;
      this.pitch = 0.42;
    }
  }

  update(targetObject, input, dt, sensitivity = 0.75) {
    if (input?.pointer.dragging) {
      this.yaw -= input.pointer.dx * this.sensitivity * sensitivity;
      this.pitch = Math.min(0.85, Math.max(0.14, this.pitch - input.pointer.dy * this.sensitivity * sensitivity));
    }

    if (targetObject?.position) {
      this.target.lerp(targetObject.position, Math.min(1, dt * 8));
    }

    const offset = new THREE.Vector3(
      Math.sin(this.yaw) * this.distance,
      this.height + Math.sin(this.pitch) * this.distance,
      Math.cos(this.yaw) * this.distance
    );

    this.camera.position.lerp(this.target.clone().add(offset), Math.min(1, dt * 6));
    this.camera.lookAt(this.target.x, this.target.y + 1.2, this.target.z);
  }

  getForwardRight() {
    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw)).normalize();
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw)).normalize();
    return { forward, right };
  }
}
