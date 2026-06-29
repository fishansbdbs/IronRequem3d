import { UPGRADES } from '../data/upgrades.js';
import { applyUpgrade } from '../game/GameState.js';

export class UpgradeBay {
  list(state) {
    return UPGRADES.map((upgrade) => ({
      ...upgrade,
      currentLevel: state.upgrades[upgrade.id]?.level || 0,
      affordable: state.salvage >= upgrade.cost,
      currentValue: state.stats[upgrade.stat]
    }));
  }

  purchase(state, upgradeId) {
    return applyUpgrade(state, upgradeId);
  }
}
