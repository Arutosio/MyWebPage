import AppHeader from '@/components/ui/AppHeader';

const BIRTH = new Date(1994, 3, 30);

function computeAge(): number {
    const now = new Date();
    const passed =
        now.getMonth() > BIRTH.getMonth() ||
        (now.getMonth() === BIRTH.getMonth() && now.getDate() >= BIRTH.getDate());
    return now.getFullYear() - BIRTH.getFullYear() - (passed ? 0 : 1);
}

const ABILITIES = ['JavaScript', 'TypeScript', 'C#', 'HTML/CSS', 'Git', 'Node.js', 'SQL'];
const INTERESTS = ['Gaming', 'Anime', 'Streaming', 'Creating', 'Coffee'];

function SectionHeading({ children }: { children: React.ReactNode }) {
    return (
        <h2 className="mb-2 font-display text-[11px] uppercase tracking-[0.2em] text-mauve">
            {children}
        </h2>
    );
}

export default function Bio() {
    const stats: Array<[string, string]> = [
        ['subject', 'ARUTOSIO'],
        ['alias', '@arutosio'],
        ['class', 'TECH ENTHUSIAST'],
        ['level', '5 / 5'],
        ['age', `${computeAge()} cycles`],
        ['status', '[ online ]'],
    ];
    return (
        <div className="space-y-5">
            <AppHeader label="// personnel_file" title="[ PERSONNEL FILE ]" />

            <div className="rounded-lg border border-surface0/80 bg-mantle/50 p-4">
                <div className="mb-2 flex items-center justify-between border-b border-surface0/60 pb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-overlay0">
                    <span>dossier</span>
                    <span>clearance: sigma</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                    {stats.map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[96px_14px_1fr] items-center">
                            <span className="uppercase tracking-wide text-subtext">{k}</span>
                            <span className="text-overlay0">:</span>
                            <span className="text-pink">{v}</span>
                        </div>
                    ))}
                </div>
            </div>

            <section>
                <SectionHeading>// biography</SectionHeading>
                <p className="text-[13px] leading-relaxed text-subtext">
                    Computer enthusiast since forever. Passionate gamer exploring virtual worlds and
                    getting way too invested in pixel characters. I build web things when I&apos;m not
                    losing to final bosses — tech moves fast and so does Mikoto, you either keep up or
                    get fried.
                </p>
            </section>

            <section>
                <SectionHeading>// abilities</SectionHeading>
                <div className="flex flex-wrap gap-1.5">
                    {ABILITIES.map((a) => (
                        <span
                            key={a}
                            className="rounded border border-mauve/40 bg-mauve/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-pink"
                        >
                            {a}
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeading>// interests</SectionHeading>
                <div className="flex flex-wrap gap-1.5">
                    {INTERESTS.map((i) => (
                        <span
                            key={i}
                            className="rounded border border-sky/40 bg-sky/5 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-sky"
                        >
                            {i}
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <SectionHeading>// channels</SectionHeading>
                <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                    {[
                        ['github', 'https://github.com/Arutosio'],
                        ['youtube', 'https://www.youtube.com/user/arutosio'],
                        ['twitch', 'https://www.twitch.tv/arutosio'],
                        ['twitter', 'https://twitter.com/arutosio'],
                        ['discord', 'https://discord.gg/QvUW3kte4c'],
                        ['mal', 'https://myanimelist.net/profile/Arutosio'],
                    ].map(([name, href]) => (
                        <a
                            key={name}
                            href={href}
                            target="_blank"
                            rel="noopener"
                            className="border-b border-mauve/40 text-mauve hover:border-pink hover:text-pink hover:shadow-[0_0_6px_rgba(255, 58, 168,0.4)]"
                        >
                            {name}
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}
