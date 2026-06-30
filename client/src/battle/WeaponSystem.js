import * as THREE from 'three';
import { BATTLE_BALANCE } from '../../../shared/balance.js';
import { VFXFactory } from '../game/VFXFactory.js';

export class WeaponSystem {
  constructor({ scene, mecha, boss, audio, onDamage }) {
    this.scene = scene;
    this.mecha = mecha;
    this.boss = boss;
    this.audio = audio;
    this.onDamage = onDamage;
    this.effects = [];
    this.silenceTimer = 0;
  }

  update(dt, input, state) {
    this.silenceTimer = Math.max(0, this.silenceTimer - dt);
    if (input.consumeMouse(0)) this.melee(state);
    if (input.consumeMouse(2)) this.rifle(state);
    if (input.consumePressed('KeyQ')) this.overdrive(state);
    if (this.mecha.consumeDashEffect()) this.dashFlare();

    this.effects = this.effects.filter((effect) => {
      const alive = effect.userData.effectType === 'impact'
        ? VFXFactory.updateImpact(effect, dt)
        : VFXFactory.updateTimedEffect(effect, dt);
      if (!alive) this.scene.remove(effect);
      return alive;
    });
  }

  melee(state) {
    if (this.mecha.cooldowns.melee > 0) return;
    this.mecha.cooldowns.melee = BATTLE_BALANCE.meleeCooldown;
    this.mecha.startMeleeAnimation();
    const distance = this.mecha.mesh.position.distanceTo(this.boss.mesh.position);
    const arc = VFXFactory.createSlashArc();
    arc.position.copy(this.mecha.mesh.position);
    arc.position.y += 1.8;
    arc.rotation.z = this.mecha.mesh.rotation.y - 0.8;
    this.scene.add(arc);
    this.effects.push(arc);
    if (distance < 5.2) {
      this.hit(state.stats.meleePower, 'Melee');
      this.mecha.gainSync(9);
    }
  }

  rifle(state) {
    if (this.silenceTimer > 0 || this.mecha.cooldowns.rifle > 0 || this.mecha.stats.energy < BATTLE_BALANCE.rifleEnergyCost) return;
    this.mecha.cooldowns.rifle = BATTLE_BALANCE.rifleCooldown;
    this.mecha.stats.energy -= BATTLE_BALANCE.rifleEnergyCost;
    this.mecha.startRifleAnimation();
    const distance = this.mecha.mesh.position.distanceTo(this.boss.mesh.position);
    const origin = this.mecha.mesh.position.clone().add(new THREE.Vector3(0, 2.35, 0));
    const target = this.boss.mesh.position.clone().add(new THREE.Vector3(0, 1.5, 0));
    const direction = target.clone().sub(origin).normalize();
    const flash = VFXFactory.createMuzzleFlash('blue');
    flash.position.copy(origin);
    flash.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), direction);
    this.scene.add(flash);
    this.effects.push(flash);
    const impact = VFXFactory.createImpact('blue');
    impact.position.copy(this.boss.mesh.position);
    impact.position.y += 1.2;
    this.scene.add(impact);
    this.effects.push(impact);
    const beam = VFXFactory.createEnergyBeam(Math.max(2, distance), 'blue');
    beam.position.copy(origin.clone().lerp(target, 0.5));
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
    this.scene.add(beam);
    this.effects.push(beam);
    if (distance < 28) {
      this.hit(state.stats.riflePower, 'Rifle');
      this.mecha.gainSync(6);
    }
  }

  overdrive(state) {
    if (this.mecha.stats.sync < 100 || this.mecha.cooldowns.overdrive > 0) return;
    this.mecha.stats.sync = 0;
    this.mecha.cooldowns.overdrive = Math.max(1.8, 3 - (state.stats.overdriveRecovery || 0));
    this.mecha.startOverdriveAnimation();
    this.hit(BATTLE_BALANCE.overdriveDamage, 'Overdrive Slash');
    const shockwave = VFXFactory.createShockwave(4.2, 'blue');
    shockwave.position.copy(this.boss.mesh.position);
    shockwave.position.y = 0.18;
    this.scene.add(shockwave);
    this.effects.push(shockwave);
    const arc = VFXFactory.createSlashArc();
    arc.scale.set(1.9, 0.75, 1.9);
    arc.position.copy(this.mecha.mesh.position);
    arc.position.y += 2.1;
    this.scene.add(arc);
    this.effects.push(arc);
  }

  hit(amount, label) {
    this.boss.damage(amount);
    this.audio.hit();
    this.onDamage(amount, label, this.boss.mesh.position);
  }

  applySilence(duration = 2) {
    this.silenceTimer = Math.max(this.silenceTimer, duration);
  }

  dashFlare() {
    const flare = VFXFactory.createThrusterFlare('blue');
    flare.position.copy(this.mecha.mesh.position);
    flare.position.y += 1.3;
    flare.rotation.y = this.mecha.mesh.rotation.y;
    this.scene.add(flare);
    this.effects.push(flare);
  }
}
