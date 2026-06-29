export class SettingsUI {
  constructor(modal, { onApply, onResetSave }) {
    this.modal = modal;
    this.onApply = onApply;
    this.onResetSave = onResetSave;
  }

  open(settings) {
    this.modal.open({
      title: 'Settings',
      body: `
        <div class="settings-grid">
          ${this.slider('masterVolume', 'Master Volume', settings.masterVolume, 0, 1)}
          ${this.slider('musicVolume', 'Music Volume', settings.musicVolume, 0, 1)}
          ${this.slider('sfxVolume', 'SFX Volume', settings.sfxVolume, 0, 1)}
          ${this.slider('mouseSensitivity', 'Mouse Sensitivity', settings.mouseSensitivity, 0.2, 1.4)}
          <label><span>Graphics Quality</span><select data-setting="graphicsQuality">
            <option ${settings.graphicsQuality === 'standard' ? 'selected' : ''}>standard</option>
            <option ${settings.graphicsQuality === 'performance' ? 'selected' : ''}>performance</option>
          </select></label>
          <label><span>Screen Shake</span><input type="checkbox" data-setting="screenShake" ${settings.screenShake ? 'checked' : ''}></label>
          <label><span>Reduced Motion</span><input type="checkbox" data-setting="reducedMotion" ${settings.reducedMotion ? 'checked' : ''}></label>
        </div>
      `,
      actions: [
        { label: 'Apply', kind: 'primary', onClick: () => this.apply() },
        { label: 'Reset Save', kind: 'danger', onClick: () => this.onResetSave() },
        { label: 'Close', kind: 'ghost', onClick: () => this.modal.close() }
      ]
    });
  }

  slider(id, label, value, min, max) {
    return `<label><span>${label}</span><input type="range" min="${min}" max="${max}" step="0.05" value="${value}" data-setting="${id}"></label>`;
  }

  apply() {
    const next = {};
    this.modal.el.querySelectorAll('[data-setting]').forEach((input) => {
      if (input.type === 'checkbox') {
        next[input.dataset.setting] = input.checked;
      } else if (input.type === 'range') {
        next[input.dataset.setting] = Number(input.value);
      } else {
        next[input.dataset.setting] = input.value;
      }
    });
    this.onApply(next);
    this.modal.close();
  }
}
