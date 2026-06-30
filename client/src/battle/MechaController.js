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
      maxSync: 100,
      dashCooldown: state.stats.dashCooldown,
      syncRate: state.stats.syncRate || 0,
      overdriveRecovery: state.stats.overdriveRecovery || 0
    };
    this.cooldowns = {
      melee: 0,
      rifle: 0,
      dash: 0,
      overdrive: 0
    };
    this.animations = {
      melee: 0,
      rifle: 0,
      dash: 0,
      overdrive: 0
    };
    this.parts = {
      torso: mesh.getObjectByName('torso'),
      leftArm: mesh.getObjectByName('left-arm'),
      rightArm: mesh.getObjectByName('right-arm'),
      blade: mesh.getObjectByName('blade'),
      rifle: mesh.getObjectByName('rifle'),
      core: mesh.getObjectByName('core')
    };
    this.velocity = new THREE.Vector3();
    this.dashEffectQueued = false;
  }

  update(dt, input, cameraController) {
    Object.keys(this.cooldowns).forEach((key) => {
      this.cooldowns[key] = Math.max(0, this.cooldowns[key] - dt);
    });
    Object.keys(this.animations).forEach((key) => {
      this.animations[key] = Math.max(0, this.animations[key] - dt);
    });
    this.stats.energy = Math.min(this.stats.maxEnergy, this.stats.energy + dt * 7);
    this.stats.sync = Math.min(this.stats.maxSync, this.stats.sync + dt * (1.6 + this.stats.syncRate * 0.12));

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
      this.cooldowns.dash = this.stats.dashCooldown || BATTLE_BALANCE.dashCooldown;
      this.stats.energy = Math.max(0, this.stats.energy - 6);
      this.startDashAnimation();
    }

    this.mesh.position.addScaledVector(this.velocity, dt);
    this.mesh.position.x = THREE.MathUtils.clamp(this.mesh.position.x, -22, 22);
    this.mesh.position.z = THREE.MathUtils.clamp(this.mesh.position.z, -22, 22);
    this.applyAttackAnimations();
  }

  damage(amount) {
    this.stats.hull = Math.max(0, this.stats.hull - amount);
  }

  gainSync(amount) {
    this.stats.sync = Math.min(this.stats.maxSync, this.stats.sync + amount);
  }

  startMeleeAnimation() {
    this.animations.melee = 0.42;
  }

  startRifleAnimation() {
    this.animations.rifle = 0.28;
  }

  startDashAnimation() {
    this.animations.dash = 0.32;
    this.dashEffectQueued = true;
  }

  startOverdriveAnimation() {
    this.animations.overdrive = 0.72;
  }

  consumeDashEffect() {
    if (!this.dashEffectQueued) return false;
    this.dashEffectQueued = false;
    return true;
  }

  applyAttackAnimations() {
    const { torso, leftArm, rightArm, blade, rifle, core } = this.parts;
    const meleeProgress = 1 - this.animations.melee / 0.42;
    const rifleProgress = 1 - this.animations.rifle / 0.28;
    const dashProgress = 1 - this.animations.dash / 0.32;
    const overdriveProgress = 1 - this.animations.overdrive / 0.72;

    if (torso) {
      const meleeTwist = this.animations.melee > 0 ? Math.sin(meleeProgress * Math.PI) * 0.46 : 0;
      const overdriveTwist = this.animations.overdrive > 0 ? Math.sin(overdriveProgress * Math.PI) * -0.28 : 0;
      torso.rotation.y = THREE.MathUtils.lerp(torso.rotation.y, meleeTwist + overdriveTwist, 0.38);
    }

    if (leftArm) {
      const swing = this.animations.melee > 0 ? -0.95 + Math.sin(meleeProgress * Math.PI) * 1.75 : 0;
      const charge = this.animations.overdrive > 0 ? -1.2 + Math.sin(overdriveProgress * Math.PI) * 2.15 : 0;
      leftArm.rotation.z = THREE.MathUtils.lerp(leftArm.rotation.z, swing + charge, 0.42);
      leftArm.rotation.x = THREE.MathUtils.lerp(leftArm.rotation.x, this.animations.overdrive > 0 ? -0.45 : 0, 0.3);
    }

    if (blade) {
      const bladeArc = this.animations.melee > 0 ? Math.sin(meleeProgress * Math.PI) * -1.25 : 0;
      const overdriveArc = this.animations.overdrive > 0 ? Math.sin(overdriveProgress * Math.PI) * -1.8 : 0;
      blade.rotation.z = THREE.MathUtils.lerp(blade.rotation.z, bladeArc + overdriveArc, 0.45);
      blade.scale.y = THREE.MathUtils.lerp(blade.scale.y, this.animations.overdrive > 0 ? 1.35 : 1, 0.2);
    }

    if (rightArm) {
      const aim = this.animations.rifle > 0 ? -0.9 : 0;
      rightArm.rotation.x = THREE.MathUtils.lerp(rightArm.rotation.x, aim, 0.38);
    }

    if (rifle) {
      const recoil = this.animations.rifle > 0 ? Math.sin(rifleProgress * Math.PI) * 0.32 : 0;
      rifle.position.z = THREE.MathUtils.lerp(rifle.position.z, -0.35 + recoil, 0.5);
      rifle.rotation.x = THREE.MathUtils.lerp(rifle.rotation.x, this.animations.rifle > 0 ? -0.65 : 0, 0.4);
    }

    if (core) {
      const overdriveGlow = this.animations.overdrive > 0 ? 2.8 + Math.sin(overdriveProgress * Math.PI * 4) : 1.6;
      core.material.emissiveIntensity = THREE.MathUtils.lerp(core.material.emissiveIntensity, overdriveGlow, 0.25);
    }

    if (this.animations.dash > 0) {
      const lean = Math.sin(dashProgress * Math.PI) * -0.22;
      this.mesh.rotation.x = THREE.MathUtils.lerp(this.mesh.rotation.x, lean, 0.4);
    } else {
      this.mesh.rotation.x = THREE.MathUtils.lerp(this.mesh.rotation.x, 0, 0.18);
    }
  }
}
