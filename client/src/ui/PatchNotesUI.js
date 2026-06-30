export class PatchNotesUI {
  constructor(modal) {
    this.modal = modal;
  }

  open() {
    this.modal.open({
      title: 'v0.2.0 - Echoes Beyond Arc-12',
      body: `
        <ul class="patch-list">
          <li>Added Chapter 2: Hollow Signal.</li>
          <li>Added Chapter 3: Redline Descent.</li>
          <li>Added deeper crew dialogue, dialogue choices, bond-affecting responses, and new hub dialogue states.</li>
          <li>Added new AEGIS-7 upgrades unlocked after Chapter 1 and Chapter 2.</li>
          <li>Added improved melee, rifle, dash, and Overdrive Slash animations.</li>
          <li>Added Broadcast District mission, Echo Stalker boss, Redline Tunnel mission, and Redline Colossus boss.</li>
          <li>Added new Veilborn enemy models, mission-specific launch transitions, in-combat crew callouts, and expanded mission results.</li>
        </ul>
        <h3>v0.1.0 - Arc-12 Launch Prototype</h3>
        <ul class="patch-list">
          <li>Rebuilt Iron Requiem as a clean 3D remaster prototype.</li>
          <li>Added Arc-12 command hub, crew interactions, AP, bonds, and upgrades.</li>
          <li>Added Operation Iron Wake, hangar walk-in, AEGIS-7 launch, and Fracture Worm battle.</li>
          <li>Added boss telegraphs, mission results, LocalStorage saves, Netlify config, and Render server setup.</li>
        </ul>
      `,
      actions: [{ label: 'Close', kind: 'primary', onClick: () => this.modal.close() }]
    });
  }
}
