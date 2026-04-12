/** Pulsing dot + label shown while async data loads. */
export default function LoadingDots({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-2 font-mono text-xs text-subtext">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mauve" />
            {text}
        </div>
    );
}
