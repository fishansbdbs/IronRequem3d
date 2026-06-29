export class UpgradeUI {
  constructor(modal, upgradeBay, onPurchase) {
    this.modal = modal;
    this.upgradeBay = upgradeBay;
    this.onPurchase = onPurchase;
  }

  open(state) {
    const upgrades = this.upgradeBay.list(state);
    const body = `
      <p>Available Salvage: <strong>${state.salvage}</strong></p>
      <div class="upgrade-list">
        ${upgrades.map((upgrade) => `
          <article class="upgrade-row">
            <div>
              <h3>${upgrade.name}</h3>
              <p>${upgrade.description}</p>
              <span>Level ${upgrade.currentLevel} / Current ${upgrade.currentValue}</span>
            </div>
            <button class="ui-button ${upgrade.affordable ? 'primary' : 'disabled'}" data-upgrade="${upgrade.id}" ${upgrade.affordable ? '' : 'disabled'}>
              ${upgrade.cost} Salvage
            </button>
          </article>
        `).join('')}
      </div>
    `;
    this.modal.open({
      title: 'AEGIS-7 Upgrade Bay',
      subtitle: 'Rook routes every change through a versioned Salvage ledger.',
      body,
      actions: [{ label: 'Close', kind: 'ghost', onClick: () => this.modal.close() }]
    });
    this.modal.el.querySelectorAll('[data-upgrade]').forEach((button) => {
      button.addEventListener('click', () => this.onPurchase(button.dataset.upgrade));
    });
  }
}
