import { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../GameProvider';
import { vibrate, VIBRATION_PATTERNS } from '../../../lib/utils/vibration';
import { formatTime } from '../../../lib/utils/time';
import Button from '../ui/Button';
import ProgressBar from '../ui/ProgressBar';

export default function TimerScreen() {
  const { state, dispatch } = useGame();
  const total = state.settings.timerSeconds;
  const [secondsLeft, setSecondsLeft] = useState(total);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const handleEnd = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (state.settings.vibrationEnabled) vibrate(VIBRATION_PATTERNS.timerEnd);
    dispatch({ type: 'END_TIMER' });
  }, [dispatch, state.settings.vibrationEnabled]);

  useEffect(() => {
    if (total === 0) return; // Sin timer → manual
    if (paused) return;

    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          handleEnd();
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [total, paused, handleEnd]);

  const progress = total > 0 ? (secondsLeft / total) * 100 : 100;

  const progressColor = progress > 40 ? 'white' : progress > 15 ? 'amber' : 'red';

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900">
      <div className="text-center w-full max-w-sm">
        {/* Reloj */}
        <div className={`text-8xl font-black text-white mb-6 tabular-nums ${secondsLeft <= 10 && total > 0 ? 'animate-pulse text-red-400' : ''}`}>
          {total > 0 ? formatTime(secondsLeft) : '∞'}
        </div>

        {/* Barra de progreso */}
        {total > 0 && (
          <div className="mb-8">
            <ProgressBar progress={progress} color={progressColor} />
          </div>
        )}

        {/* Mensaje */}
        <p className="text-xl text-blue-200 mb-10">
          🗣️ Discutan sobre la palabra
        </p>

        {/* Controles */}
        <div className="flex flex-col gap-3">
          {total > 0 && (
            <Button
              onClick={() => setPaused(!paused)}
              variant="ghost"
              size="md"
              fullWidth
            >
              {paused ? '▶ Reanudar' : '⏸ Pausar'}
            </Button>
          )}

          <Button onClick={handleEnd} variant="secondary" size="lg" fullWidth>
            {total > 0 ? '⏭ Terminar antes' : '✅ Pasar a votación'}
          </Button>
        </div>
      </div>
    </div>
  );
}
