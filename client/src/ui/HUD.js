import { CONTROLS } from '../../../shared/constants.js';

export class HUD {
  constructor(host) {
    this.host = host;
    this.el = document.createElement('div');
    this.el.className = 'hud hidden';
    this.host.appendChild(this.el);
    this.launchLine = document.createElement('div');
    this.launchLine.className = 'launch-line hidden';
    this.host.appendChild(this.launchLine);
  }

  show() {
    this.el.classList.remove('hidden');
  }

  hide() {
    this.el.classList.add('hidden');
  }

  update(state, { prompt = '', chapter = '', mode = 'hub' } = {}) {
    this.el.innerHTML = `
      <div class="hud-objective">
        <span>${chapter || 'Arc-12'}</span>
        <strong>${state.objective}</strong>
      </div>
      <div class="hud-status">
        <div><span>AP</span><strong>${state.ap.current}/${state.ap.max}</strong></div>
        <div><span>Salvage</span><strong>${state.salvage}</strong></div>
        <div><span>Sync</span><strong>${Math.round(state.sync.value)}%</strong></div>
      </div>
      <div class="hud-prompt ${prompt ? '' : 'hidden'}">${prompt}</div>
      <div class="controls-hint">${(CONTROLS[mode] || CONTROLS.hub).slice(0, 4).join(' / ')}</div>
    `;
  }

  showLaunchLine(step) {
    this.launchLine.classList.remove('hidden');
    this.launchLine.innerHTML = `<span>${step.speaker}</span><strong>${step.text}</strong>`;
    clearTimeout(this.launchTimer);
    this.launchTimer = setTimeout(() => this.launchLine.classList.add('hidden'), 1900);
  }
}
