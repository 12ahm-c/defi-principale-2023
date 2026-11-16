import { useSessionStore } from '@/state/session-store';
import Screen1Onboarding from '@/screens/Screen1Onboarding';
import Screen2CameraFirst from '@/screens/Screen2CameraFirst';
import Screen3ResultFirst from '@/screens/Screen3ResultFirst';
import Screen4Crossroads from '@/screens/Screen4Crossroads';
import Screen5Context from '@/screens/Screen5Context';
import Screen6Climax from '@/screens/Screen6Climax';

export default function App() {
  const [state] = useSessionStore();

  switch (state.currentScreenId) {
    case 1:
      return <Screen1Onboarding />;
    case 2:
      return <Screen2CameraFirst />;
    case 3:
      return <Screen3ResultFirst />;
    case 4:
      return <Screen4Crossroads />;
    case 5:
      return <Screen5Context />;
    case 6:
      return <Screen6Climax />;
    default:
      return <Screen1Onboarding />;
  }
}