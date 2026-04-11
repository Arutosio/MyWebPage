const BIRTH = new Date(1994, 3, 30);

function computeAge(): number {
    const now = new Date();
    const passed =
        now.getMonth() > BIRTH.getMonth() ||
        (now.getMonth() === BIRTH.getMonth() && now.getDate() >= BIRTH.getDate());
    return now.getFullYear() - BIRTH.getFullYear() - (passed ? 0 : 1);
}

const STATS: Array<[string, string]> = [
    ['subject', 'ARUTOSIO'],
    ['alias', '@arutosio'],
    ['class', 'TECH ENTHUSIAST'],
    ['level', '5 / 5'],
    ['age', `${computeAge()} cycles`],
    ['status', '[ online ]'],
];

const ABILITIES = ['JavaScript', 'TypeScript', 'C#', 'HTML/CSS', 'Git', 'Node.js', 'SQL'];
const INTERESTS = ['Gaming', 'Anime', 'Streaming', 'Creating', 'Coffee'];

export default function Bio() {
    return (
        <div className="space-y-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtext">
                // personnel_file
            </div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-mauve drop-shadow-[0_0_14px_rgba(203,166,247,0.4)]">
                [ PERSONNEL FILE ]
            </h1>

            <div className="rounded-lg border border-surface0/80 bg-mantle/50 p-4">
                <div className="mb-2 flex items-center justify-between border-b border-surface0/60 pb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-overlay0">
                    <span>dossier</span>
                    <span>clearance: sigma</span>
                </div>
                <div className="space-y-1 font-mono text-[11px]">
                    {STATS.map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[96px_14px_1fr] items-center">
                            <span className="uppercase tracking-wide text-subtext">{k}</span>
                            <span className="text-overlay0">:</span>
                            <span className="text-pink">{v}</span>
                        </div>
                    ))}
                </div>
            </div>

            <section>
                <h2 className="mb-2 font-display text-[11px] uppercase tracking-[0.2em] text-mauve">
                    // biography
                </h2>
                <p className="text-[13px] leading-relaxed text-subtext">
                    Computer enthusiast since forever. Passionate gamer exploring virtual worlds and
                    getting way too invested in pixel characters. I build web things when I&apos;m not
                    losing to final bosses — tech moves fast and so does Mikoto, you either keep up or
                    get fried.
                </p>
            </section>

            <section>
                <h2 className="mb-2 font-display text-[11px] uppercase tracking-[0.2em] text-mauve">
                    // abilities
                </h2>
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
                <h2 className="mb-2 font-display text-[11px] uppercase tracking-[0.2em] text-mauve">
                    // interests
                </h2>
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
                <h2 className="mb-2 font-display text-[11px] uppercase tracking-[0.2em] text-mauve">
                    // channels
                </h2>
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
                            className="border-b border-mauve/40 text-mauve hover:border-pink hover:text-pink hover:shadow-[0_0_6px_rgba(245,194,231,0.4)]"
                        >
                            {name}
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}
