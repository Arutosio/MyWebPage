import Desktop from './components/Desktop';
import { useApplyAccent } from './lib/apply-accent';

export default function App() {
    useApplyAccent();
    return <Desktop />;
}
