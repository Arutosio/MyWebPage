interface Props {
    /** Comment-style label, e.g. "// personnel_file" */
    label: string;
    /** Main heading text, e.g. "[ PERSONNEL FILE ]" */
    title: string;
}

/** Shared page header used by all app windows (Bio, Projects, Donate, Settings). */
export default function AppHeader({ label, title }: Props) {
    return (
        <>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtext">
                {label}
            </div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-mauve drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.35)]">
                {title}
            </h1>
        </>
    );
}
