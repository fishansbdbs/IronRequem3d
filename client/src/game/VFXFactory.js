import * as THREE from 'three';
import { ModelFactory } from './ModelFactory.js';

export class VFXFactory {
  static colorValue(color = 'red') {
    if (typeof color === 'number') return color;
    return {
      red: 0xff2323,
      blue: 0x59d8ff,
      amber: 0xffb457,
      violet: 0x8b5dff,
      glass: 0x79dbff,
      white: 0xdff8ff,
      ash: 0xff6b3b
    }[color] || 0xff2323;
  }

  static telegraphMaterial(color = 'red', opacity = 0.32) {
    return new THREE.MeshBasicMaterial({
      color: VFXFactory.colorValue(color),
      transparent: true,
      opacity,
      side: THREE.DoubleSide,
      depthWrite: false
    });
  }

  static createStars(count = 240, spread = 160) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    for (let i = 0; i < count; i += 1) {
      positions.push((Math.random() - 0.5) * spread, (Math.random() - 0.2) * spread, (Math.random() - 0.5) * spread);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({ color: 0xa8eaff, size: 0.2, transparent: true, opacity: 0.7 });
    return new THREE.Points(geometry, material);
  }

  static createTelegraphCircle(radius = 2.5, color = 'red') {
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(radius, 48),
      VFXFactory.telegraphMaterial(color, 0.34)
    );
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  static createTelegraphLine(length = 9, width = 1.2, color = 'red') {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, length),
      VFXFactory.telegraphMaterial(color, 0.32)
    );
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  static createTelegraphRect(length = 9, width = 1.2, color = 'red') {
    const mesh = VFXFactory.createTelegraphLine(length, width, color);
    mesh.material.opacity = 0.38;
    return mesh;
  }

  static createTelegraphRing(radius = 5, innerRadius = 2.5, color = 'red') {
    const mesh = new THREE.Mesh(
      new THREE.RingGeometry(innerRadius, radius, 72),
      VFXFactory.telegraphMaterial(color, 0.3)
    );
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  static createTelegraphCone(radius = 7, angle = Math.PI / 3, color = 'red') {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    const segments = 34;
    for (let i = 0; i <= segments; i += 1) {
      const theta = -angle / 2 + (angle * i) / segments;
      shape.lineTo(Math.sin(theta) * radius, Math.cos(theta) * radius);
    }
    shape.lineTo(0, 0);
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), VFXFactory.telegraphMaterial(color, 0.34));
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  static createTelegraphArc(radius = 7, angle = Math.PI / 2, width = 0.18, color = 'red') {
    const outer = radius;
    const inner = Math.max(0.1, radius - width);
    const shape = new THREE.Shape();
    const segments = 40;
    for (let i = 0; i <= segments; i += 1) {
      const theta = -angle / 2 + (angle * i) / segments;
      const x = Math.sin(theta) * outer;
      const y = Math.cos(theta) * outer;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    for (let i = segments; i >= 0; i -= 1) {
      const theta = -angle / 2 + (angle * i) / segments;
      shape.lineTo(Math.sin(theta) * inner, Math.cos(theta) * inner);
    }
    const mesh = new THREE.Mesh(new THREE.ShapeGeometry(shape), VFXFactory.telegraphMaterial(color, 0.34));
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  static createSlashArc() {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.06, 8, 48, Math.PI * 1.15),
      ModelFactory.material('blue').clone()
    );
    mesh.rotation.x = Math.PI / 2;
    mesh.scale.set(1, 0.5, 1);
    mesh.userData.life = 0.32;
    mesh.userData.effectType = 'timed';
    return mesh;
  }

  static createEnergyBeam(length = 18, color = 'blue') {
    const mesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.16, length, 12),
      ModelFactory.material(color).clone()
    );
    mesh.userData.life = 0.22;
    mesh.userData.effectType = 'timed';
    return mesh;
  }

  static createThrusterFlare(color = 'blue') {
    const group = new THREE.Group();
    for (let i = 0; i < 8; i += 1) {
      const flame = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.7, 10), ModelFactory.material(color).clone());
      flame.rotation.x = Math.PI;
      flame.position.set((Math.random() - 0.5) * 0.8, 0.2, 0.5 + Math.random() * 0.5);
      flame.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 2, 0, 3 + Math.random() * 2);
      group.add(flame);
    }
    group.userData.life = 0.35;
    group.userData.effectType = 'timed';
    return group;
  }

  static createShockwave(radius = 2.5, color = 'red') {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(radius, 0.045, 8, 72),
      ModelFactory.material(color).clone()
    );
    mesh.rotation.x = Math.PI / 2;
    mesh.userData.life = 0.5;
    mesh.userData.effectType = 'timed';
    return mesh;
  }

  static createImpact(color = 'blue') {
    const group = new THREE.Group();
    for (let i = 0; i < 10; i += 1) {
      const spark = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 6), ModelFactory.material(color));
      spark.userData.velocity = new THREE.Vector3((Math.random() - 0.5) * 5, Math.random() * 3, (Math.random() - 0.5) * 5);
      group.add(spark);
    }
    group.userData.life = 0.45;
    group.userData.effectType = 'impact';
    return group;
  }

  static createMuzzleFlash(color = 'blue') {
    const group = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 12, 8),
      new THREE.MeshBasicMaterial({ color: VFXFactory.colorValue(color), transparent: true, opacity: 0.92 })
    );
    const flare = new THREE.Mesh(
      new THREE.ConeGeometry(0.22, 0.8, 14),
      new THREE.MeshBasicMaterial({ color: VFXFactory.colorValue(color), transparent: true, opacity: 0.72 })
    );
    flare.rotation.x = Math.PI / 2;
    flare.position.z = -0.35;
    group.add(core, flare);
    group.userData.life = 0.18;
    group.userData.effectType = 'timed';
    return group;
  }

  static createDeathBurst(color = 'red', radius = 1.4) {
    const group = new THREE.Group();
    for (let i = 0; i < 22; i += 1) {
      const shard = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.08 + Math.random() * 0.12),
        new THREE.MeshBasicMaterial({ color: VFXFactory.colorValue(color), transparent: true, opacity: 0.95 })
      );
      shard.userData.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * radius * 7,
        Math.random() * radius * 3.4,
        (Math.random() - 0.5) * radius * 7
      );
      group.add(shard);
    }
    group.userData.life = 0.9;
    group.userData.effectType = 'impact';
    return group;
  }

  static updateImpact(group, dt) {
    group.userData.life -= dt;
    group.children.forEach((spark) => {
      spark.position.addScaledVector(spark.userData.velocity, dt);
      spark.scale.multiplyScalar(0.96);
    });
    return group.userData.life > 0;
  }

  static updateTimedEffect(effect, dt) {
    effect.userData.life -= dt;
    effect.scale.multiplyScalar(1 + dt * 1.2);
    if (effect.material) {
      effect.material.opacity = Math.max(0, effect.userData.life * 3);
      effect.material.transparent = true;
    }
    effect.children?.forEach((child) => {
      if (child.userData.velocity) child.position.addScaledVector(child.userData.velocity, dt);
      child.scale.multiplyScalar(0.95);
    });
    return effect.userData.life > 0;
  }
}
