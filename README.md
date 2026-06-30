# IRON REQUIEM 3D REMASTER

`v0.2.0 - Echoes Beyond Arc-12` continues the clean 3D remaster through Chapter 3. It rebuilds the old visual-novel idea as a Vite and Three.js browser game with a small Express and Socket.IO server scaffold.

The old Iron Requiem ZIP was inspected only for story, terminology, tone, characters, chapter concepts, upgrades, and battle ideas. The bundled old HTML was not edited or copied.

## What Is Included

- Dramatic main menu with animated procedural AEGIS-7 backdrop.
- Chapter 1 - Iron Wake, Chapter 2 - Hollow Signal, and Chapter 3 - Redline Descent.
- Walkable Arc-12 command hub with Kaito Ashveil.
- Commander Nira, Vael Terminal, Engineer Rook, and Medic Sera interactions with chapter-specific dialogue.
- Dialogue choices that record Kaito's tone, affect crew bonds, set story flags, and persist in saves.
- Action Points, crew bonds, objective updates, upgrades, and LocalStorage saves.
- Emergency end-day flow, Operation Iron Wake briefing, and hangar walk-in.
- Mission-specific AEGIS-7 launch sequences.
- Third-person mecha battles against Fracture Worm, Echo Stalker, and Redline Colossus with telegraphs, dash, melee, rifle, Sync, Overdrive Slash, and crew callouts.
- Broadcast District and Redline Tunnel environments with unique boss models, summons, and attack patterns.
- Expanded mission results and return to Arc-12.
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

AEGIS-7 now animates melee swings, rifle recoil and beam fire, dash flares, and Overdrive Slash. Enemy boss attacks use windup, telegraph, attack motion, impact, and recovery timing.

## Chapters And Missions

- Chapter 1 - Iron Wake: Operation Iron Wake in the Ruined City Outskirts, ending with Fracture Worm.
- Chapter 2 - Hollow Signal: Operation Hollow Signal in the Ruined Broadcast District, ending with Echo Stalker.
- Chapter 3 - Redline Descent: Operation Redline Descent in the Subway Ruins / Redline Tunnel, ending with Redline Colossus.

After each mission, the save unlocks the next chapter, updates the active mission, refreshes Arc-12 dialogue, and records expanded mission history.

## Hub Phase

Arc-12 is a compact 3D command deck with the Command Center, Hangar Access, Pilot Quarters, Research Terminal, Upgrade Bay, Observation Window, Briefing Table, and Vael Sync Terminal. Interact with crew and terminals to spend AP, raise bonds, open upgrades, end the day, and launch the mission flow.

## AP, Bonds, and Upgrades

Each day starts with 3 AP. Crew interactions spend AP once per activity and can increase crew bonds. Important conversations offer 2-3 Kaito responses such as Tactical, Supportive, Defiant, Quiet, and Honest. Choices are saved in `dialogueChoices`, accumulated in `toneRecord`, and can set future story flags.

AEGIS-7 upgrades are data-driven through `shared/balance.js` and saved through the versioned LocalStorage schema. v0.2.0 adds Reinforced Frame, Focused Rifle Core, Blade Actuator, Emergency Thrusters, Signal Anchor, Sync Capacitor, and Overdrive Stabilizer with chapter unlock requirements.

## Launch Sequence

The launch sequence pans over AEGIS-7, unlocks clamps, stabilizes Vael's neural link, opens hangar doors or descent frames, ignites thrusters, and transitions into the selected battlefield. Mission data in `client/src/data/missions.js` controls launch lines and environment flavor.

## Battle

Mission 1 takes place in the Ruined City Outskirts. The Fracture Worm uses Bite Lunge, Burrow Strike, Rift Spit, Tail Sweep, and limited Rift Shard summons.

Mission 2 takes place in the Ruined Broadcast District. Echo Stalker uses Signal Lance, Static Pounce, Echo Clone, Tower Pulse, and Shard Call with signal distortion.

Mission 3 takes place in the Subway Ruins / Redline Tunnel. Redline Colossus uses Rail Slam, Tunnel Collapse, Core Roar, Charge Downline, Summon Crawlers, and a faster phase 2 below half Hull.

Damage lands after red telegraphs, not before.

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

- The prototype uses procedural geometry instead of authored GLB models.
- Physics are lightweight distance checks rather than a full Rapier simulation.
- Routes and endings are prepared through data and save shape but not fully implemented.
- Mobile layout is responsive, but the current controls are desktop-first.
