import { MISSIONS } from '../data/missions.js';

export class BriefingScene {
  constructor({ modal, onLaunch }) {
    this.modal = modal;
    this.onLaunch = onLaunch;
  }

  show() {
    const mission = MISSIONS.ironWake;
    this.modal.open({
      title: mission.name,
      subtitle: `${mission.location} / Target: ${mission.enemy}`,
      body: `
        <div class="briefing-grid">
          <div class="holo-map">
            <div class="rift-pulse"></div>
            <span>Sector 7-Delta</span>
          </div>
          <div>
            <p>Enemy silhouette confirms VB-01 Fracture Worm. Avoid telegraphs, preserve Hull, and bring AEGIS-7 home.</p>
            <ul>${mission.objectives.map((objective) => `<li>${objective}</li>`).join('')}</ul>
            <p class="reward">Reward: ${mission.reward.salvage} Salvage / ${mission.reward.sync} Sync</p>
          </div>
        </div>
      `,
      actions: [
        { label: 'Launch', kind: 'primary', onClick: this.onLaunch },
        { label: 'Return', kind: 'ghost', onClick: () => this.modal.close() }
      ]
    });
  }
}
