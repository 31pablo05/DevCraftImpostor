import React from 'react';
import { useGame } from './GameProvider';
import HomeScreen from './screens/HomeScreen';
import SetupScreen from './screens/SetupScreen';
import PassDeviceScreen from './screens/PassDeviceScreen';
import RevealRoleScreen from './screens/RevealRoleScreen';
import TimerScreen from './screens/TimerScreen';
import DiscussionScreen from './screens/DiscussionScreen';
import VotingScreen from './screens/VotingScreen';
import ResultsScreen from './screens/ResultsScreen';
import HowToPlayScreen from './screens/HowToPlayScreen';
import WordPacksScreen from './screens/WordPacksScreen';

const screenMap: Record<string, React.FC> = {
  HOME: HomeScreen,
  SETUP: SetupScreen,
  PASS_DEVICE: PassDeviceScreen,
  REVEAL_ROLE: RevealRoleScreen,
  TIMER: TimerScreen,
  DISCUSSION: DiscussionScreen,
  VOTING: VotingScreen,
  RESULTS: ResultsScreen,
  HOW_TO_PLAY: HowToPlayScreen,
  WORD_PACKS: WordPacksScreen,
};

export default function ScreenRouter() {
  const { state } = useGame();
  const Screen = screenMap[state.phase] ?? HomeScreen;
  return (
    <div className="relative min-h-dvh">
      {/* Fondo global del juego */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none select-none bg-gray-900" 
        aria-hidden="true"
        style={{
          backgroundImage: 'url(/logo/impostormobile3.svg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.2
        }}
      />
      {/* Pantalla activa */}
      <div className="relative z-10">
        <Screen />
      </div>
    </div>
  );
}
