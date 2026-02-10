import { useEffect, useMemo } from 'react';
import { useGame } from '../GameProvider';
import { calculateVotingResult } from '../../../lib/game/votingSystem';
import { createGame } from '../../../lib/game/gameEngine';
import { vibrate, VIBRATION_PATTERNS } from '../../../lib/utils/vibration';
import { getAllWordPacks } from '../../../lib/storage/storage';
import Button from '../ui/Button';
import Card from '../ui/Card';
import PlayerBadge from '../ui/PlayerBadge';
import type { WordPack } from '../../../lib/types/game.types';

export default function ResultsScreen() {
  const { state, dispatch } = useGame();

  const result = useMemo(
    () => calculateVotingResult(state.votes, state.players, state.impostorIndexes),
    [state.votes, state.players, state.impostorIndexes]
  );

  const impostorNames = state.impostorIndexes.map((i) => state.players[i]?.name).filter(Boolean);

  useEffect(() => {
    if (state.settings.vibrationEnabled) {
      vibrate(result.impostorsWon ? VIBRATION_PATTERNS.impostorWin : VIBRATION_PATTERNS.civilianWin);
    }
  }, []);

  const handlePlayAgain = () => {
    const packs = getAllWordPacks();
    const customPacks: WordPack[] = packs.filter((p) => p.isCustom);
    const playerNames = state.players.map((p) => p.name);

    const { players, secretWord, impostorIndexes } = createGame(
      state.settings,
      playerNames,
      customPacks
    );

    dispatch({
      type: 'RESTART_GAME',
      payload: { secretWord, impostorIndexes },
    });
  };

  const handleNewGame = () => {
    dispatch({ type: 'NEW_GAME' });
  };

  const handleGoHome = () => {
    dispatch({ type: 'GO_HOME' });
  };

  // Vote breakdown sorted by count
  const voteBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    Object.values(state.votes).forEach((id) => {
      counts[id] = (counts[id] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([id, count]) => ({
        name: state.players.find((p) => p.id === id)?.name ?? '?',
        count,
        isImpostor: state.impostorIndexes.includes(state.players.findIndex((p) => p.id === id)),
      }))
      .sort((a, b) => b.count - a.count);
  }, [state.votes, state.players, state.impostorIndexes]);

  return (
    <div
      className={`min-h-dvh p-4 bg-gradient-to-br ${
        result.impostorsWon
          ? 'from-red-950 via-red-900 to-gray-900'
          : 'from-emerald-950 via-emerald-900 to-gray-900'
      }`}
    >
      <div className="max-w-lg mx-auto py-8 space-y-5">
        {/* Resultado principal */}
        <Card className="text-center" glass>
          <div className="text-8xl mb-4">
            {result.impostorsWon ? '🎭' : '🎉'}
          </div>

          <h1
            className={`text-3xl font-black mb-2 ${
              result.impostorsWon ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            {result.impostorsWon
              ? '¡Ganó el Impostor!'
              : '¡Ganaron los Civiles!'}
          </h1>

          <p className="text-gray-300 mb-6">
            {result.impostorsWon
              ? `Eliminaron a ${result.accusedName} que era inocente.`
              : `Descubrieron a ${result.accusedName} como impostor.`}
          </p>

          {/* Palabra secreta */}
          <div className="p-4 bg-white/5 rounded-xl mb-4">
            <p className="text-sm text-gray-400 mb-1">La palabra secreta era:</p>
            <p className="text-3xl font-black text-indigo-400">{state.secretWord}</p>
          </div>

          {/* Impostores */}
          <div className="p-4 bg-white/5 rounded-xl">
            <p className="text-sm text-gray-400 mb-2">
              {impostorNames.length > 1 ? 'Los impostores eran:' : 'El impostor era:'}
            </p>
            <div className="flex justify-center gap-3 flex-wrap">
              {impostorNames.map((name) => (
                <span key={name} className="text-lg font-bold text-red-400">
                  🎭 {name}
                </span>
              ))}
            </div>
          </div>
        </Card>

        {/* Desglose de votos */}
        <Card>
          <h3 className="text-lg font-semibold text-white mb-3">📊 Votos</h3>
          <div className="space-y-2">
            {voteBreakdown.map((entry) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PlayerBadge name={entry.name} size="sm" />
                  {entry.isImpostor && (
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                      Impostor
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${entry.isImpostor ? 'bg-emerald-500' : 'bg-red-500'}`}
                      style={{ width: `${(entry.count / state.players.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm text-gray-400 w-8 text-right">{entry.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Acciones */}
        <div className="flex flex-col gap-3">
          <Button onClick={handlePlayAgain} variant="primary" size="lg" fullWidth>
            🔄 Jugar otra vez (mismos jugadores)
          </Button>
          <Button onClick={handleNewGame} variant="secondary" size="md" fullWidth>
            ⚙️ Nueva configuración
          </Button>
          <Button onClick={handleGoHome} variant="ghost" size="md" fullWidth>
            🏠 Volver al inicio
          </Button>
        </div>
      </div>
    </div>
  );
}
