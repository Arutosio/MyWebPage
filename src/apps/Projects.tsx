import { useEffect, useState } from 'react';
import { Star, GitFork, Zap } from 'lucide-react';
import { relativeTime } from '@/lib/time';

interface Repo {
    id: number;
    name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    forks_count: number;
    pushed_at: string;
    language: string | null;
}

const LANG_COLORS: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    Python: '#3572A5',
    'C#': '#178600',
    'C++': '#f34b7d',
    C: '#9cb5c8',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Shell: '#89e051',
    Go: '#00ADD8',
    Rust: '#dea584',
    Vue: '#41b883',
    PHP: '#4F5D95',
};

export default function Projects() {
    const [repos, setRepos] = useState<Repo[] | null>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        let cancelled = false;
        fetch('https://api.github.com/users/Arutosio/repos?sort=pushed&per_page=12')
            .then((r) => {
                if (!r.ok) throw new Error('api');
                return r.json();
            })
            .then((data: Repo[]) => {
                if (!cancelled) setRepos(data);
            })
            .catch((err) => {
                if (!cancelled) {
                    console.warn('[Projects] GitHub API fetch failed:', err);
                    setError(true);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    return (
        <div className="space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtext">
                // github_uplink
            </div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-mauve drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.35)]">
                [ CAPABILITY BANKS ]
            </h1>

            {error && (
                <div className="rounded border border-red/50 bg-red/10 p-3 font-mono text-[11px] text-red">
                    // link failed — github uplink unreachable.{' '}
                    <a
                        href="https://github.com/Arutosio"
                        target="_blank"
                        rel="noopener"
                        className="underline"
                    >
                        visit profile
                    </a>
                </div>
            )}

            {repos === null && !error && (
                <div className="flex items-center gap-2 font-mono text-xs text-subtext">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mauve" />
                    fetching uplink…
                </div>
            )}

            <div className="space-y-2">
                {repos?.map((repo) => {
                    const langColor = repo.language ? LANG_COLORS[repo.language] ?? '#9cb5c8' : '#6c7086';
                    return (
                        <a
                            key={repo.id}
                            href={repo.html_url}
                            target="_blank"
                            rel="noopener"
                            className="group block rounded-lg border border-surface0/70 bg-mantle/40 p-3 transition-all hover:-translate-y-0.5 hover:border-mauve/60 hover:bg-mauve/5 hover:shadow-[0_0_14px_rgba(var(--accent-rgb),0.28)]"
                        >
                            <div className="mb-1 flex items-baseline justify-between gap-2">
                                <div className="truncate font-display text-[13px] font-bold uppercase tracking-wide text-mauve group-hover:text-pink">
                                    <span className="mr-1 text-pink">▸</span>
                                    {repo.name}
                                </div>
                                <div className="flex shrink-0 items-center gap-3 font-mono text-[10px] text-subtext">
                                    <span className="flex items-center gap-1">
                                        <Star className="h-3 w-3" strokeWidth={2} />
                                        {repo.stargazers_count}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <GitFork className="h-3 w-3" strokeWidth={2} />
                                        {repo.forks_count}
                                    </span>
                                    <span className="flex items-center gap-1 text-yellow">
                                        <Zap className="h-3 w-3" strokeWidth={2} />
                                        {relativeTime(repo.pushed_at)}
                                    </span>
                                </div>
                            </div>
                            {repo.description && (
                                <p className="mb-2 line-clamp-2 font-mono text-[11px] leading-relaxed text-subtext">
                                    {repo.description}
                                </p>
                            )}
                            {repo.language && (
                                <div className="flex items-center gap-2 font-mono text-[10px] text-overlay1">
                                    <span
                                        className="h-2 w-2 rounded-full"
                                        style={{ background: langColor }}
                                    />
                                    {repo.language}
                                </div>
                            )}
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
