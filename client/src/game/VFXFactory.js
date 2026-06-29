import * as THREE from 'three';
import { ModelFactory } from './ModelFactory.js';

export class VFXFactory {
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

  static createTelegraphCircle(radius = 2.5) {
    const mesh = new THREE.Mesh(
      new THREE.CircleGeometry(radius, 48),
      new THREE.MeshBasicMaterial({ color: 0xff2323, transparent: true, opacity: 0.34, side: THREE.DoubleSide })
    );
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  static createTelegraphLine(length = 9, width = 1.2) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, length),
      new THREE.MeshBasicMaterial({ color: 0xff2323, transparent: true, opacity: 0.32, side: THREE.DoubleSide })
    );
    mesh.rotation.x = -Math.PI / 2;
    return mesh;
  }

  static createSlashArc() {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(2.4, 0.06, 8, 48, Math.PI * 1.15),
      ModelFactory.material('blue')
    );
    mesh.rotation.x = Math.PI / 2;
    mesh.scale.set(1, 0.5, 1);
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
}
