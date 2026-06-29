import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const testFiles = [
  ...readdirSync('client/tests').filter((file) => file.endsWith('.test.js')).map((file) => join('client/tests', file)),
  ...readdirSync('server/tests').filter((file) => file.endsWith('.test.js')).map((file) => join('server/tests', file))
];

const result = spawnSync(process.execPath, ['--test', ...testFiles], { stdio: 'inherit' });
process.exit(result.status ?? 1);
