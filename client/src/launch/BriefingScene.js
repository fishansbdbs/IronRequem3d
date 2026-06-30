export class BriefingScene {
  constructor({ modal, mission, onLaunch }) {
    this.modal = modal;
    this.mission = mission;
    this.onLaunch = onLaunch;
  }

  show() {
    const mission = this.mission;
    this.modal.open({
      title: mission.name,
      subtitle: `${mission.location} / Target: ${mission.enemy}`,
      body: `
        <div class="briefing-grid">
          <div class="holo-map ${mission.environment}">
            <div class="rift-pulse"></div>
            <span>${mission.sector}</span>
          </div>
          <div>
            <p>${mission.brief}</p>
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
