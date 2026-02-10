/**
 * Formatea segundos en string MM:SS
 */
export function formatTime(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Retorna un label legible para una cantidad de segundos
 */
export function getTimerLabel(seconds: number): string {
  if (seconds === 0) return 'Sin límite';
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  if (secs === 0) return `${mins} min`;
  return `${mins}m ${secs}s`;
}
