import { useGame } from '../GameProvider';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function PassDeviceScreen() {
  const { state, dispatch } = useGame();
  const currentPlayer = state.players[state.currentPlayerIndex];
  const progress = ((state.currentPlayerIndex + 1) / state.players.length) * 100;

  const handleReady = () => {
    dispatch({ type: 'REVEAL_CURRENT_ROLE' });
  };

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      <Card className="text-center max-w-md w-full" glass>
        {/* Progreso */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Jugador {state.currentPlayerIndex + 1} de {state.players.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Icono */}
        <div className="text-7xl mb-6 animate-bounce-slow">📱</div>

        {/* Instrucción */}
        <h1 className="text-2xl font-bold text-white mb-2">
          Pasa el móvil a
        </h1>
        <p className="text-4xl font-black text-indigo-400 mb-6">
          {currentPlayer.name}
        </p>

        {/* Advertencia */}
        <div className="mb-6 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
          <p className="text-sm text-amber-300">
            ⚠️ Asegúrate de que nadie más mire la pantalla
          </p>
        </div>

        <Button onClick={handleReady} variant="primary" size="lg" fullWidth>
          ✋ Estoy listo, ver mi rol
        </Button>
      </Card>
    </div>
  );
}
