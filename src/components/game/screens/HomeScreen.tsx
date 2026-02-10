import { useGame } from '../GameProvider';
import Button from '../ui/Button';

export default function HomeScreen() {
  const { dispatch } = useGame();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      {/* Logo / Título */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="text-8xl mb-6 drop-shadow-2xl">🎭</div>
        <h1 className="text-5xl font-black text-white tracking-tight mb-3">
          El Impostor
        </h1>
        <p className="text-lg text-indigo-300">
          ¿Podrás descubrir quién miente?
        </p>
      </div>

      {/* Acciones principales */}
      <div className="w-full max-w-xs flex flex-col gap-4 animate-fade-in">
        <Button
          onClick={() => dispatch({ type: 'START_SETUP' })}
          variant="primary"
          size="lg"
          fullWidth
        >
          🚀 Nueva partida
        </Button>

        <Button
          onClick={() => dispatch({ type: 'SHOW_HOW_TO_PLAY' })}
          variant="secondary"
          size="lg"
          fullWidth
        >
          📖 Cómo jugar
        </Button>

        <Button
          onClick={() => dispatch({ type: 'SHOW_WORD_PACKS' })}
          variant="ghost"
          size="md"
          fullWidth
        >
          📦 Categorías de palabras
        </Button>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 text-xs text-gray-500">
        100% offline · Sin cuentas · Un solo dispositivo
      </p>
    </div>
  );
}
