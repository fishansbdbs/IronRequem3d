import { ROOM_LAYOUT } from '../hub/Arc12Hub.js';

const ROOM_NOTES = {
  'central-atrium': 'Objective terminal, Vael projection, end day console',
  'command-corridor': 'Route to command office',
  'nira-office': 'Commander Nira, strategy choices',
  'briefing-room': 'Mission board and launch authorization',
  'observation-deck': 'Sky aperture, external rift readouts',
  'vael-sync-chamber': 'Vael core, neural sync scenes',
  'research-lab': 'Veilborn samples and Lira notes',
  'med-bay': 'Sera, recovery, stress checks',
  'pilot-quarters': 'Kaito rest, memory board, reflection',
  'hangar-bay': 'AEGIS-7, launch frame, catapult rails',
  'engineering-deck': 'Rook, upgrades, weapon testing rig'
};

export class FacilityMapUI {
  constructor(modal) {
    this.modal = modal;
  }

  open(state) {
    const currentRoom = state.facility.currentRoom;
    const visitedRooms = new Set(state.facility.visitedRooms || []);
    const unlockedRooms = new Set(state.facility.unlockedRooms || []);
    const minX = Math.min(...ROOM_LAYOUT.map((room) => room.x - room.w / 2));
    const maxX = Math.max(...ROOM_LAYOUT.map((room) => room.x + room.w / 2));
    const minZ = Math.min(...ROOM_LAYOUT.map((room) => room.z - room.d / 2));
    const maxZ = Math.max(...ROOM_LAYOUT.map((room) => room.z + room.d / 2));
    const width = maxX - minX;
    const depth = maxZ - minZ;

    const rooms = ROOM_LAYOUT.map((room) => {
      const left = ((room.x - room.w / 2 - minX) / width) * 100;
      const top = ((room.z - room.d / 2 - minZ) / depth) * 100;
      const roomWidth = (room.w / width) * 100;
      const roomDepth = (room.d / depth) * 100;
      const classes = [
        'facility-map-room',
        room.id === currentRoom ? 'current' : '',
        visitedRooms.has(room.id) ? 'visited' : '',
        unlockedRooms.has(room.id) ? 'unlocked' : 'locked'
      ].filter(Boolean).join(' ');

      return `
        <div class="${classes}" style="left:${left}%;top:${top}%;width:${roomWidth}%;height:${roomDepth}%;">
          <strong>${room.label}</strong>
        </div>
      `;
    }).join('');

    const list = ROOM_LAYOUT.map((room) => `
      <li class="${room.id === currentRoom ? 'current' : ''}">
        <span>${room.label}</span>
        <small>${ROOM_NOTES[room.id]}</small>
      </li>
    `).join('');

    this.modal.open({
      title: 'Arc-12 Facility Map',
      subtitle: `${ROOM_LAYOUT.find((room) => room.id === currentRoom)?.label || 'Central Command Atrium'} / ${state.objective}`,
      body: `
        <div class="facility-map">
          <div class="facility-map-canvas">${rooms}</div>
          <ul class="facility-map-list">${list}</ul>
        </div>
      `,
      actions: [{ label: 'Close', kind: 'primary', onClick: () => this.modal.close() }]
    });
  }
}
