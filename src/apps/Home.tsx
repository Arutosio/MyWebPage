import { useWindowStore } from '@/store/windows';
import type { AppId } from '@/types/window';

export default function Home() {
    const open = useWindowStore((s) => s.open);

    const shortcut = (id: AppId) => (
        <button
            type="button"
            onClick={() => open(id)}
            className="rounded border border-mauve/40 bg-mauve/5 px-2 py-1 text-left font-mono text-[11px] uppercase tracking-wider text-pink transition-all hover:border-pink hover:bg-pink/10 hover:shadow-[0_0_8px_rgba(255, 58, 168,0.4)]"
        >
            ./{id}
        </button>
    );

    return (
        <div className="space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtext">// welcome.sh</div>
            <h1 className="font-display text-4xl font-bold leading-none text-mauve drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.35)]">
                ~/arutosio
            </h1>
            <div className="h-px bg-gradient-to-r from-mauve/60 via-pink/30 to-transparent" />

            <div className="space-y-1 font-mono text-[12px] leading-relaxed">
                <p className="text-sky">
                    <span className="text-mauve">$</span> whoami
                </p>
                <p className="pl-3 text-text">
                    computer enthusiast · gamer · anime believer · caffeine carrier
                </p>
            </div>

            <div className="space-y-1 font-mono text-[12px] leading-relaxed">
                <p className="text-sky">
                    <span className="text-mauve">$</span> cat ~/about.txt
                </p>
                <p className="pl-3 text-subtext">
                    I build weird things on the web when I&apos;m not busy losing to a final boss.
                    Italian, Academy City sympathizer, lvl 5 caffeine.
                </p>
            </div>

            <div className="space-y-1 font-mono text-[12px] leading-relaxed">
                <p className="text-sky">
                    <span className="text-mauve">$</span> ls apps/
                </p>
                <div className="flex flex-wrap gap-2 pl-3">
                    {shortcut('bio')}
                    {shortcut('projects')}
                    {shortcut('donate')}
                </div>
            </div>

            <div className="space-y-1 font-mono text-[12px] leading-relaxed">
                <p className="text-sky">
                    <span className="text-mauve">$</span> uptime
                </p>
                <p className="pl-3 text-green">online · running arutOS 1.0 · terminal vibes</p>
            </div>
        </div>
    );
}
