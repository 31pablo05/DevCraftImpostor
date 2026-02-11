import type { Player, VoteResult } from '../types/game.types';

/**
 * Calcula el resultado de la votación.
 * roundNumber: ronda actual (1 o 2). Máximo 2 rondas.
 * 
 * REGLAS DE ELIMINACIÓN:
 * - Solo se elimina el jugador con MAYOR cantidad de votos
 * - Si hay empate en la mayor cantidad: NO se elimina nadie y se debe repetir votación
 * - Solo se elimina un jugador por ronda
 */
export function calculateVotingResult(
  votes: Record<string, string>,
  players: Player[],
  impostorIndexes: number[],
  eliminatedPlayerIds: string[] = [],
  roundNumber: number = 1
): VoteResult {
  // Contar votos por acusado (solo jugadores activos)
  const voteCounts: Record<string, number> = {};
  Object.values(votes).forEach((accusedId) => {
    voteCounts[accusedId] = (voteCounts[accusedId] || 0) + 1;
  });

  // Encontrar el máximo de votos
  const maxVotes = Math.max(...Object.values(voteCounts), 0);
  
  // Encontrar TODOS los jugadores con el máximo de votos
  const tiedPlayerIds = Object.entries(voteCounts)
    .filter(([_, count]) => count === maxVotes)
    .map(([id]) => id);

  // Verificar si hay empate: más de un jugador con el máximo de votos
  const isTie = tiedPlayerIds.length > 1;

  // Si hay empate, no se elimina a nadie
  // Si no hay empate, se elimina al único con más votos
  const accusedId = isTie ? '' : tiedPlayerIds[0] || '';
  
  const accusedIndex = accusedId ? players.findIndex((p) => p.id === accusedId) : -1;
  const wasImpostor = accusedIndex >= 0 && impostorIndexes.includes(accusedIndex);
  
  // Si hay empate o no se elimina a nadie, los impostores NO ganan automáticamente
  const impostorsWon = !isTie && !wasImpostor;

  // Calcular jugadores activos después de esta eliminación (solo si no hay empate)
  const activePlayersCount = isTie 
    ? players.length - eliminatedPlayerIds.length 
    : players.length - eliminatedPlayerIds.length - 1;

  // El juego continúa a RONDA 2 SOLO si:
  // 1. NO hay empate (se eliminó a alguien)
  // 2. Estamos en ronda 1
  // 3. El impostor NO fue descubierto
  // 4. Quedan suficientes jugadores para continuar
  const shouldContinue = !isTie && roundNumber === 1 && impostorsWon && activePlayersCount > 2;

  return {
    accusedId,
    accusedName: accusedIndex >= 0 ? players[accusedIndex].name : 'Empate',
    voteCount: maxVotes,
    wasImpostor,
    impostorsWon,
    voteCounts,
    shouldContinue,
    activePlayersCount,
    isTie,
    tiedPlayerIds,
  };
}

/**
 * Verifica si todos los jugadores han votado.
 */
export function allPlayersVoted(
  votes: Record<string, string>,
  playerCount: number
): boolean {
  return Object.keys(votes).length >= playerCount;
}

/**
 * Verifica si hay empate en la votación.
 */
export function hasVotingTie(votes: Record<string, string>): boolean {
  const counts: Record<string, number> = {};
  Object.values(votes).forEach((id) => {
    counts[id] = (counts[id] || 0) + 1;
  });

  const values = Object.values(counts);
  if (values.length < 2) return false;

  const max = Math.max(...values);
  return values.filter((v) => v === max).length > 1;
}
