export class PatchNotesUI {
  constructor(modal) {
    this.modal = modal;
  }

  open() {
    this.modal.open({
      title: 'v0.1.0 - Arc-12 Launch Prototype',
      body: `
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
