import React, { useState, useEffect } from 'react';
import { useGame } from '../GameProvider';
import { getPlayerRole } from '../../../lib/game/gameEngine';
import { vibrate, VIBRATION_PATTERNS } from '../../../lib/utils/vibration';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';

export default function ClueGiveScreen() {
  const { state, dispatch } = useGame();
  const [clueWord, setClueWord] = useState('');
  const [revealed, setRevealed] = useState(false);

  const activePlayers = state.players.filter((p) => !state.eliminatedPlayerIds.includes(p.id));
  const currentPlayer = activePlayers[state.cluePlayerIndex];
  const currentPlayerGlobalIndex = state.players.findIndex((p) => p.id === currentPlayer.id);
  const role = getPlayerRole(currentPlayerGlobalIndex, state.impostorIndexes);
  const isImpostor = role === 'impostor';

  useEffect(() => {
    if (state.settings.vibrationEnabled) {
      vibrate([...VIBRATION_PATTERNS.roleReveal]);
    }
  }, []);

  const handleReveal = () => setRevealed(true);

  const handleSubmit = () => {
    if (!clueWord.trim()) return;

    if (state.settings.vibrationEnabled) {
      vibrate([...VIBRATION_PATTERNS.voteSuccess]);
    }

    dispatch({
      type: 'SUBMIT_CLUE',
      payload: { playerId: currentPlayer.id, word: clueWord.trim() },
    });

    dispatch({ type: 'NEXT_CLUE_PLAYER' });
  };

  const bg = isImpostor
    ? 'from-red-950 via-red-900 to-gray-900'
    : 'from-emerald-950 via-emerald-900 to-gray-900';

  return (
    <div className={`min-h-dvh flex flex-col items-center justify-center p-6 bg-gradient-to-br ${bg}`}>
      <Card className="text-center max-w-md w-full" glass>
        <p className="text-sm text-gray-400 mb-4">{currentPlayer.name}</p>

        {!revealed ? (
          <>
            <div className="text-8xl mb-6">🔒</div>
            <h2 className="text-xl text-white mb-6">
              Tu palabra está oculta. Toca para revelarla.
            </h2>
            <Button onClick={handleReveal} variant="secondary" size="lg" fullWidth>
              👁 Ver mi palabra
            </Button>
          </>
        ) : (
          <div className="animate-fade-in">
            <div className="text-7xl mb-6">
              {isImpostor ? '🎭' : '📝'}
            </div>

            {isImpostor ? (
              <>
                <h1 className="text-2xl font-black text-red-400 mb-3">
                  ¡Eres el Impostor!
                </h1>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  No conoces la palabra secreta.<br />
                  Intenta dar una palabra que parezca relacionada.
                </p>
              </>
            ) : (
              <>
                <h2 className="text-sm font-bold text-gray-400 mb-2">
                  La palabra secreta es:
                </h2>
                <p className="text-4xl font-black text-emerald-400 mb-4 break-words">
                  {state.secretWord}
                </p>
                <p className="text-gray-300 mb-6 leading-relaxed text-sm">
                  Escribe una palabra relacionada (sin revelarla directamente).
                </p>
              </>
            )}

            <div className="mb-4">
              <Input
                type="text"
                placeholder="Escribe tu pista..."
                value={clueWord}
                onChange={(e) => setClueWord(e.target.value)}
                className="text-center text-lg"
                maxLength={30}
                autoFocus
              />
            </div>

            <Button
              onClick={handleSubmit}
              variant={isImpostor ? 'danger' : 'primary'}
              size="lg"
              fullWidth
              disabled={!clueWord.trim()}
            >
              ✅ Confirmar pista
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
