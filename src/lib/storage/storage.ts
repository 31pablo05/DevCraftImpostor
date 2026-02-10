import type { WordPack } from '../types/game.types';
import { defaultWordPacks } from '../../data/defaultWordPacks';

const STORAGE_KEY = 'impostor-word-packs';
const SETTINGS_KEY = 'impostor-settings';

/* ─────────────────── Word Packs ─────────────────── */

/**
 * Obtiene todos los packs (default + custom) desde localStorage.
 */
export function getAllWordPacks(): WordPack[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const custom: WordPack[] = stored ? JSON.parse(stored) : [];
    return [...defaultWordPacks, ...custom];
  } catch {
    return [...defaultWordPacks];
  }
}

/**
 * Obtiene solo los packs personalizados.
 */
export function getCustomWordPacks(): WordPack[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Guarda un pack personalizado.
 */
export function saveCustomWordPack(pack: WordPack): void {
  const packs = getCustomWordPacks();
  const idx = packs.findIndex((p) => p.id === pack.id);
  if (idx >= 0) {
    packs[idx] = pack;
  } else {
    packs.push({ ...pack, isCustom: true });
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packs));
}

/**
 * Elimina un pack personalizado por ID.
 */
export function deleteCustomWordPack(id: string): void {
  const packs = getCustomWordPacks().filter((p) => p.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(packs));
}

/* ─────────────────── Settings ─────────────────── */

export interface PersistedSettings {
  timerSeconds: number;
  impostorCount: number;
  vibrationEnabled: boolean;
  soundEnabled: boolean;
  categoryId: string;
}

/**
 * Carga los ajustes persistidos (o los defaults).
 */
export function loadSettings(): PersistedSettings {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* fallback */ }
  return {
    timerSeconds: 120,
    impostorCount: 1,
    vibrationEnabled: true,
    soundEnabled: true,
    categoryId: 'animales',
  };
}

/**
 * Persiste los ajustes.
 */
export function saveSettings(s: PersistedSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
}
