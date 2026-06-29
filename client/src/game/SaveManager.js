import { SAVE_KEY } from '../../../shared/constants.js';
import { createSaveTemplate, normalizeSave } from '../../../shared/saveSchema.js';

export function createMemoryStorage(seed = {}) {
  const data = new Map(Object.entries(seed));
  return {
    getItem(key) {
      return data.has(key) ? data.get(key) : null;
    },
    setItem(key, value) {
      data.set(key, String(value));
    },
    removeItem(key) {
      data.delete(key);
    }
  };
}

function resolveStorage(storage) {
  if (storage) return storage;
  if (typeof window !== 'undefined' && window.localStorage) return window.localStorage;
  return createMemoryStorage();
}

export function loadGame(storage) {
  const target = resolveStorage(storage);
  try {
    const raw = target.getItem(SAVE_KEY);
    if (!raw) return normalizeSave(createSaveTemplate());
    return normalizeSave(JSON.parse(raw));
  } catch {
    return normalizeSave(createSaveTemplate());
  }
}

export function saveGame(state, storage) {
  const target = resolveStorage(storage);
  try {
    target.setItem(SAVE_KEY, JSON.stringify(normalizeSave(state)));
    return true;
  } catch {
    return false;
  }
}

export function resetSave(storage) {
  const target = resolveStorage(storage);
  target.removeItem(SAVE_KEY);
  return normalizeSave(createSaveTemplate());
}
