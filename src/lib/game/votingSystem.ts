import type { Player, VoteResult } from '../types/game.types';

/**
 * Calcula el resultado de la votación.
 * roundNumber: ronda actual (1 o 2). Máximo 2 rondas.
 */
export function calculateVotingResult(
  votes: Record<string, string>,
  players: Player[],
  impostorIndexes: number[],
  eliminatedPlayerIds: string[] = [],
  roundNumber: number = 1
): VoteResult {
  // Contar votos por acusado
  const voteCounts: Record<string, number> = {};
  Object.values(votes).forEach((accusedId) => {
    voteCounts[accusedId] = (voteCounts[accusedId] || 0) + 1;
  });

  // Encontrar el más votado (en caso de empate, el primero encontrado)
  let maxVotes = 0;
  let accusedId = '';

  Object.entries(voteCounts).forEach(([id, count]) => {
    if (count > maxVotes) {
      maxVotes = count;
      accusedId = id;
    }
  });

  const accusedIndex = players.findIndex((p) => p.id === accusedId);
  const wasImpostor = impostorIndexes.includes(accusedIndex);
  const impostorsWon = !wasImpostor;

  // Calcular jugadores activos después de esta eliminación
  const activePlayersCount = players.length - eliminatedPlayerIds.length - 1;

  // El juego continúa SOLO si:
  // 1. Estamos en ronda 1 (máximo 2 intentos)
  // 2. El impostor NO fue descubierto
  // 3. Quedan más de 2 jugadores activos
  const shouldContinue = roundNumber === 1 && impostorsWon && activePlayersCount > 2;

  return {
    accusedId,
    accusedName: players[accusedIndex]?.name ?? 'Desconocido',
    voteCount: maxVotes,
    wasImpostor,
    impostorsWon,
    voteCounts,
    shouldContinue,
    activePlayersCount,
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
