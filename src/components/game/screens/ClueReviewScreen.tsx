import React from 'react';
import { useGame } from '../GameProvider';
import Button from '../ui/Button';
import Card from '../ui/Card';
import PlayerBadge from '../ui/PlayerBadge';

export default function ClueReviewScreen() {
  const { state, dispatch } = useGame();
  const activePlayers = state.players.filter((p) => !state.eliminatedPlayerIds.includes(p.id));

  const handleContinue = () => {
    dispatch({ type: 'START_DISCUSSION' });
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      <Card className="max-w-lg w-full" glass>
        <div className="text-center mb-6">
          <div className="text-7xl mb-4">📋</div>
          <h1 className="text-3xl font-black text-white mb-2">
            Palabras Pista
          </h1>
          <p className="text-gray-300">
            Estas son las palabras que cada jugador dio como pista:
          </p>
        </div>

        {/* Lista de pistas */}
        <div className="space-y-3 mb-6">
          {activePlayers.map((player) => {
            const clue = state.clueWords[player.id];
            return (
              <div
                key={player.id}
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10"
              >
                <PlayerBadge name={player.name} size="sm" />
                <span className="text-2xl font-bold text-purple-300">
                  {clue || '???'}
                </span>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl mb-6">
          <p className="text-sm text-amber-300 text-center">
            💡 Ahora discutan quién creen que es el impostor basándose en las pistas.
          </p>
        </div>

        <Button onClick={handleContinue} variant="primary" size="lg" fullWidth>
          💬 Comenzar discusión
        </Button>
      </Card>
    </div>
  );
}
