import * as THREE from 'three';
import { VFXFactory } from '../game/VFXFactory.js';

export class BossTelegraphSystem {
  constructor(scene) {
    this.scene = scene;
    this.telegraphs = [];
  }

  add(type, position, options = {}) {
    const mesh = type === 'line'
      ? VFXFactory.createTelegraphLine(options.length || 11, options.width || 1.4)
      : VFXFactory.createTelegraphCircle(options.radius || 2.8);
    mesh.position.copy(position);
    if (options.rotationY) mesh.rotation.z = options.rotationY;
    this.scene.add(mesh);
    const telegraph = { type, mesh, age: 0, delay: options.delay || 1, damage: options.damage || 10, radius: options.radius || 3 };
    this.telegraphs.push(telegraph);
    return telegraph;
  }

  update(dt, player, onTrigger) {
    this.telegraphs = this.telegraphs.filter((telegraph) => {
      telegraph.age += dt;
      telegraph.mesh.material.opacity = 0.22 + Math.sin(telegraph.age * 18) * 0.12;
      if (telegraph.age >= telegraph.delay) {
        const distance = player.position.distanceTo(telegraph.mesh.position);
        if (distance <= telegraph.radius + 1.2) {
          onTrigger(telegraph);
        }
        this.scene.remove(telegraph.mesh);
        return false;
      }
      return true;
    });
  }

  clear() {
    this.telegraphs.forEach((telegraph) => this.scene.remove(telegraph.mesh));
    this.telegraphs = [];
  }
}
