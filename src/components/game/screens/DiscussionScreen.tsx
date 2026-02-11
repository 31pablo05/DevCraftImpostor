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
          ¡Hora de debatir!
        </h1>

        <p className="text-gray-300 mb-6 leading-relaxed">
          {state.roundNumber === 2 
            ? 'Revisen las palabras pista y discutan quién creen que es el impostor. ¡Es su última oportunidad!'
            : 'Discutan entre todos quién creen que es el impostor. Hagan preguntas, den pistas, ¡pero no revelen la palabra!'}
        </p>

        {/* Mostrar palabras pista en ronda 2 si existen */}
        {state.roundNumber === 2 && Object.keys(state.clueWords).length > 0 && (
          <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-gray-400 mb-3">Palabras pista:</p>
            <div className="space-y-2">
              {activePlayers.map((player) => {
                const clue = state.clueWords[player.id];
                if (!clue) return null;
                return (
                  <div key={player.id} className="flex justify-between items-center text-sm">
                    <span className="text-gray-300">{player.name}:</span>
                    <span className="text-purple-300 font-bold">{clue}</span>
                  </div>
                );
              })}
            </div>
          </div>
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
