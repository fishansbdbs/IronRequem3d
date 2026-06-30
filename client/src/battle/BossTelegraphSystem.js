import * as THREE from 'three';
import { VFXFactory } from '../game/VFXFactory.js';

export class BossTelegraphSystem {
  constructor(scene) {
    this.scene = scene;
    this.telegraphs = [];
  }

  add(type, position, options = {}) {
    const color = options.color || 'red';
    const length = options.length || 11;
    const width = options.width || 1.4;
    const radius = options.radius || 2.8;
    const innerRadius = options.innerRadius || Math.max(0.1, radius * 0.55);
    const angle = options.angle || Math.PI / 3;
    const mesh = {
      line: () => VFXFactory.createTelegraphLine(length, width, color),
      rect: () => VFXFactory.createTelegraphRect(length, width, color),
      circle: () => VFXFactory.createTelegraphCircle(radius, color),
      ring: () => VFXFactory.createTelegraphRing(radius, innerRadius, color),
      cone: () => VFXFactory.createTelegraphCone(radius, angle, color),
      arc: () => VFXFactory.createTelegraphArc(radius, angle, options.arcWidth || 0.6, color)
    }[type]?.() || VFXFactory.createTelegraphCircle(radius, color);
    mesh.position.copy(position);
    const rotationY = options.rotationY || 0;
    if (['line', 'rect', 'cone', 'arc'].includes(type)) mesh.rotation.z = rotationY;
    this.scene.add(mesh);
    const telegraph = {
      type,
      mesh,
      age: 0,
      delay: options.delay || 1,
      damage: options.damage ?? 10,
      radius,
      innerRadius,
      length,
      width,
      angle,
      arcWidth: options.arcWidth || 1.6,
      rotationY,
      status: options.status || null,
      pullStrength: options.pullStrength || 0
    };
    this.telegraphs.push(telegraph);
    return telegraph;
  }

  update(dt, player, onTrigger) {
    this.telegraphs = this.telegraphs.filter((telegraph) => {
      telegraph.age += dt;
      telegraph.mesh.material.opacity = 0.22 + Math.sin(telegraph.age * 18) * 0.12;
      if (telegraph.pullStrength && telegraph.age < telegraph.delay) {
        this.pullPlayer(telegraph, player, dt);
      }
      if (telegraph.age >= telegraph.delay) {
        if (this.hitsPlayer(telegraph, player)) {
          onTrigger(telegraph);
        }
        this.scene.remove(telegraph.mesh);
        return false;
      }
      return true;
    });
  }

  hitsPlayer(telegraph, player) {
    const dx = player.position.x - telegraph.mesh.position.x;
    const dz = player.position.z - telegraph.mesh.position.z;
    const distance = Math.hypot(dx, dz);
    const padding = 1.15;

    if (telegraph.type === 'circle') {
      return distance <= telegraph.radius + padding;
    }

    if (telegraph.type === 'ring') {
      return distance >= Math.max(0, telegraph.innerRadius - padding) && distance <= telegraph.radius + padding;
    }

    const angleToPlayer = Math.atan2(dx, dz);
    const delta = Math.atan2(
      Math.sin(angleToPlayer - telegraph.rotationY),
      Math.cos(angleToPlayer - telegraph.rotationY)
    );

    if (telegraph.type === 'cone') {
      return distance <= telegraph.radius + padding && Math.abs(delta) <= telegraph.angle / 2;
    }

    if (telegraph.type === 'arc') {
      return distance >= Math.max(0, telegraph.radius - (telegraph.arcWidth || 1.6) - padding) &&
        distance <= telegraph.radius + padding &&
        Math.abs(delta) <= telegraph.angle / 2;
    }

    const forwardX = Math.sin(telegraph.rotationY);
    const forwardZ = Math.cos(telegraph.rotationY);
    const rightX = Math.cos(telegraph.rotationY);
    const rightZ = -Math.sin(telegraph.rotationY);
    const forward = dx * forwardX + dz * forwardZ;
    const right = dx * rightX + dz * rightZ;

    return Math.abs(forward) <= telegraph.length / 2 + padding &&
      Math.abs(right) <= telegraph.width / 2 + padding;
  }

  pullPlayer(telegraph, player, dt) {
    const dx = telegraph.mesh.position.x - player.position.x;
    const dz = telegraph.mesh.position.z - player.position.z;
    const distance = Math.hypot(dx, dz);
    if (distance < 0.001 || distance > telegraph.radius + 2.5) return;
    player.position.x += (dx / distance) * telegraph.pullStrength * dt;
    player.position.z += (dz / distance) * telegraph.pullStrength * dt;
  }

  clear() {
    this.telegraphs.forEach((telegraph) => this.scene.remove(telegraph.mesh));
    this.telegraphs = [];
  }
}
