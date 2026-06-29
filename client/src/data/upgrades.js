import { UPGRADE_DEFS } from '../../../shared/balance.js';

export const UPGRADES = Object.entries(UPGRADE_DEFS).map(([id, value]) => ({ id, ...value }));
