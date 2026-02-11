import React, { useState } from 'react';
import { useGame } from '../GameProvider';
import { vibrate, VIBRATION_PATTERNS } from '../../../lib/utils/vibration';
import Button from '../ui/Button';
import Card from '../ui/Card';
import PlayerBadge from '../ui/PlayerBadge';

export default function VotingScreen() {
  const { state, dispatch } = useGame();
  const [currentVoterIdx, setCurrentVoterIdx] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPassDevice, setShowPassDevice] = useState(true);

  // Filtrar jugadores activos (no eliminados)
  const activePlayers = state.players.filter((p) => !state.eliminatedPlayerIds.includes(p.id));
  const voter = activePlayers[currentVoterIdx];
  const totalVotes = Object.keys(state.votes).length;

  const handleVote = () => {
    if (!selectedId) return;

    if (state.settings.vibrationEnabled) {
      vibrate(VIBRATION_PATTERNS.voteSuccess);
    }

    dispatch({
      type: 'CAST_VOTE',
      payload: { voterId: voter.id, accusedId: selectedId },
    });

    if (currentVoterIdx < activePlayers.length - 1) {
      setCurrentVoterIdx((i) => i + 1);
      setSelectedId(null);
      setShowPassDevice(true);
    } else {
      dispatch({ type: 'SHOW_RESULTS' });
    }
  };

  // Pantalla intermedia: pasa el dispositivo
  if (showPassDevice) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-red-950 to-gray-900">
        <Card className="text-center max-w-md w-full" glass>
          {state.roundNumber > 1 && (
            <div className="mb-3 p-2 bg-white/10 rounded-lg">
              <p className="text-xs text-gray-300">
                🔄 Ronda {state.roundNumber} | {activePlayers.length} jugadores activos
              </p>
            </div>
          )}

          <div className="text-6xl mb-4">🗳️</div>
          <p className="text-gray-400 text-sm mb-2">
            Voto {totalVotes + 1} de {activePlayers.length}
          </p>
          <h2 className="text-2xl font-bold text-white mb-2">Pasa el móvil a</h2>
          <p className="text-4xl font-black text-red-400 mb-6">{voter.name}</p>

          <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
            <p className="text-sm text-amber-300">⚠️ Asegúrate de que nadie más mire</p>
          </div>

          <Button
            onClick={() => setShowPassDevice(false)}
            variant="danger"
            size="lg"
            fullWidth
          >
            Estoy listo para votar
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-dvh p-4 bg-gradient-to-br from-gray-900 via-red-950 to-gray-900">
      <div className="max-w-lg mx-auto py-6">
        <Card>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold text-white">🗳️ Votación</h2>
              {state.roundNumber > 1 && (
                <p className="text-xs text-gray-400 mt-1">Ronda {state.roundNumber}</p>
              )}
            </div>
            <span className="text-sm text-gray-400">{totalVotes + 1}/{activePlayers.length}</span>
          </div>

          <p className="text-gray-300 mb-6">
            <strong className="text-white">{voter.name}</strong>, ¿quién crees que es el impostor?
          </p>

          {/* Grid de jugadores */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {activePlayers
              .filter((p) => p.id !== voter.id)
              .map((player) => (
                <button
                  key={player.id}
                  onClick={() => setSelectedId(player.id)}
                  className={`
                    p-4 rounded-xl border-2 transition-all duration-150
                    ${selectedId === player.id
                      ? 'border-red-500 bg-red-500/15 scale-[1.02]'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-500'}
                  `}
                >
                  <PlayerBadge name={player.name} selected={selectedId === player.id} />
                </button>
              ))}
          </div>

          <Button
            onClick={handleVote}
            variant="danger"
            size="lg"
            fullWidth
            disabled={!selectedId}
          >
            ✅ Confirmar voto
          </Button>
        </Card>
      </div>
    </div>
  );
}
