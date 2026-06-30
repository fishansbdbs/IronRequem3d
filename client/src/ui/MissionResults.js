export class MissionResults {
  constructor(modal) {
    this.modal = modal;
  }

  open(results, onContinue) {
    this.modal.open({
      title: 'Victory',
      subtitle: `${results.missionName || 'Mission'} complete`,
      body: `
        <div class="results-grid">
          <div><span>Mission</span><strong>${results.missionName || 'Unknown'}</strong></div>
          <div><span>Boss Defeated</span><strong>${results.bossDefeated || 'Target'}</strong></div>
          <div><span>Hull Remaining</span><strong>${Math.round(results.hull)}%</strong></div>
          <div><span>Time</span><strong>${results.time.toFixed(1)}s</strong></div>
          <div><span>Damage Dealt</span><strong>${Math.round(results.damageDealt)}</strong></div>
          <div><span>Damage Taken</span><strong>${Math.round(results.damageTaken)}</strong></div>
          <div><span>Enemies Defeated</span><strong>${results.enemiesDefeated ?? results.shardsDefeated ?? 0}</strong></div>
          <div><span>Salvage Earned</span><strong>${results.salvage}</strong></div>
          <div><span>Sync Gained</span><strong>${results.sync}</strong></div>
          <div><span>Bonds Affected</span><strong>${results.bondsAffected?.length ? results.bondsAffected.join(', ') : 'Crew steady'}</strong></div>
          <div><span>Chapter Unlocked</span><strong>${results.chapterUnlocked || 'Updated in save'}</strong></div>
        </div>
      `,
      actions: [{ label: 'Return to Arc-12', kind: 'primary', onClick: onContinue }]
    });
  }
}
