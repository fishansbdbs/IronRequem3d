export class PatchNotesUI {
  constructor(modal) {
    this.modal = modal;
  }

  open() {
    this.modal.open({
      title: 'v0.3.1 — Boss Identity & Campaign Polish',
      body: `
        <h3>v0.3.1 — Boss Identity & Campaign Polish</h3>
        <ul class="patch-list">
          <li>Reworked Chapter 4-10 bosses with stronger silhouettes, named mechanics, phase behavior, telegraph palettes, and death effects.</li>
          <li>Added event-specific crew callouts for boss starts, phase shifts, low hull warnings, and victory beats.</li>
          <li>Added mission result copy for late-campaign aftermath and renamed the final choices to Sever the Signal, Merge with Vael, and Save Arc-12.</li>
          <li>Expanded late-campaign arena props and added combat readability polish for special fields, pulls, slows, rifle silence, muzzle flashes, and hit feedback.</li>
        </ul>
        <h3>v0.3.0 - Arc-12 Campaign Expansion</h3>
        <ul class="patch-list">
          <li>Expanded the campaign from Chapter 3 through Chapter 10 with playable operations, briefings, launches, battle environments, bosses, results, and aftermath dialogue.</li>
          <li>Rebuilt Arc-12 into a walkable facility with a central atrium, command corridor, Nira office, hangar bay, engineering deck, med bay, pilot quarters, Vael sync chamber, research lab, observation deck, and briefing room.</li>
          <li>Added a facility map opened from the map terminal or the M key.</li>
          <li>Added Prism Leviathan, Hollow Stag, Cantor Null, Cradle Behemoth, Prototype L-0, Seraphim Veil, and Requiem Heart boss encounters.</li>
          <li>Added late-campaign upgrades, AP activities, deeper crew choices, ending flags, save migration to schema v3, and final protocol ending options.</li>
        </ul>
        <h3>v0.2.0 - Echoes Beyond Arc-12</h3>
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
