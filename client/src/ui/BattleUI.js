export class BattleUI {
  constructor(host) {
    this.host = host;
    this.el = document.createElement('div');
    this.el.className = 'battle-ui hidden';
    this.floaters = document.createElement('div');
    this.floaters.className = 'floaters';
    host.appendChild(this.el);
    host.appendChild(this.floaters);
  }

  show() {
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }

  update({ mecha, boss, objective }) {
    this.el.classList.toggle('distorted', Boolean(this.distorted));
    const hull = Math.max(0, (mecha.stats.hull / mecha.stats.maxHull) * 100);
    const energy = Math.max(0, (mecha.stats.energy / mecha.stats.maxEnergy) * 100);
    const sync = Math.max(0, (mecha.stats.sync / mecha.stats.maxSync) * 100);
    const bossHp = Math.max(0, (boss.hp / boss.maxHp) * 100);
    this.el.innerHTML = `
      <div class="battle-top">
        <div class="boss-bar"><span>${boss.name}</span><i style="width:${bossHp}%"></i></div>
      </div>
      <div class="battle-bottom">
        ${this.meter('Hull', hull)}
        ${this.meter('Energy', energy)}
        ${this.meter('Sync', sync)}
        <div class="cooldowns">
          <span>Melee ${mecha.cooldowns.melee.toFixed(1)}</span>
          <span>Rifle ${mecha.cooldowns.rifle.toFixed(1)}</span>
          <span>Dash ${mecha.cooldowns.dash.toFixed(1)}</span>
        </div>
      </div>
      <div class="battle-objective">${objective}</div>
      ${this.currentCallout ? `
        <div class="battle-callout">
          <span>${this.currentCallout.speaker}</span>
          <strong>${this.currentCallout.text}</strong>
        </div>
      ` : ''}
    `;
  }

  meter(label, value) {
    return `<div class="battle-meter"><span>${label}</span><i style="width:${value}%"></i></div>`;
  }

  damage(amount, label) {
    const floater = document.createElement('div');
    floater.className = 'damage-number';
    floater.textContent = `${label} ${Math.round(amount)}`;
    floater.style.left = `${45 + Math.random() * 15}%`;
    floater.style.top = `${35 + Math.random() * 20}%`;
    this.floaters.appendChild(floater);
    setTimeout(() => floater.remove(), 850);
  }

  callout(callout) {
    this.currentCallout = callout;
    clearTimeout(this.calloutTimer);
    this.calloutTimer = setTimeout(() => {
      this.currentCallout = null;
    }, 4300);
  }

  setDistortion(active) {
    this.distorted = active;
  }
}
