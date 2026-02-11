import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
  type Dispatch,
} from 'react';
import { loadSettings, saveSettings } from '../../lib/storage/storage';
import type {
  GameState,
  GameAction,
  GameSettings,
} from '../../lib/types/game.types';

/* ────────────── Initial state ────────────── */

const defaultSettings: GameSettings = {
  playerCount: 4,
  impostorCount: 1,
  timerSeconds: 120,
  categoryId: 'animales',
  vibrationEnabled: true,
  soundEnabled: true,
};

function getInitialState(): GameState {
  const persisted = loadSettings();
  return {
    phase: 'HOME',
    players: [],
    currentPlayerIndex: 0,
    secretWord: null,
    impostorIndexes: [],
    votes: {},
    settings: { ...defaultSettings, ...persisted },
    gameId: '',
    startedAt: null,
    roundNumber: 1,
    eliminatedPlayerIds: [],
    clueWords: {},
    cluePlayerIndex: 0,
  };
}

/* ────────────── Reducer ────────────── */

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'GO_HOME':
      return { ...getInitialState(), phase: 'HOME', settings: state.settings };

    case 'START_SETUP':
      return { ...getInitialState(), phase: 'SETUP', settings: state.settings };

    case 'SHOW_HOW_TO_PLAY':
      return { ...state, phase: 'HOW_TO_PLAY' };

    case 'SHOW_WORD_PACKS':
      return { ...state, phase: 'WORD_PACKS' };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'SET_PLAYERS':
      return { ...state, players: action.payload };

    case 'START_GAME':
      return {
        ...state,
        phase: 'PASS_DEVICE',
        players: action.payload.players,
        secretWord: action.payload.secretWord,
        impostorIndexes: action.payload.impostorIndexes,
        currentPlayerIndex: 0,
        votes: {},
        gameId: crypto.randomUUID(),
        startedAt: Date.now(),
        roundNumber: 1,
        eliminatedPlayerIds: [],
        clueWords: {},
        cluePlayerIndex: 0,
      };

    case 'REVEAL_CURRENT_ROLE':
      return {
        ...state,
        phase: 'REVEAL_ROLE',
        players: state.players.map((p, i) =>
          i === state.currentPlayerIndex ? { ...p, isRevealed: true } : p
        ),
      };

    case 'NEXT_PLAYER': {
      const nextIndex = state.currentPlayerIndex + 1;
      // Filtrar jugadores activos (no eliminados)
      const activePlayers = state.players.filter(
        (p) => !state.eliminatedPlayerIds.includes(p.id)
      );
      
      if (nextIndex >= activePlayers.length) {
        // Todos han visto su rol → discusión (timer o libre)
        return {
          ...state,
          currentPlayerIndex: nextIndex,
          phase: state.settings.timerSeconds > 0 ? 'TIMER' : 'DISCUSSION',
        };
      }
      return {
        ...state,
        currentPlayerIndex: nextIndex,
        phase: 'PASS_DEVICE',
      };
    }

    case 'START_TIMER':
      return { ...state, phase: 'TIMER' };

    case 'END_TIMER':
      return { ...state, phase: 'DISCUSSION' };

    case 'START_DISCUSSION':
      return { ...state, phase: 'DISCUSSION' };

    case 'START_VOTING':
      return { ...state, phase: 'VOTING', votes: {} };

    case 'CAST_VOTE':
      return {
        ...state,
        votes: {
          ...state.votes,
          [action.payload.voterId]: action.payload.accusedId,
        },
      };

    case 'SHOW_RESULTS':
      return { ...state, phase: 'RESULTS' };

    case 'CONTINUE_NEXT_ROUND':
      return {
        ...state,
        phase: 'CLUE_PASS_DEVICE',
        roundNumber: 2,
        eliminatedPlayerIds: [...state.eliminatedPlayerIds, action.payload.eliminatedPlayerId],
        votes: {},
        clueWords: {},
        cluePlayerIndex: 0,
        currentPlayerIndex: 0,
      };

    case 'SUBMIT_CLUE':
      return {
        ...state,
        clueWords: {
          ...state.clueWords,
          [action.payload.playerId]: action.payload.word,
        },
      };

    case 'NEXT_CLUE_PLAYER': {
      const nextClueIdx = state.cluePlayerIndex + 1;
      const activeForClues = state.players.filter(
        (p) => !state.eliminatedPlayerIds.includes(p.id)
      );
      if (nextClueIdx >= activeForClues.length) {
        return { ...state, cluePlayerIndex: nextClueIdx, phase: 'CLUE_REVIEW' };
      }
      return { ...state, cluePlayerIndex: nextClueIdx, phase: 'CLUE_PASS_DEVICE' };
    }

    case 'START_CLUE_REVIEW':
      return { ...state, phase: 'CLUE_REVIEW' };

    case 'START_CLUE_GIVE':
      return { ...state, phase: 'CLUE_GIVE' };

    case 'RESTART_GAME':
      return {
        ...state,
        phase: 'PASS_DEVICE',
        currentPlayerIndex: 0,
        secretWord: action.payload.secretWord,
        impostorIndexes: action.payload.impostorIndexes,
        votes: {},
        gameId: crypto.randomUUID(),
        startedAt: Date.now(),
        players: state.players.map((p) => ({ ...p, isRevealed: false })),
        roundNumber: 1,
        eliminatedPlayerIds: [],
        clueWords: {},
        cluePlayerIndex: 0,
      };

    case 'NEW_GAME':
      return { ...getInitialState(), phase: 'SETUP', settings: state.settings };

    default:
      return state;
  }
}

/* ────────────── Context ────────────── */

interface GameContextValue {
  state: GameState;
  dispatch: Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue | null>(null);

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

/* ────────────── Provider ────────────── */

export default function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, getInitialState);

  // Persistir settings cuando cambian
  useEffect(() => {
    saveSettings({
      timerSeconds: state.settings.timerSeconds,
      impostorCount: state.settings.impostorCount,
      vibrationEnabled: state.settings.vibrationEnabled,
      soundEnabled: state.settings.soundEnabled,
      categoryId: state.settings.categoryId,
    });
  }, [state.settings]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
