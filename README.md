# IRON REQUIEM 3D REMASTER

`v0.1.0 - Arc-12 Launch Prototype` is a clean 3D remaster vertical slice of Iron Requiem. It rebuilds the old visual-novel idea as a Vite and Three.js browser game with a small Express and Socket.IO server scaffold.

The old Iron Requiem ZIP was inspected only for story, terminology, tone, characters, chapter concepts, upgrades, and battle ideas. The bundled old HTML was not edited or copied.

## What Is Included

- Dramatic main menu with animated procedural AEGIS-7 backdrop.
- Intro story for Chapter 1 - Iron Wake.
- Walkable Arc-12 command hub with Kaito Ashveil.
- Commander Nira, Vael Terminal, Engineer Rook, and Medic Sera interactions.
- Action Points, crew bonds, objective updates, upgrades, and LocalStorage saves.
- Emergency end-day flow, Operation Iron Wake briefing, and hangar walk-in.
- Cinematic AEGIS-7 launch sequence.
- Third-person mecha battle against Fracture Worm with telegraphs, dash, melee, rifle, Sync, and Overdrive Slash.
- Mission results and return to Arc-12.
- Netlify client config and Render server config.

## Local Setup

```bash
npm run install:all
npm run dev:server
npm run dev:client
```

Open `http://localhost:5173`. The server health endpoint is `http://localhost:3000/health`.

## Required Environment Variables

Client `.env`:

```bash
VITE_SERVER_URL=http://localhost:3000
```

Server `.env`:

```bash
PORT=3000
CLIENT_ORIGIN=http://localhost:5173
```

For production, set `VITE_SERVER_URL=https://YOUR-RENDER-SERVER.onrender.com` on Netlify and `CLIENT_ORIGIN=https://YOUR-NETLIFY-SITE.netlify.app` on Render.

## Commands

```bash
npm run install:all
npm run dev:server
npm run dev:client
npm run build:client
npm run start:server
npm run check
```

The `check` command runs the state/save/server tests and then builds the client.

## Controls

Hub:

- WASD: move
- Mouse drag: camera
- E: interact
- Shift: sprint
- Tab: objective panel placeholder
- Esc: settings/modal escape in supported scenes

Battle:

- WASD: move
- Mouse drag: camera
- Left click: melee
- Right click: rifle
- Space: dash
- Q: Overdrive Slash when Sync is full
- Shift: boost movement

## Hub Phase

Arc-12 is a compact 3D command deck with the Command Center, Hangar Access, Pilot Quarters, Research Terminal, Upgrade Bay, Observation Window, Briefing Table, and Vael Sync Terminal. Interact with crew and terminals to spend AP, raise bonds, open upgrades, end the day, and launch the mission flow.

## AP, Bonds, and Upgrades

Each day starts with 3 AP. Crew interactions spend AP once per activity and can increase crew bonds. AEGIS-7 upgrades are data-driven through `shared/balance.js` and saved through the versioned LocalStorage schema.

## Launch Sequence

The launch sequence pans over AEGIS-7, unlocks clamps, stabilizes Vael's neural link, opens hangar doors, ignites thrusters, and fires the catapult rail into the battlefield.

## Battle

Mission 1 takes place in the Ruined City Outskirts. The Fracture Worm uses Bite Lunge, Burrow Strike, Rift Spit, Tail Sweep, and limited Rift Shard summons. Damage lands after red telegraphs, not before.

## Adding Content

- Chapters: edit `client/src/data/chapters.js` and story flags in `shared/saveSchema.js`.
- Missions: edit `client/src/data/missions.js`.
- Enemies: edit `client/src/data/enemies.js` and add scene logic under `client/src/battle/`.
- Weapons: edit `client/src/data/weapons.js` and `client/src/battle/WeaponSystem.js`.
- Upgrades: edit `shared/balance.js`; UI reads definitions from there.

## Deploying

Netlify:

1. Connect the repo.
2. Use `client` as the base directory.
3. Build command: `npm run build`.
4. Publish directory: `client/dist`.
5. Set `VITE_SERVER_URL` to the Render server URL.

Render:

1. Create a Blueprint from `render.yaml`.
2. Set `CLIENT_ORIGIN` to the Netlify URL.
3. Confirm `/health` returns `{ "ok": true, "service": "iron-requiem-remaster-server" }`.

## Known Limitations

- The prototype uses procedural geometry instead of authored GLB models.
- Physics are lightweight distance checks rather than a full Rapier simulation.
- Routes and endings are prepared through data and save shape but not fully implemented.
- Mobile layout is responsive, but the current controls are desktop-first.
