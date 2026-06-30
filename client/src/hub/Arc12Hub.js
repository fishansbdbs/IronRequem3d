import * as THREE from 'three';
import { ModelFactory } from '../game/ModelFactory.js';
import { createHubInteractables } from './HubNPCs.js';
import { InteractionSystem } from './InteractionSystem.js';

const ROOM_LAYOUT = [
  { id: 'central-atrium', label: 'Central Command Atrium', x: 0, z: 0, w: 18, d: 15, color: 0x171b24 },
  { id: 'command-corridor', label: 'Command Corridor', x: -18, z: 0, w: 16, d: 6, color: 0x18212b },
  { id: 'nira-office', label: "Commander Nira's Room", x: -32, z: 0, w: 13, d: 11, color: 0x1f1a21 },
  { id: 'briefing-room', label: 'Briefing Room', x: 0, z: -16, w: 16, d: 10, color: 0x1a2029 },
  { id: 'observation-deck', label: 'Observation Deck', x: 0, z: -29, w: 20, d: 8, color: 0x111b25 },
  { id: 'vael-sync-chamber', label: 'Vael Sync Chamber', x: 18, z: -15, w: 13, d: 11, color: 0x101826 },
  { id: 'research-lab', label: 'Research Lab', x: 32, z: -15, w: 12, d: 11, color: 0x151d24 },
  { id: 'med-bay', label: 'Med Bay', x: 20, z: 0, w: 12, d: 10, color: 0x182827 },
  { id: 'pilot-quarters', label: 'Pilot Quarters', x: 20, z: 13, w: 12, d: 10, color: 0x20201a },
  { id: 'hangar-bay', label: 'Hangar Bay', x: 0, z: 22, w: 25, d: 16, color: 0x1f2023 },
  { id: 'engineering-deck', label: 'Engineering Deck', x: -19, z: 22, w: 14, d: 13, color: 0x211d18 }
];

function makePanel(width, height, depth, color) {
  return new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.58, metalness: 0.52 })
  );
}

export class Arc12Hub {
  constructor({ scene, cameraController, state, onInteract }) {
    this.scene = scene;
    this.cameraController = cameraController;
    this.hubState = state;
    this.onInteract = onInteract;
    this.root = new THREE.Group();
    this.interaction = new InteractionSystem(2.6);
    this.interactables = [];
    this.alertLights = [];
    this.roomLights = [];
    this.clock = 0;
    this.player = ModelFactory.createKaito();
    this.player.position.set(0, 0, 2);
    this.root.add(this.player);
    this.build();
    this.scene.add(this.root);
  }

  build() {
    ROOM_LAYOUT.forEach((room) => this.buildRoom(room));
    this.buildCorridors();
    this.buildAtriumProps();
    this.buildCommandOffice();
    this.buildHangar();
    this.buildEngineering();
    this.buildMedBay();
    this.buildQuarters();
    this.buildSyncAndResearch();
    this.buildObservation();
    this.placeInteractables();
    this.buildChapterEffects();
  }

  buildRoom(room) {
    const floor = ModelFactory.createFloor(room.w, room.d, room.color);
    floor.position.set(room.x, 0, room.z);
    this.root.add(floor);

    const grid = new THREE.GridHelper(Math.max(room.w, room.d), Math.max(room.w, room.d), 0x2b8ca2, 0x27313e);
    grid.position.set(room.x, 0.1, room.z);
    grid.scale.z = room.d / Math.max(room.w, room.d);
    grid.scale.x = room.w / Math.max(room.w, room.d);
    this.root.add(grid);

    const wallMatColor = room.id === 'nira-office' ? 0x35212a : 0x26313b;
    const north = makePanel(room.w, 1.2, 0.22, wallMatColor);
    const south = makePanel(room.w, 1.2, 0.22, wallMatColor);
    const west = makePanel(0.22, 1.2, room.d, wallMatColor);
    const east = makePanel(0.22, 1.2, room.d, wallMatColor);
    north.position.set(room.x, 0.65, room.z - room.d / 2);
    south.position.set(room.x, 0.65, room.z + room.d / 2);
    west.position.set(room.x - room.w / 2, 0.65, room.z);
    east.position.set(room.x + room.w / 2, 0.65, room.z);
    this.root.add(north, south, west, east);

    const label = ModelFactory.createLabel(room.label);
    label.position.set(room.x, 2.7, room.z - room.d / 2 + 1.2);
    label.scale.set(3.2, 0.75, 1);
    this.root.add(label);

    const light = new THREE.PointLight(room.id.includes('med') ? 0x72ffe0 : 0x59d8ff, 0.55, 12);
    light.position.set(room.x, 3.1, room.z);
    this.roomLights.push(light);
    this.root.add(light);
  }

  buildCorridors() {
    const corridors = [
      { x: -9.5, z: 0, w: 3, d: 5.2 },
      { x: 9.5, z: 0, w: 3, d: 5.2 },
      { x: 0, z: -8.4, w: 5.8, d: 3 },
      { x: 0, z: 8.5, w: 5.8, d: 3 },
      { x: 20, z: 6.8, w: 5.5, d: 4 },
      { x: 25, z: -15, w: 3.4, d: 5 },
      { x: -11.8, z: 22, w: 4.4, d: 6 }
    ];
    corridors.forEach((corridor) => {
      const floor = ModelFactory.createFloor(corridor.w, corridor.d, 0x202833);
      floor.position.set(corridor.x, 0.03, corridor.z);
      this.root.add(floor);
    });
  }

  buildAtriumProps() {
    const table = new THREE.Group();
    table.position.set(0, 0, 0);
    const base = makePanel(4.4, 0.45, 2.4, 0x1b2430);
    base.position.y = 0.45;
    const holo = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.08, 40), ModelFactory.material('blue'));
    holo.position.y = 0.9;
    const rift = new THREE.Mesh(new THREE.TorusGeometry(1.15, 0.035, 8, 64), ModelFactory.material('red'));
    rift.position.y = 1.15;
    rift.rotation.x = Math.PI / 2;
    table.add(base, holo, rift);
    this.root.add(table);
    this.holoTable = rift;

    const status = ModelFactory.createLabel(this.hubState.currentChapter.replaceAll('-', ' ').toUpperCase());
    status.position.set(0, 3.1, 4.8);
    status.scale.set(4.2, 0.9, 1);
    this.root.add(status);

    for (let i = 0; i < 10; i += 1) {
      const light = new THREE.PointLight(i % 2 ? 0x59d8ff : 0xff3b3b, 0.8, 8);
      light.position.set(-8 + i * 1.8, 3.2, i % 2 ? -5.2 : 5.2);
      this.alertLights.push(light);
      this.root.add(light);
    }
  }

  buildCommandOffice() {
    const desk = makePanel(3.8, 0.7, 1.25, 0x2c2330);
    desk.position.set(-32, 0.45, 1.9);
    this.root.add(desk);
    const map = new THREE.Mesh(new THREE.TorusGeometry(1.4, 0.035, 8, 64), ModelFactory.material('red'));
    map.position.set(-32, 1.2, 1.9);
    map.rotation.x = Math.PI / 2;
    this.root.add(map);
    for (let i = 0; i < 3; i += 1) {
      const screen = makePanel(1.6, 1, 0.08, i % 2 ? 0x163b4a : 0x421d24);
      screen.position.set(-36.8 + i * 2.1, 1.8, -5.25);
      this.root.add(screen);
    }
  }

  buildHangar() {
    const rails = [-2.2, 2.2];
    rails.forEach((x) => {
      const rail = makePanel(0.34, 0.18, 15, 0x42464f);
      rail.position.set(x, 0.28, 22);
      this.root.add(rail);
    });
    const aegis = ModelFactory.createAegis7(0.46);
    aegis.position.set(-5.2, 0, 22);
    aegis.rotation.y = 0.45;
    this.root.add(aegis);
    for (let i = 0; i < 4; i += 1) {
      const scaffold = makePanel(0.2, 2.6, 4.2, 0x3a4652);
      scaffold.position.set(-8 + i * 2, 1.3, 17.8);
      this.root.add(scaffold);
    }
    const doors = makePanel(7, 4.2, 0.35, 0x2a3039);
    doors.position.set(0, 2.1, 29.8);
    this.root.add(doors);
  }

  buildEngineering() {
    for (let i = 0; i < 5; i += 1) {
      const rack = makePanel(0.9, 1.3, 2.2, 0x342c25);
      rack.position.set(-24 + i * 2.2, 0.72, 26);
      this.root.add(rack);
    }
    const testRig = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.08, 8, 48), ModelFactory.material('amber'));
    testRig.position.set(-15.4, 1.5, 18.5);
    testRig.rotation.x = Math.PI / 2;
    this.root.add(testRig);
  }

  buildMedBay() {
    [-2, 2].forEach((offset) => {
      const bed = makePanel(2.6, 0.35, 0.95, 0x263b3a);
      bed.position.set(20 + offset, 0.45, 3);
      this.root.add(bed);
      const monitor = makePanel(0.9, 0.75, 0.08, 0x164d4d);
      monitor.position.set(20 + offset, 1.45, 5);
      this.root.add(monitor);
    });
  }

  buildQuarters() {
    const bed = makePanel(2.8, 0.45, 1.35, 0x3a3326);
    bed.position.set(17, 0.45, 15.5);
    this.root.add(bed);
    const locker = makePanel(0.9, 1.9, 0.7, 0x27313e);
    locker.position.set(24.5, 1, 15.2);
    this.root.add(locker);
    const board = ModelFactory.createLabel('ARC-9 / DO NOT FORGET');
    board.position.set(20, 2.5, 8.6);
    board.scale.set(3, 0.7, 1);
    this.root.add(board);
  }

  buildSyncAndResearch() {
    const core = new THREE.Mesh(new THREE.SphereGeometry(0.9, 28, 18), ModelFactory.material('blue'));
    core.position.set(18, 2.0, -15);
    this.root.add(core);
    this.vaelCore = core;
    for (let i = 0; i < 4; i += 1) {
      const glass = makePanel(0.12, 2.3, 2.3, 0x16354a);
      glass.material.transparent = true;
      glass.material.opacity = 0.45;
      glass.position.set(14.5 + i * 2.3, 1.25, -20.1);
      this.root.add(glass);
    }
    for (let i = 0; i < 4; i += 1) {
      const sample = new THREE.Mesh(new THREE.OctahedronGeometry(0.35 + i * 0.08), ModelFactory.material(i % 2 ? 'red' : 'blue'));
      sample.position.set(29 + i * 1.8, 1.3, -11.5);
      this.root.add(sample);
    }
  }

  buildObservation() {
    const windowWall = makePanel(18, 3.6, 0.22, 0x0b1019);
    windowWall.position.set(0, 2.0, -33);
    this.root.add(windowWall);
    const glass = new THREE.Mesh(new THREE.PlaneGeometry(15, 2.8), ModelFactory.material('glass'));
    glass.position.set(0, 2.1, -32.86);
    this.root.add(glass);
    const rift = new THREE.Mesh(new THREE.TorusGeometry(2.8, 0.08, 8, 80), ModelFactory.material('red'));
    rift.position.set(0, 3.1, -35.5);
    rift.rotation.x = 1.1;
    this.root.add(rift);
    this.observationRift = rift;
  }

  placeInteractables() {
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
  }

  buildChapterEffects() {
    if (this.hubState.currentChapter === 'chapter-3-redline-descent') {
      this.addStaticRing(18, -15, 'red');
    }
    if (this.hubState.currentChapter === 'chapter-6-silent-choir') {
      this.addStaticRing(0, -16, 'violet');
    }
    if (this.hubState.currentChapter === 'chapter-10-iron-requiem') {
      this.addStaticRing(0, 0, 'red', 2.8);
    }
  }

  addStaticRing(x, z, material = 'red', radius = 1.4) {
    const staticVeil = new THREE.Mesh(new THREE.TorusGeometry(radius, 0.035, 8, 48), ModelFactory.material(material));
    staticVeil.position.set(x, 2.5, z);
    staticVeil.rotation.x = Math.PI / 2;
    this.root.add(staticVeil);
    this.redlineStatic = staticVeil;
  }

  setEmergency(active) {
    this.emergency = active;
  }

  updateCurrentRoom(state) {
    const player = this.player.position;
    const room = ROOM_LAYOUT.find((candidate) =>
      Math.abs(player.x - candidate.x) <= candidate.w / 2 &&
      Math.abs(player.z - candidate.z) <= candidate.d / 2
    );
    if (!room) return;
    state.facility.currentRoom = room.id;
    if (!state.facility.visitedRooms.includes(room.id)) {
      state.facility.visitedRooms.push(room.id);
    }
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

    this.player.position.x = THREE.MathUtils.clamp(this.player.position.x, -38, 38);
    this.player.position.z = THREE.MathUtils.clamp(this.player.position.z, -33, 30);
    this.updateCurrentRoom(state);

    this.player.children.forEach((part) => {
      if (part.name.includes('leg') || part.name.includes('arm')) {
        part.rotation.x = Math.sin(this.clock * 8) * (direction.lengthSq() > 0.001 ? 0.18 : 0.03);
      }
    });

    this.alertLights.forEach((light, index) => {
      const lateBoost = state.currentChapter === 'chapter-10-iron-requiem' ? 0.65 : 0;
      light.intensity = state.storyFlags.emergencyStarted || lateBoost
        ? 1.2 + lateBoost + Math.sin(this.clock * 8 + index) * 0.75
        : 0.42;
    });

    this.roomLights.forEach((light, index) => {
      light.intensity = 0.42 + Math.sin(this.clock * 1.4 + index) * 0.08;
    });

    if (this.holoTable) {
      this.holoTable.rotation.z += dt * 0.5;
    }
    if (this.vaelCore) {
      this.vaelCore.scale.setScalar(1 + Math.sin(this.clock * 2.2) * 0.05);
    }
    if (this.observationRift) {
      this.observationRift.rotation.z += dt * 0.25;
    }
    if (this.redlineStatic) {
      this.redlineStatic.rotation.z += dt * 0.8;
      this.redlineStatic.scale.setScalar(1 + Math.sin(this.clock * 5) * 0.05);
    }

    const current = this.interaction.update(this.player, this.interactables);
    if (current && input.consumePressed('KeyE')) {
      this.onInteract(current);
    }

    return current ? `E - ${current.label}` : 'M - Facility Map';
  }

  dispose() {
    this.scene.remove(this.root);
  }
}

export { ROOM_LAYOUT };
