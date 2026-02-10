import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

/**
 * Hook para manejar la instalación de la PWA.
 * Captura el evento beforeinstallprompt y expone un método para instalar.
 * En iOS/Safari muestra instrucciones manuales.
 */
export function useInstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // Detectar si ya está instalada
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // Detectar iOS
    const ua = window.navigator.userAgent;
    const isiOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    setIsIOS(isiOS);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Detectar instalación exitosa
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = useCallback(async () => {
    // En iOS, mostrar guía manual
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    if (!deferredPrompt) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
    } catch {
      // usuario canceló o error
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  }, [deferredPrompt, isIOS]);

  return {
    canInstall: (!isInstalled && !!deferredPrompt) || (!isInstalled && isIOS),
    isInstalled,
    isInstalling,
    isIOS,
    showIOSGuide,
    setShowIOSGuide,
    install,
  };
}
