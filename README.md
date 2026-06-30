# IRON REQUIEM 3D REMASTER

`v0.3.1 - Boss Identity & Campaign Polish` expands the clean 3D remaster's late campaign with stronger Chapter 4-10 boss identities, event callouts, readable telegraphs, and final choice copy. It remains a Vite and Three.js browser game with the existing Express and Socket.IO server scaffold.

The old Iron Requiem ZIP was inspected only for story, terminology, tone, characters, chapter concepts, upgrades, and battle ideas. The bundled old HTML was not edited or copied.

## What Is Included

- Main menu showing `IRON REQUIEM 3D REMASTER`, `Boss Identity & Campaign Polish`, and `v0.3.1`.
- A walkable Arc-12 facility with central atrium, command corridor, Commander Nira's room, hangar bay, engineering deck, med bay, pilot quarters, Vael sync chamber, research lab, observation deck, and briefing room.
- Facility map opened from the central map terminal or the `M` key.
- Commander Nira, Vael, Engineer Rook, and Medic Sera interactions with chapter-specific dialogue and choices.
- Action Points, crew bonds, objective updates, upgrades, ending flags, and schema v3 LocalStorage saves.
- Ten chapters and ten operations, from Operation Iron Wake through Operation Iron Requiem.
- Mission-specific briefings, hangar flavor, launch lines, battle environments, crew callouts, rewards, aftermath scenes, and final protocol ending choices.
- Third-person mecha battles with telegraphs, dash, melee, rifle, Sync, Overdrive Slash, summons, projectiles, and procedural boss models.
- Netlify client config and Render server config unchanged.

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
- M: facility map
- Esc: settings/modal escape in supported scenes

Battle:

- WASD: move
- Mouse drag: camera
- Left click: melee
- Right click: rifle
- Space: dash
- Q: Overdrive Slash when Sync is full
- Shift: boost movement

## Chapters And Missions

- Chapter 1 - Iron Wake: Operation Iron Wake, Fracture Worm, Ruined City Outskirts.
- Chapter 2 - Hollow Signal: Operation Hollow Signal, Echo Stalker, Ruined Broadcast District.
- Chapter 3 - Redline Descent: Operation Redline Descent, Redline Colossus, Subway Ruins / Redline Tunnel.
- Chapter 4 - Glass Horizon: Operation Glass Horizon, Prism Leviathan, Glassed Coast.
- Chapter 5 - Black Orchard: Operation Black Orchard, Hollow Stag, Black Orchard.
- Chapter 6 - Silent Choir: Operation Silent Choir, Cantor Null, Cathedral Relay.
- Chapter 7 - Ashfall Cradle: Operation Ashfall Cradle, Cradle Behemoth, Ashfall Cradle.
- Chapter 8 - Vael's Door: Operation Vael's Door, Prototype L-0, Sealed Lab L-0.
- Chapter 9 - Heaven Static: Operation Heaven Static, Seraphim Veil, Upper Rift Weather.
- Chapter 10 - Iron Requiem: Operation Iron Requiem, Requiem Heart, Veil Core Aperture.

After each mission, the save unlocks the next chapter, updates the active mission, refreshes Arc-12 dialogue, records mission history, and unlocks chapter-gated upgrades.

## Hub Phase

Arc-12 is now a compact connected facility. The player spawns in Central Command Atrium and can walk to the command corridor, Nira office, briefing room, observation deck, Vael sync chamber, research lab, med bay, pilot quarters, hangar bay, and engineering deck.

The map modal shows the current room, visited rooms, and NPC/system locations. Pilot quarters, research, and observation consoles add optional AP usage beyond crew conversations.

## AP, Bonds, Upgrades, And Endings

Each day starts with 3 AP. Crew interactions spend AP once per activity and can increase crew bonds. Important conversations offer Kaito responses such as Tactical, Supportive, Defiant, Quiet, and Honest. Choices are saved in `dialogueChoices`, accumulated in `toneRecord`, and can set ending flags.

AEGIS-7 upgrades are data-driven through `shared/balance.js` and saved through the versioned LocalStorage schema. v0.3 adds late-campaign upgrades such as Reflective Plating, Rootbreaker Actuators, Resonance Filter, Prototype Countermeasure, Gravity Anchor, Rift Targeting Array, and Requiem Core.

After Operation Iron Requiem, the final protocol modal offers ending choices based on the campaign state and bonds.

## Adding Content

- Chapters: edit `client/src/data/chapters.js`, add save flags/progression in `shared/saveSchema.js` and `client/src/game/GameState.js`, then map the chapter to a mission in `client/src/data/missions.js`.
- Missions: edit `client/src/data/missions.js` with objectives, reward, launch lines, callouts, environment id, enemy id, and boss factory.
- Bosses: add the enemy dossier in `client/src/data/enemies.js`, a procedural model factory in `client/src/game/ModelFactory.js`, and a boss config in `client/src/battle/EnemyAI.js`.
- Mission environments: add a `BattleScene` environment builder and use the mission `environment` id to route to it.
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

- The game uses procedural geometry instead of authored GLB character and environment models.
- Physics are lightweight distance checks rather than a full rigid-body simulation.
- Boss encounters still use procedural geometry and lightweight collision, but Chapter 4-10 now have bespoke attack sets, telegraph palettes, event callouts, phase behavior, and result copy.
- Mobile layout is responsive, but controls remain desktop-first.
