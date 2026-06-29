import { spawnSync } from 'node:child_process';

function run(command, args) {
  const result = spawnSync(command, args, { stdio: 'inherit', shell: process.platform === 'win32' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const npmCommand = process.env.npm_execpath || 'npm';
const baseArgs = process.env.npm_execpath ? [] : [];
const command = process.env.npm_execpath ? process.execPath : npmCommand;

run(command, [...baseArgs, ...(process.env.npm_execpath ? [npmCommand] : []), 'install', '--prefix', 'client']);
run(command, [...baseArgs, ...(process.env.npm_execpath ? [npmCommand] : []), 'install', '--prefix', 'server']);
