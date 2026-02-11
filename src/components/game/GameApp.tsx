import React from 'react';
import GameProvider from './GameProvider';
import ScreenRouter from './ScreenRouter';

export default function GameApp() {
  return (
    <GameProvider>
      <ScreenRouter />
    </GameProvider>
  );
}
