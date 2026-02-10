import { getSecureRandom } from './random';

/**
 * Fisher-Yates shuffle con RNG criptográficamente seguro.
 * Devuelve una copia barajada del array original (inmutable).
 */
export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = getSecureRandom(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
