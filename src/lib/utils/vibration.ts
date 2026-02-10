/** Patrones de vibración háptica para eventos del juego */
export const VIBRATION_PATTERNS = {
  roleReveal: [100, 50, 100],
  timerEnd: [200, 100, 200, 100, 200],
  voteSuccess: [50],
  impostorWin: [300, 100, 300],
  civilianWin: [100, 50, 100, 50, 100],
  tap: [30],
  error: [300],
} as const;

/**
 * Vibra el dispositivo con el patrón dado.
 * Falla silenciosamente si la API no está disponible.
 */
export function vibrate(pattern: number | number[]): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  } catch {
    // Silenciar en navegadores que bloquean vibración
  }
}
