export class MissionResults {
  constructor(modal) {
    this.modal = modal;
  }

  open(results, onContinue) {
    this.modal.open({
      title: 'Victory',
      subtitle: 'Operation Iron Wake complete',
      body: `
        <div class="results-grid">
          <div><span>Hull Remaining</span><strong>${Math.round(results.hull)}%</strong></div>
          <div><span>Time</span><strong>${results.time.toFixed(1)}s</strong></div>
          <div><span>Damage Dealt</span><strong>${Math.round(results.damageDealt)}</strong></div>
          <div><span>Damage Taken</span><strong>${Math.round(results.damageTaken)}</strong></div>
          <div><span>Rift Shards Defeated</span><strong>${results.shardsDefeated}</strong></div>
          <div><span>Salvage Earned</span><strong>${results.salvage}</strong></div>
          <div><span>Sync Gained</span><strong>${results.sync}</strong></div>
        </div>
      `,
      actions: [{ label: 'Return to Arc-12', kind: 'primary', onClick: onContinue }]
    });
  }
}
