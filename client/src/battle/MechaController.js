import * as THREE from 'three';
import { BATTLE_BALANCE } from '../../../shared/balance.js';

export class MechaController {
  constructor(mesh, state) {
    this.mesh = mesh;
    this.stats = {
      hull: state.stats.hull,
      maxHull: state.stats.hull,
      energy: state.stats.energy,
      maxEnergy: state.stats.energy,
      sync: state.sync.value,
      maxSync: 100
    };
    this.cooldowns = {
      melee: 0,
      rifle: 0,
      dash: 0,
      overdrive: 0
    };
    this.velocity = new THREE.Vector3();
  }

  update(dt, input, cameraController) {
    Object.keys(this.cooldowns).forEach((key) => {
      this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
    });
    this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + dt * 7);
    this.stats.sync = Math.min(this.stats.maxSync, this.stats.sync + dt * 1.6);

    const move = input.movementVector();
    const { forward, right } = cameraController.getForwardRight();
    const direction = forward.multiplyScalar(-move.z).add(right.multiplyScalar(move.x));
    if (direction.lengthSq() > 0.001) {
      direction.normalize();
      const speed = input.isDown('ShiftLeft') ? 8 : 6;
      this.velocity.lerp(direction.multiplyScalar(speed), Math.min(1, dt * 10));
      this.mesh.rotation.y = Math.atan2(this.velocity.x, this.velocity.z);
    } else {
      this.velocity.multiplyScalar(Math.max(0, 1 - dt * 7));
    }

    if (input.consumePressed('Space') && this.cooldowns.dash <= 0) {
      this.velocity.multiplyScalar(2.5);
      this.cooldowns.dash = BATTLE_BALANCE.dashCooldown;
      this.stats.energy = Math.max(0, this.stats.energy - 6);
    }

    this.mesh.position.addScaledVector(this.velocity, dt);
    this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -22, 22);
    this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, -22, 22);
  }

  damage(amount) {
    this.stats.hull = Math.max(0, this.stats.hull - amount);
  }

  gainSync(amount) {
    this.stats.sync = Math.min(this.stats.maxSync, this.stats.sync + amount);
  }
}
