# Iron Requiem 3D Remaster Agent Notes

## Project Shape
- `client/` contains the Vite and Three.js browser game.
- `server/` contains the Express and Socket.IO telemetry scaffold.
- `shared/` contains constants, balance values, and save schema shared by both sides.
- `netlify.toml` builds and publishes the client.
- `render.yaml` describes the Render web service for the server.

## Standard Commands
- `npm run install:all`
- `npm run dev:server`
- `npm run dev:client`
- `npm run build:client`
- `npm run start:server`
- `npm run check`

## Local URLs
- Client: `http://localhost:5173`
- Server: `http://localhost:3000`
- Health: `http://localhost:3000/health`

## Source Rules
- The old Iron Requiem ZIP is reference material only.
- Do not edit or copy the bundled old HTML directly.
- Preserve story concepts, terminology, and tone where useful.
- Do not copy copyrighted mecha designs, UI, logos, names, music, or assets from existing franchises.
- Use procedural models, generated UI, CSS, simple materials, SVG/CSS shapes, and Web Audio effects.
- Do not rely on missing external models, paid APIs, or private assets.

## Implementation Rules
- Keep systems data-driven: chapters, missions, enemies, weapons, upgrades, and dialogue belong in data files.
- Keep simulation state out of Three.js meshes.
- Use DOM overlays for text-heavy HUD, menus, settings, dialogue, upgrades, and results.
- Avoid unnecessary rewrites and broad refactors.
- Run targeted tests for state, save, and server behavior when changing those systems.
- Run a browser smoke test for visual or interaction changes.
- No checkpoint loops or fake completion claims.
- Commit directly to `main` only after tests and client build pass.
