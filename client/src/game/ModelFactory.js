import * as THREE from 'three';

const mats = {
  dark: new THREE.MeshStandardMaterial({ color: 0x151922, roughness: 0.65, metalness: 0.55 }),
  armor: new THREE.MeshStandardMaterial({ color: 0x4a5160, roughness: 0.46, metalness: 0.7 }),
  black: new THREE.MeshStandardMaterial({ color: 0x07090e, roughness: 0.7, metalness: 0.3 }),
  blue: new THREE.MeshStandardMaterial({ color: 0x59d8ff, emissive: 0x1aa8d8, emissiveIntensity: 1.6 }),
  red: new THREE.MeshStandardMaterial({ color: 0xff3b3b, emissive: 0x9b1010, emissiveIntensity: 1.5 }),
  amber: new THREE.MeshStandardMaterial({ color: 0xffb457, emissive: 0x7a3500, emissiveIntensity: 0.7 }),
  glass: new THREE.MeshStandardMaterial({
    color: 0x79dbff,
    transparent: true,
    opacity: 0.22,
    roughness: 0.1,
    metalness: 0.1
  })
};

function box(name, size, position, material = mats.armor) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(size.x, size.y, size.z), material);
  mesh.name = name;
  mesh.position.copy(position);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cylinder(name, radiusTop, radiusBottom, height, material = mats.armor, segments = 16) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radiusTop, radiusBottom, height, segments), material);
  mesh.name = name;
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export class ModelFactory {
  static material(key) {
    return mats[key] || mats.armor;
  }

  static createKaito() {
    const group = new THREE.Group();
    group.name = 'Kaito Ashveil';
    group.add(box('torso', new THREE.Vector3(0.65, 1.05, 0.35), new THREE.Vector3(0, 1.35, 0), mats.dark));
    group.add(box('chest-stripe', new THREE.Vector3(0.46, 0.12, 0.38), new THREE.Vector3(0, 1.55, -0.02), mats.blue));
    group.add(box('head', new THREE.Vector3(0.42, 0.42, 0.42), new THREE.Vector3(0, 2.1, 0), mats.armor));
    group.add(box('visor', new THREE.Vector3(0.36, 0.09, 0.44), new THREE.Vector3(0, 2.13, -0.03), mats.blue));
    group.add(box('left-arm', new THREE.Vector3(0.22, 0.85, 0.22), new THREE.Vector3(-0.48, 1.28, 0), mats.armor));
    group.add(box('right-arm', new THREE.Vector3(0.22, 0.85, 0.22), new THREE.Vector3(0.48, 1.28, 0), mats.armor));
    group.add(box('left-leg', new THREE.Vector3(0.25, 0.9, 0.25), new THREE.Vector3(-0.18, 0.45, 0), mats.dark));
    group.add(box('right-leg', new THREE.Vector3(0.25, 0.9, 0.25), new THREE.Vector3(0.18, 0.45, 0), mats.dark));
    return group;
  }

  static createCrew(color = 'amber') {
    const group = new THREE.Group();
    group.add(box('body', new THREE.Vector3(0.58, 1, 0.32), new THREE.Vector3(0, 1.05, 0), mats.dark));
    group.add(box('accent', new THREE.Vector3(0.42, 0.14, 0.34), new THREE.Vector3(0, 1.32, -0.02), mats[color]));
    group.add(box('head', new THREE.Vector3(0.4, 0.4, 0.4), new THREE.Vector3(0, 1.78, 0), mats.armor));
    group.add(box('legs', new THREE.Vector3(0.45, 0.7, 0.25), new THREE.Vector3(0, 0.35, 0), mats.black));
    return group;
  }

  static createTerminal(color = 'blue') {
    const group = new THREE.Group();
    group.add(box('terminal-base', new THREE.Vector3(1.2, 0.7, 0.8), new THREE.Vector3(0, 0.35, 0), mats.dark));
    group.add(box('terminal-screen', new THREE.Vector3(1.1, 0.62, 0.08), new THREE.Vector3(0, 1.05, -0.33), mats[color]));
    const orb = new THREE.Mesh(new THREE.SphereGeometry(0.33, 24, 16), mats[color]);
    orb.position.set(0, 1.78, 0);
    group.add(orb);
    return group;
  }

  static createAegis7(scale = 1) {
    const group = new THREE.Group();
    group.name = 'AEGIS-7';
    group.scale.setScalar(scale);
    group.add(box('pelvis', new THREE.Vector3(1.2, 0.55, 0.7), new THREE.Vector3(0, 2.35, 0), mats.dark));
    group.add(box('torso', new THREE.Vector3(1.6, 1.75, 0.85), new THREE.Vector3(0, 3.45, 0), mats.armor));
    group.add(box('core', new THREE.Vector3(0.62, 0.62, 0.92), new THREE.Vector3(0, 3.6, -0.02), mats.blue));
    group.add(box('head', new THREE.Vector3(0.78, 0.48, 0.62), new THREE.Vector3(0, 4.63, 0), mats.dark));
    group.add(box('visor', new THREE.Vector3(0.58, 0.13, 0.66), new THREE.Vector3(0, 4.65, -0.02), mats.blue));
    group.add(box('left-shoulder', new THREE.Vector3(0.85, 0.5, 0.75), new THREE.Vector3(-1.15, 4.05, 0), mats.armor));
    group.add(box('right-shoulder', new THREE.Vector3(0.85, 0.5, 0.75), new THREE.Vector3(1.15, 4.05, 0), mats.armor));
    group.add(box('left-arm', new THREE.Vector3(0.45, 1.35, 0.45), new THREE.Vector3(-1.35, 3.05, 0), mats.dark));
    group.add(box('right-arm', new THREE.Vector3(0.45, 1.35, 0.45), new THREE.Vector3(1.35, 3.05, 0), mats.dark));
    group.add(box('blade', new THREE.Vector3(0.18, 1.85, 0.12), new THREE.Vector3(-1.45, 1.9, -0.18), mats.blue));
    group.add(box('rifle', new THREE.Vector3(0.26, 1.8, 0.26), new THREE.Vector3(1.58, 2.45, -0.35), mats.black));
    group.add(box('left-leg', new THREE.Vector3(0.56, 1.75, 0.55), new THREE.Vector3(-0.45, 1.18, 0), mats.armor));
    group.add(box('right-leg', new THREE.Vector3(0.56, 1.75, 0.55), new THREE.Vector3(0.45, 1.18, 0), mats.armor));
    group.add(box('left-foot', new THREE.Vector3(0.75, 0.28, 1), new THREE.Vector3(-0.45, 0.16, -0.12), mats.dark));
    group.add(box('right-foot', new THREE.Vector3(0.75, 0.28, 1), new THREE.Vector3(0.45, 0.16, -0.12), mats.dark));
    group.add(box('left-thruster', new THREE.Vector3(0.38, 0.75, 0.45), new THREE.Vector3(-0.48, 3.55, 0.72), mats.black));
    group.add(box('right-thruster', new THREE.Vector3(0.38, 0.75, 0.45), new THREE.Vector3(0.48, 3.55, 0.72), mats.black));
    return group;
  }

  static createFractureWorm() {
    const group = new THREE.Group();
    group.name = 'Fracture Worm';
    for (let i = 0; i < 10; i += 1) {
      const radius = 1.4 - i * 0.06;
      const segment = cylinder(`worm-segment-${i}`, radius, radius * 0.85, 0.8, i % 2 ? mats.dark : mats.armor, 18);
      segment.rotation.z = Math.PI / 2;
      segment.position.set(i * 0.95, 1.2 + Math.sin(i) * 0.1, 0);
      group.add(segment);
    }
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.55, 20, 14), mats.red);
    core.position.set(-0.65, 1.2, 0);
    group.add(core);
    const mandibleA = box('mandible-a', new THREE.Vector3(0.25, 1, 0.2), new THREE.Vector3(-1.2, 1.2, 0.48), mats.red);
    mandibleA.rotation.x = 0.7;
    const mandibleB = mandibleA.clone();
    mandibleB.position.z = -0.48;
    mandibleB.rotation.x = -0.7;
    group.add(mandibleA, mandibleB);
    return group;
  }

  static createRiftShard() {
    const group = new THREE.Group();
    const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(0.55), mats.red);
    crystal.castShadow = true;
    group.add(crystal);
    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.72, 0.025, 8, 28), mats.red);
    halo.rotation.x = Math.PI / 2;
    group.add(halo);
    return group;
  }

  static createLabel(text) {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(3, 8, 14, 0.72)';
    ctx.fillRect(18, 32, 476, 64);
    ctx.strokeStyle = 'rgba(89, 216, 255, 0.88)';
    ctx.strokeRect(18, 32, 476, 64);
    ctx.font = '34px Arial';
    ctx.fillStyle = '#d7f7ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 256, 64);
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2.8, 0.7, 1);
    return sprite;
  }

  static createFloor(width = 32, depth = 32, color = 0x171b24) {
    const floor = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.16, depth),
      new THREE.MeshStandardMaterial({ color, roughness: 0.74, metalness: 0.35 })
    );
    floor.receiveShadow = true;
    return floor;
  }

  static createCrate(size = 1) {
    const crate = box('crate', new THREE.Vector3(size, size, size), new THREE.Vector3(0, size / 2, 0), mats.dark);
    return crate;
  }
}
