import { useState, useEffect } from 'react';
import { useGame } from '../GameProvider';
import { createGame, validateSettings } from '../../../lib/game/gameEngine';
import { getAllWordPacks } from '../../../lib/storage/storage';
import { vibrate, VIBRATION_PATTERNS } from '../../../lib/utils/vibration';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Toast from '../ui/Toast';
import type { WordPack } from '../../../lib/types/game.types';

export default function SetupScreen() {
  const { state, dispatch } = useGame();
  const [playerNames, setPlayerNames] = useState<string[]>(
    Array.from({ length: state.settings.playerCount }, (_, i) => `Jugador ${i + 1}`)
  );
  const [errors, setErrors] = useState<string[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [packs, setPacks] = useState<WordPack[]>([]);

  useEffect(() => {
    setPacks(getAllWordPacks());
  }, []);

  /* Sincronizar cantidad de inputs cuando cambia playerCount */
  const handlePlayerCountChange = (count: number) => {
    const clamped = Math.max(3, Math.min(20, count));
    dispatch({ type: 'UPDATE_SETTINGS', payload: { playerCount: clamped } });

    setPlayerNames((prev) => {
      if (clamped > prev.length) {
        return [
          ...prev,
          ...Array.from({ length: clamped - prev.length }, (_, i) => `Jugador ${prev.length + i + 1}`),
        ];
      }
      return prev.slice(0, clamped);
    });
  };

  const handleNameChange = (index: number, name: string) => {
    setPlayerNames((prev) => {
      const copy = [...prev];
      copy[index] = name;
      return copy;
    });
  };

  const handleStart = () => {
    const validationErrors = validateSettings(state.settings, playerNames);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      vibrate(VIBRATION_PATTERNS.error);
      return;
    }
    setErrors([]);

    try {
      const { players, secretWord, impostorIndexes } = createGame(
        state.settings,
        playerNames,
        packs.filter((p) => p.isCustom)
      );

      dispatch({
        type: 'START_GAME',
        payload: { players, secretWord, impostorIndexes },
      });
    } catch (e) {
      setToast(e instanceof Error ? e.message : 'Error al crear partida');
    }
  };

  const timerOptions = [0, 60, 90, 120, 180, 300];
  const selectedPack = packs.find((p) => p.id === state.settings.categoryId);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-gray-900 via-gray-900 to-indigo-950 p-4 pb-32">
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
          <h1 className="text-2xl font-bold text-white">Nueva partida</h1>
        </div>

        {/* Errores */}
        {errors.length > 0 && (
          <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
            {errors.map((e, i) => (
              <p key={i} className="text-red-400 text-sm">⚠ {e}</p>
            ))}
          </div>
        )}

        {/* Configuración rápida */}
        <Card className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-4">⚙️ Configuración</h2>

          {/* Número de jugadores */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">
              Jugadores: <strong className="text-white">{state.settings.playerCount}</strong>
            </label>
            <input
              type="range"
              min={3}
              max={20}
              value={state.settings.playerCount}
              onChange={(e) => handlePlayerCountChange(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>3</span><span>20</span>
            </div>
          </div>

          {/* Impostores */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">
              Impostores: <strong className="text-white">{state.settings.impostorCount}</strong>
            </label>
            <input
              type="range"
              min={1}
              max={Math.max(1, state.settings.playerCount - 2)}
              value={state.settings.impostorCount}
              onChange={(e) =>
                dispatch({ type: 'UPDATE_SETTINGS', payload: { impostorCount: Number(e.target.value) } })
              }
              className="w-full accent-red-500"
            />
          </div>

          {/* Timer */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">⏱ Tiempo de discusión</label>
            <div className="flex flex-wrap gap-2">
              {timerOptions.map((s) => (
                <button
                  key={s}
                  onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { timerSeconds: s } })}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${state.settings.timerSeconds === s
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                  `}
                >
                  {s === 0 ? '∞' : s < 60 ? `${s}s` : `${s / 60}m`}
                </button>
              ))}
            </div>
          </div>

          {/* Categoría */}
          <div className="mb-5">
            <label className="block text-sm text-gray-300 mb-2">📦 Categoría</label>
            <div className="flex flex-wrap gap-2">
              {packs.map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => dispatch({ type: 'UPDATE_SETTINGS', payload: { categoryId: pack.id } })}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1
                    ${state.settings.categoryId === pack.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}
                  `}
                >
                  <span>{pack.emoji}</span>
                  <span>{pack.name}</span>
                </button>
              ))}
            </div>
            {selectedPack && (
              <p className="text-xs text-gray-500 mt-2">
                {selectedPack.words.length} palabras disponibles
              </p>
            )}
          </div>

          {/* Vibración */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={state.settings.vibrationEnabled}
                onChange={(e) =>
                  dispatch({ type: 'UPDATE_SETTINGS', payload: { vibrationEnabled: e.target.checked } })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 rounded-full peer-checked:bg-indigo-600 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full peer-checked:translate-x-5 transition-transform" />
            </div>
            <span className="text-sm text-gray-300">📳 Vibración háptica</span>
          </label>
        </Card>

        {/* Nombres de jugadores */}
        <Card className="mb-4">
          <h2 className="text-lg font-semibold text-white mb-4">👥 Jugadores</h2>
          <div className="space-y-3">
            {playerNames.map((name, i) => (
              <Input
                key={i}
                value={name}
                onChange={(e) => handleNameChange(i, e.target.value)}
                placeholder={`Jugador ${i + 1}`}
                maxLength={20}
              />
            ))}
          </div>
        </Card>

        {/* Botón iniciar */}
        <Button onClick={handleStart} variant="primary" size="lg" fullWidth>
          🎮 Iniciar partida
        </Button>
      </div>

      {toast && <Toast message={toast} type="error" onClose={() => setToast(null)} />}
    </div>
  );
}
