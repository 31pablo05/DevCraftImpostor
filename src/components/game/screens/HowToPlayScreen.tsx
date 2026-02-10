import { useGame } from '../GameProvider';
import Button from '../ui/Button';
import Card from '../ui/Card';

const steps = [
  {
    emoji: '👥',
    title: 'Reunir jugadores',
    description: 'Necesitas al menos 3 personas. Un solo dispositivo para todos.',
  },
  {
    emoji: '⚙️',
    title: 'Configurar partida',
    description: 'Elige cantidad de jugadores, impostores, categoría de palabras y tiempo.',
  },
  {
    emoji: '📱',
    title: 'Revelar roles',
    description:
      'El dispositivo se pasa de jugador en jugador. Cada uno ve su rol en privado.',
  },
  {
    emoji: '🎭',
    title: 'El impostor',
    description:
      'El impostor NO conoce la palabra secreta. Debe actuar como si la supiera.',
  },
  {
    emoji: '✅',
    title: 'Los civiles',
    description:
      'Los civiles SÍ conocen la palabra. Deben hablar de ella sin decirla directamente.',
  },
  {
    emoji: '🗣️',
    title: 'Discusión',
    description:
      'Todos discuten por turnos. Hagan preguntas, den pistas, intenten descubrir al impostor.',
  },
  {
    emoji: '🗳️',
    title: 'Votación',
    description:
      'Cada jugador vota en secreto a quién cree que es el impostor.',
  },
  {
    emoji: '🏆',
    title: 'Resultado',
    description:
      'Si los civiles votan al impostor, ¡ganan! Si votan a un civil, gana el impostor.',
  },
];

export default function HowToPlayScreen() {
  const { dispatch } = useGame();

  return (
    <div className="min-h-dvh bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 p-4">
      <div className="max-w-lg mx-auto py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => dispatch({ type: 'GO_HOME' })}
            className="text-2xl text-gray-400 hover:text-white transition-colors p-2"
          >
            ←
          </button>
          <img src="/logo/logoimpostor1.svg" alt="El Impostor" className="w-8 h-8 rounded-lg" />
          <h1 className="text-2xl font-bold text-white">Cómo jugar</h1>
        </div>

        {/* Pasos */}
        <div className="space-y-3">
          {steps.map((step, i) => (
            <Card key={i} padding="sm">
              <div className="flex gap-4 items-start">
                <div className="text-3xl flex-shrink-0">{step.emoji}</div>
                <div>
                  <h3 className="font-semibold text-white text-sm mb-1">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Tips */}
        <Card className="mt-6">
          <h3 className="text-lg font-semibold text-white mb-3">💡 Consejos</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>• El impostor puede ganar si descubre la palabra y la dice.</li>
            <li>• Civiles: no sean demasiado obvios con las pistas.</li>
            <li>• Hagan preguntas indirectas para descubrir quién finge.</li>
            <li>• Observen el lenguaje corporal de los demás.</li>
          </ul>
        </Card>

        <div className="mt-6">
          <Button
            onClick={() => dispatch({ type: 'START_SETUP' })}
            variant="primary"
            size="lg"
            fullWidth
          >
            🚀 ¡Jugar ahora!
          </Button>
        </div>
      </div>
    </div>
  );
}
