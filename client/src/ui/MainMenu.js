import { GAME_TITLE, GAME_VERSION, PROTOTYPE_NAME } from '../../../shared/constants.js';

export class MainMenu {
  constructor(host, callbacks) {
    this.host = host;
    this.callbacks = callbacks;
    this.el = document.createElement('section');
    this.el.className = 'main-menu hidden';
    host.appendChild(this.el);
  }

  setServerStatus(status) {
    this.serverStatus = status;
    this.render();
  }

  show() {
    this.el.classList.remove('hidden');
    this.render();
  }

  hide() {
    this.el.classList.add('hidden');
  }

  render() {
    this.el.innerHTML = `
      <div class="menu-copy">
        <span class="eyebrow">v${GAME_VERSION}</span>
        <h1>${GAME_TITLE}</h1>
        <p>${PROTOTYPE_NAME}</p>
        <div class="server-pill ${this.serverStatus?.ok ? 'online' : 'offline'}">
          Server ${this.serverStatus?.ok ? 'online' : 'offline'}
        </div>
      </div>
      <nav class="menu-actions">
        <button class="ui-button primary" data-action="new">New Game</button>
        <button class="ui-button secondary" data-action="continue">Continue</button>
        <button class="ui-button secondary" data-action="settings">Settings</button>
        <button class="ui-button secondary" data-action="patch">Patch Notes</button>
        <button class="ui-button secondary" data-action="credits">Credits</button>
      </nav>
    `;
    this.el.querySelector('[data-action="new"]').addEventListener('click', this.callbacks.onNewGame);
    this.el.querySelector('[data-action="continue"]').addEventListener('click', this.callbacks.onContinue);
    this.el.querySelector('[data-action="settings"]').addEventListener('click', this.callbacks.onSettings);
    this.el.querySelector('[data-action="patch"]').addEventListener('click', this.callbacks.onPatchNotes);
    this.el.querySelector('[data-action="credits"]').addEventListener('click', this.callbacks.onCredits);
  }
}
