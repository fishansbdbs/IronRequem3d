import test from 'node:test';
import assert from 'node:assert/strict';
import { createServerApp } from '../src/server.js';

test('GET /health returns the Iron Requiem server contract', async () => {
  const { app } = createServerApp({ clientOrigin: 'http://localhost:5173' });
  const server = app.listen(0);

  try {
    const { port } = server.address();
    const response = await fetch(`http://127.0.0.1:${port}/health`);
    const body = await response.json();

    assert.equal(response.status, 200);
    assert.deepEqual(body, {
      ok: true,
      service: 'iron-requiem-remaster-server'
    });
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
