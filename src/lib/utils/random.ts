/**
 * Genera un número aleatorio seguro usando la Web Crypto API.
 * @param min - Valor mínimo (inclusivo)
 * @param max - Valor máximo (inclusivo)
 */
export function getSecureRandom(min: number, max: number): number {
  const range = max - min + 1;
  if (range <= 0) return min;

  const bytesNeeded = Math.ceil(Math.log2(range) / 8) || 1;
  const maxValue = Math.pow(256, bytesNeeded);
  const randomBytes = new Uint8Array(bytesNeeded);

  let randomValue: number;
  do {
    crypto.getRandomValues(randomBytes);
    randomValue = 0;
    for (let i = 0; i < bytesNeeded; i++) {
      randomValue = (randomValue << 8) + randomBytes[i];
    }
  } while (randomValue >= maxValue - (maxValue % range));

  return min + (randomValue % range);
}
