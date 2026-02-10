import { useGame } from '../GameProvider';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function DiscussionScreen() {
  const { state, dispatch } = useGame();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-purple-950 to-gray-900">
      <Card className="text-center max-w-md w-full" glass>
        <div className="text-7xl mb-6">🗣️</div>

        <h1 className="text-3xl font-black text-white mb-3">
          ¡Hora de debatir!
        </h1>

        <p className="text-gray-300 mb-6 leading-relaxed">
          Discutan entre todos quién creen que es el impostor.
          Hagan preguntas, den pistas, ¡pero no revelen la palabra!
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {state.players.map((p) => (
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
