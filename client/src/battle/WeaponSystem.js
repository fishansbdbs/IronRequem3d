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
  }

  update(dt, input, state) {
    if (input.consumeMouse(0)) this.melee(state);
    if (input.consumeMouse(2)) this.rifle(state);
    if (input.consumePressed('KeyQ')) this.overdrive(state);

    this.effects = this.effects.filter((effect) => {
      const alive = VFXFactory.updateImpact(effect, dt);
      if (!alive) this.scene.remove(effect);
      return alive;
    });
  }

  melee(state) {
    if (this.mecha.cooldowns.melee > 0) return;
    this.mecha.cooldowns.melee = BATTLE_BALANCE.meleeCooldown;
    const distance = this.mecha.mesh.position.distanceTo(this.boss.mesh.position);
    const arc = VFXFactory.createSlashArc();
    arc.position.copy(this.mecha.mesh.position);
    arc.position.y += 1.8;
    this.scene.add(arc);
    this.effects.push(arc);
    if (distance < 5.2) {
      this.hit(state.stats.meleePower, 'Melee');
      this.mecha.gainSync(9);
    }
  }

  rifle(state) {
    if (this.mecha.cooldowns.rifle > 0 || this.mecha.stats.energy < BATTLE_BALANCE.rifleEnergyCost) return;
    this.mecha.cooldowns.rifle = BATTLE_BALANCE.rifleCooldown;
    this.mecha.stats.energy -= BATTLE_BALANCE.rifleEnergyCost;
    const distance = this.mecha.mesh.position.distanceTo(this.boss.mesh.position);
    const impact = VFXFactory.createImpact('blue');
    impact.position.copy(this.boss.mesh.position);
    impact.position.y += 1.2;
    this.scene.add(impact);
    this.effects.push(impact);
    if (distance < 28) {
      this.hit(state.stats.riflePower, 'Rifle');
      this.mecha.gainSync(6);
    }
  }

  overdrive() {
    if (this.mecha.stats.sync < 100 || this.mecha.cooldowns.overdrive > 0) return;
    this.mecha.stats.sync = 0;
    this.mecha.cooldowns.overdrive = 3;
    this.hit(BATTLE_BALANCE.overdriveDamage, 'Overdrive Slash');
    this.mecha.mesh.scale.setScalar(1.1);
    setTimeout(() => this.mecha.mesh.scale.setScalar(1), 180);
  }

  hit(amount, label) {
    this.boss.damage(amount);
    this.audio.hit();
    this.onDamage(amount, label, this.boss.mesh.position);
  }
}
