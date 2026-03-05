import React, { useEffect, useState } from 'react';
import { useGame } from '../GameProvider';
import { getPlayerRole } from '../../../lib/game/gameEngine';
import { vibrate, VIBRATION_PATTERNS } from '../../../lib/utils/vibration';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function RevealRoleScreen() {
  const { state, dispatch } = useGame();
  const [revealed, setRevealed] = useState(false);

  const activePlayers = state.players.filter((p) => !state.eliminatedPlayerIds.includes(p.id));
  const currentPlayer = activePlayers[state.currentPlayerIndex];
  const currentPlayerGlobalIndex = state.players.findIndex((p) => p.id === currentPlayer.id);
  
  const role = getPlayerRole(currentPlayerGlobalIndex, state.impostorIndexes);
  const isImpostor = role === 'impostor';

  useEffect(() => {
    if (state.settings.vibrationEnabled) {
      vibrate(VIBRATION_PATTERNS.roleReveal);
    }
  }, []);

  const handleReveal = () => setRevealed(true);

  const handleContinue = () => {
    dispatch({ type: 'NEXT_PLAYER' });
  };

  // Fondo neutro para todos los jugadores (no revelar rol por color)
  const bg = 'from-gray-950 via-indigo-950 to-gray-900';

  return (
    <div className={`min-h-dvh flex flex-col items-center justify-center p-5 bg-gradient-to-br ${bg}`}>
      <Card className="text-center max-w-md w-full" glass>
        <p className="text-sm text-gray-400 mb-4">{currentPlayer.name}</p>

        {!revealed ? (
          <>
            <div className="text-8xl mb-6">🔒</div>
            <h2 className="text-xl text-white mb-6">
              Tu rol está oculto. Toca para revelarlo.
            </h2>
            <Button onClick={handleReveal} variant="secondary" size="lg" fullWidth>
              👁 Revelar mi rol
            </Button>
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              {isImpostor ? (
                <div className="relative flex items-center justify-center">
                  <div className="absolute w-48 h-48 rounded-full bg-indigo-600/20 blur-2xl animate-pulse" />
                  <div className="absolute w-36 h-36 rounded-full bg-violet-500/15 blur-xl animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <img
                    src="/logo/impostordev2.svg"
                    alt="El Impostor"
                    className="relative w-40 h-40 object-contain animate-float animate-impostor-glow"
                    draggable={false}
                  />
                </div>
              ) : (
                <span className="text-8xl">✅</span>
              )}
            </div>

            {isImpostor ? (
              <>
                <h1 className="text-3xl font-black tracking-tight mb-1" style={{ background: 'linear-gradient(135deg, #a78bfa, #6366f1, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ¡Eres el Impostor!
                </h1>
                <p className="text-sm font-semibold text-violet-400 uppercase tracking-widest mb-4">
                  Mantén la calma 🎭
                </p>
                <p className="text-gray-400 mb-8 leading-relaxed text-sm sm:text-base">
                  No conoces la palabra secreta.<br />
                  Intenta averiguarla sin que te descubran.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-lg font-bold text-gray-300 mb-2">
                  La palabra secreta es:
                </h2>
                <p className="text-5xl font-black text-indigo-400 mb-4 break-words">
                  {state.secretWord}
                </p>
                <p className="text-gray-400 mb-8 leading-relaxed">
                  Habla de ella sin revelarla directamente.<br />
                  Encuentra al impostor.
                </p>
              </>
            )}

            <Button
              onClick={handleContinue}
              variant="primary"
              size="lg"
              fullWidth
            >
              Ocultar y continuar →
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
