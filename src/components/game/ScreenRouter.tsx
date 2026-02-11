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
import CluePassDeviceScreen from './screens/CluePassDeviceScreen';
import ClueGiveScreen from './screens/ClueGiveScreen';
import ClueReviewScreen from './screens/ClueReviewScreen';

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
  CLUE_PASS_DEVICE: CluePassDeviceScreen,
  CLUE_GIVE: ClueGiveScreen,
  CLUE_REVIEW: ClueReviewScreen,
};

export default function ScreenRouter() {
  const { state } = useGame();
  const Screen = screenMap[state.phase] ?? HomeScreen;
  return <Screen />;
}
