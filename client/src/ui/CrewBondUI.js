import { CREW_ORDER, CHARACTERS } from '../data/characters.js';

export class CrewBondUI {
  constructor(modal) {
    this.modal = modal;
  }

  open(state) {
    this.modal.open({
      title: 'Crew Bonds',
      subtitle: 'Small trust gains now, larger route consequences later.',
      body: `
        <div class="bond-list">
          ${CREW_ORDER.map((id) => `
            <div class="bond-row">
              <span>${CHARACTERS[id].shortName}</span>
              <meter min="0" max="10" value="${state.bonds[id]}"></meter>
              <strong>${state.bonds[id]}</strong>
            </div>
          `).join('')}
        </div>
      `,
      actions: [{ label: 'Close', kind: 'primary', onClick: () => this.modal.close() }]
    });
  }
}
