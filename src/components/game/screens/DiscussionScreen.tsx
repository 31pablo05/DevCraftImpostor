import React from 'react';
import { useGame } from '../GameProvider';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function DiscussionScreen() {
  const { state, dispatch } = useGame();
  const activePlayers = state.players.filter((p) => !state.eliminatedPlayerIds.includes(p.id));

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      <Card className="text-center max-w-md w-full" glass>
        {state.roundNumber > 1 && (
          <div className="mb-4 p-2 bg-white/10 rounded-lg">
            <p className="text-sm text-gray-300">
              🔄 Ronda {state.roundNumber} ({state.roundNumber === 1 ? 'Primera oportunidad' : 'Última oportunidad'})
            </p>
            {activePlayers.length} jugadores activos
          </div>
        )}

        <div className="text-7xl mb-6">🗣️</div>

        <h1 className="text-3xl font-black text-white mb-3">
          {state.roundNumber === 2 ? '¡Última oportunidad!' : '¡Hora de debatir!'}
        </h1>

        {state.roundNumber === 2 ? (
          <>
            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl">
              <p className="text-sm text-amber-300 mb-3">
                <strong>INSTRUCCIONES RONDA 2:</strong>
              </p>
              <ol className="text-left text-sm text-gray-300 space-y-2">
                <li>1. Cada jugador debe decir <strong>oralmente</strong> una palabra pista relacionada con la palabra secreta.</li>
                <li>2. El impostor debe inventar una pista convincente.</li>
                <li>3. Después de escuchar todas las pistas, discutan quién es el impostor.</li>
              </ol>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Cuando todos hayan dado su pista y estén listos, pasen a la votación final.
            </p>
          </>
        ) : (
          <p className="text-gray-300 mb-6 leading-relaxed">
            Discutan entre todos quién creen que es el impostor. Hagan preguntas, den pistas, ¡pero no revelen la palabra!
          </p>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {activePlayers.map((p) => (
            <span
              key={p.id}
              className="px-3 py-1.5 bg-white/10 rounded-full text-sm text-gray-300"
            >
              {p.name}
            </span>
          ))}
        </div>

        <Button
          onClick={() => dispatch({ type: 'START_VOTING' })}
          variant="danger"
          size="lg"
          fullWidth
        >
          🗳️ Pasar a votación
        </Button>
      </Card>
    </div>
  );
}
