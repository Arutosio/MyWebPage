import Desktop from './components/Desktop';
import Toaster from './components/Toaster';
import { useApplyAccent } from './lib/apply-accent';

export default function App() {
    useApplyAccent();
    return (
        <>
            <Desktop />
            <Toaster />
        </>
    );
}
