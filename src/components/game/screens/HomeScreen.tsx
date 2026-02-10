import { useGame } from '../GameProvider';
import Button from '../ui/Button';
import Logo from '../ui/Logo';
import { useInstallPWA } from '../../../hooks/useInstallPWA';

export default function HomeScreen() {
  const { dispatch } = useGame();
  const { canInstall, isInstalled, isInstalling, install } = useInstallPWA();

  return (
    <div className="min-h-dvh flex flex-col items-center justify-between py-10 px-6 bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900">
      {/* Logo / Título */}
      <div className="text-center animate-fade-in flex flex-col items-center">
        <Logo size="hero" className="mb-3" />
        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-2">
          El Impostor
        </h1>
        <p className="text-base sm:text-lg text-indigo-300">
          ¿Podrás descubrir quién miente?
        </p>
      </div>

      {/* Acciones principales */}
      <div className="w-full max-w-xs flex flex-col gap-3 animate-fade-in">
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

      {/* Footer con marca */}
      <div className="flex flex-col items-center gap-3 pt-4">
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
