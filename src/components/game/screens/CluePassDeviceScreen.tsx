import React from 'react';
import { useGame } from '../GameProvider';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function CluePassDeviceScreen() {
  const { state, dispatch } = useGame();
  const activePlayers = state.players.filter((p) => !state.eliminatedPlayerIds.includes(p.id));
  const currentPlayer = activePlayers[state.cluePlayerIndex];
  const progress = ((state.cluePlayerIndex + 1) / activePlayers.length) * 100;

  const goToClueGive = () => {
    dispatch({ type: 'START_CLUE_GIVE' });
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-amber-950 to-gray-900">
      <Card className="text-center max-w-md w-full" glass>
        <div className="mb-4 p-2 bg-white/10 rounded-lg">
          <p className="text-sm text-gray-300">
            🔄 Ronda 2: Palabras Pista
          </p>
        </div>

        {/* Progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Jugador {state.cluePlayerIndex + 1} de {activePlayers.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Icono */}
        <div className="text-7xl mb-6">💭</div>

        {/* Instrucción */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Pasa el móvil a
        </h1>
        <p className="text-4xl font-black text-amber-400 mb-6">
          {currentPlayer.name}
        </p>

        <p className="text-gray-300 mb-6">
          Deberás decir una palabra relacionada con la palabra secreta (si la conoces).
        </p>

        {/* Advertencia */}
        <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="text-sm text-amber-300">
            ⚠️ Nadie más debe mirar la pantalla
          </p>
        </div>

        <Button onClick={goToClueGive} variant="primary" size="lg" fullWidth>
          ✋ Estoy listo, dar mi pista
        </Button>
      </Card>
    </div>
  );
}
