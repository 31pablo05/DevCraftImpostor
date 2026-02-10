import type { Player, VoteResult } from '../types/game.types';

/**
 * Calcula el resultado de la votación.
 */
export function calculateVotingResult(
  votes: Record<string, string>,
  players: Player[],
  impostorIndexes: number[]
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

  return {
    accusedId,
    accusedName: players[accusedIndex]?.name ?? 'Desconocido',
    voteCount: maxVotes,
    wasImpostor,
    impostorsWon,
    voteCounts,
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
