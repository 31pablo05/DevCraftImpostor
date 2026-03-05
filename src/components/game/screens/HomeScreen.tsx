import React from 'react';
import { useGame } from '../GameProvider';
import Button from '../ui/Button';
import { useInstallPWA } from '../../../hooks/useInstallPWA';

export default function HomeScreen() {
  const { dispatch } = useGame();
  const { canInstall, isInstalled, isInstalling, isIOS, showIOSGuide, setShowIOSGuide, install } = useInstallPWA();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-6 py-8 px-6 overflow-y-auto">
      {/* Título */}
      <div className="text-center animate-fade-in flex flex-col items-center flex-shrink-0">
        <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-2">
          El Impostor
        </h1>
        <p className="text-base sm:text-lg font-medium text-indigo-300 tracking-wide">
          ¿Podrás descubrir quién miente?
        </p>
      </div>

      {/* Acciones principales */}
      <div className="w-full max-w-xs flex flex-col gap-3 animate-fade-in flex-shrink-0">
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

        {/* Botón instalar PWA */}
        {canInstall && (
          <button
            onClick={install}
            disabled={isInstalling}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3.5 px-6 rounded-xl text-base shadow-lg shadow-green-500/25 hover:from-green-700 hover:to-emerald-700 active:scale-95 transition-all disabled:opacity-50 animate-pulse"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 3v12m0 0l-4-4m4 4l4-4" />
            </svg>
            {isInstalling ? 'Instalando...' : '📲 Instalar en mi celular'}
          </button>
        )}

        {isInstalled && (
          <div className="w-full flex items-center justify-center gap-2 text-green-400 text-sm py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            App instalada
          </div>
        )}
      </div>

      {/* Guía iOS */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6" onClick={() => setShowIOSGuide(false)}>
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm w-full text-center" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-white mb-4">Instalar en iPhone/iPad</h3>
            <div className="flex flex-col gap-4 text-left text-sm text-gray-300">
              <div className="flex items-start gap-3">
                <span className="bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <p>Tocá el botón <strong className="text-white">Compartir</strong> (el ícono con la flecha hacia arriba ↑) en la barra de Safari</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <p>Buscá y tocá <strong className="text-white">"Agregar a pantalla de inicio"</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="bg-indigo-600 text-white w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <p>Tocá <strong className="text-white">"Agregar"</strong> y ¡listo! La app aparecerá en tu pantalla de inicio.</p>
              </div>
            </div>
            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-6 w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl active:scale-95 transition-all"
            >
              ¡Entendido!
            </button>
          </div>
        </div>
      )}

      {/* Footer con marca */}
      <div className="flex flex-col items-center gap-3 pt-2 flex-shrink-0">
        <p className="text-xs text-gray-500">
          100% offline · Sin cuentas · Un solo dispositivo
        </p>
        <a
          href="https://devcraftpablo.online/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-full py-2 px-4 hover:bg-white/10 hover:border-indigo-500/30 transition-all group"
        >
          <img
            src="/logo/devcraft-logo.png"
            alt="DevCraft"
            className="w-6 h-6 rounded-full object-cover ring-1 ring-white/20 group-hover:ring-indigo-400/50 transition-all"
          />
          <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
            Más proyectos en <span className="font-semibold text-indigo-400 group-hover:text-indigo-300">devcraftpablo.online</span>
          </span>
        </a>
      </div>
    </div>
  );
}
