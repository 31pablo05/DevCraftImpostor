/** Fases del juego */
export type GamePhase =
  | 'HOME'
  | 'SETUP'
  | 'PASS_DEVICE'
  | 'REVEAL_ROLE'
  | 'TIMER'
  | 'DISCUSSION'
  | 'VOTING'
  | 'RESULTS'
  | 'HOW_TO_PLAY'
  | 'WORD_PACKS'
  | 'CLUE_PASS_DEVICE'
  | 'CLUE_GIVE'
  | 'CLUE_REVIEW';

/** Jugador */
export interface Player {
  id: string;
  name: string;
  isRevealed: boolean;
}

/** Configuración de la partida */
export interface GameSettings {
  playerCount: number;       // 3-20
  impostorCount: number;     // 1-5
  timerSeconds: number;      // 0 = sin timer, max 600
  categoryId: string;        // ID del pack de palabras
  vibrationEnabled: boolean;
  soundEnabled: boolean;
}

/** Estado global del juego */
export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  secretWord: string | null;
  impostorIndexes: number[];
  votes: Record<string, string>; // {voterId: accusedId}
  settings: GameSettings;
  gameId: string;
  startedAt: number | null;
  roundNumber: number; // Número de ronda actual (1 o 2)
  maxRounds: number; // Máximo de rondas permitidas (siempre 2)
  eliminatedPlayerIds: string[]; // IDs de jugadores eliminados
  clueWords: Record<string, string>; // {playerId: palabraPista} para ronda 2
  cluePlayerIndex: number; // Índice del jugador actual dando pista
}

/** Pack de palabras */
export interface WordPack {
  id: string;
  name: string;
  emoji: string;
  words: string[];
  isCustom: boolean;
}

/** Acciones del reducer */
export type GameAction =
  | { type: 'START_SETUP' }
  | { type: 'GO_HOME' }
  | { type: 'SHOW_HOW_TO_PLAY' }
  | { type: 'SHOW_WORD_PACKS' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<GameSettings> }
  | { type: 'SET_PLAYERS'; payload: Player[] }
  | { type: 'START_GAME'; payload: { players: Player[]; secretWord: string; impostorIndexes: number[] } }
  | { type: 'NEXT_PLAYER' }
  | { type: 'REVEAL_CURRENT_ROLE' }
  | { type: 'START_TIMER' }
  | { type: 'END_TIMER' }
  | { type: 'START_DISCUSSION' }
  | { type: 'START_VOTING' }
  | { type: 'CAST_VOTE'; payload: { voterId: string; accusedId: string } }
  | { type: 'SHOW_RESULTS' }
  | { type: 'CONTINUE_NEXT_ROUND'; payload: { eliminatedPlayerId: string } }
  | { type: 'START_CLUE_GIVE' }
  | { type: 'SUBMIT_CLUE'; payload: { playerId: string; word: string } }
  | { type: 'NEXT_CLUE_PLAYER' }
  | { type: 'START_CLUE_REVIEW' }
  | { type: 'RESTART_GAME'; payload: { secretWord: string; impostorIndexes: number[] } }
  | { type: 'NEW_GAME' };

/** Resultado de votación */
export interface VoteResult {
  accusedId: string;
  accusedName: string;
  voteCount: number;
  wasImpostor: boolean;
  impostorsWon: boolean;
  voteCounts: Record<string, number>;
  shouldContinue: boolean; // Si el juego debe continuar con otra ronda
  activePlayersCount: number; // Jugadores activos después de la eliminación
  isTie: boolean; // Si hay empate en la votación (múltiples jugadores con el máximo de votos)
  tiedPlayerIds: string[]; // IDs de los jugadores empatados con el máximo de votos
}
