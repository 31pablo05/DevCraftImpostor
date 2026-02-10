import { getSecureRandom } from '../utils/random';
import { shuffle } from '../utils/shuffle';
import { defaultWordPacks } from '../../data/defaultWordPacks';
import type { Player, GameSettings, WordPack } from '../types/game.types';

/**
 * Crea una nueva partida con roles asignados.
 */
export function createGame(
  settings: GameSettings,
  playerNames: string[],
  customPacks?: WordPack[]
) {
  const players: Player[] = playerNames.map((name, i) => ({
    id: `player-${i}`,
    name: name.trim() || `Jugador ${i + 1}`,
    isRevealed: false,
  }));

  const secretWord = selectRandomWord(settings.categoryId, customPacks);
  const impostorIndexes = assignImpostors(players.length, settings.impostorCount);

  return { players, secretWord, impostorIndexes };
}

/**
 * Selecciona una palabra aleatoria de la categoría indicada.
 */
export function selectRandomWord(
  categoryId: string,
  customPacks?: WordPack[]
): string {
  const allPacks = [...defaultWordPacks, ...(customPacks ?? [])];
  const pack = allPacks.find((p) => p.id === categoryId);

  if (!pack || pack.words.length === 0) {
    // Fallback: primera categoría con palabras
    const fallback = allPacks.find((p) => p.words.length > 0);
    if (!fallback) throw new Error('No hay categorías con palabras');
    const idx = getSecureRandom(0, fallback.words.length - 1);
    return fallback.words[idx];
  }

  const index = getSecureRandom(0, pack.words.length - 1);
  return pack.words[index];
}

/**
 * Asigna índices de impostores aleatoriamente.
 */
export function assignImpostors(
  playerCount: number,
  impostorCount: number
): number[] {
  const clamped = Math.min(impostorCount, playerCount - 1);
  const indexes = Array.from({ length: playerCount }, (_, i) => i);
  const shuffled = shuffle(indexes);
  return shuffled.slice(0, clamped).sort((a, b) => a - b);
}

/**
 * Obtiene el rol de un jugador específico.
 */
export function getPlayerRole(
  playerIndex: number,
  impostorIndexes: number[]
): 'impostor' | 'civilian' {
  return impostorIndexes.includes(playerIndex) ? 'impostor' : 'civilian';
}

/**
 * Valida la configuración del juego. Devuelve lista de errores (vacía = ok).
 */
export function validateSettings(
  settings: GameSettings,
  playerNames: string[]
): string[] {
  const errors: string[] = [];
  const realCount = playerNames.filter((n) => n.trim()).length;

  if (realCount < 3) errors.push('Se necesitan al menos 3 jugadores');
  if (realCount > 20) errors.push('Máximo 20 jugadores');
  if (settings.impostorCount < 1) errors.push('Mínimo 1 impostor');
  if (settings.impostorCount >= realCount)
    errors.push('Los impostores deben ser menos que los jugadores');
  if (settings.timerSeconds < 0 || settings.timerSeconds > 600)
    errors.push('Timer entre 0 y 600 segundos');

  // Nombres duplicados
  const trimmed = playerNames.map((n) => n.trim().toLowerCase()).filter(Boolean);
  const unique = new Set(trimmed);
  if (unique.size < trimmed.length)
    errors.push('No se permiten nombres duplicados');

  return errors;
}
