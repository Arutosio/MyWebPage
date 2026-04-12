/** Red bordered error bar used across app windows. */
export default function ErrorBanner({ children }: { children: React.ReactNode }) {
    return (
        <div className="rounded border border-red/50 bg-red/10 p-3 font-mono text-[11px] text-red">
            {children}
        </div>
    );
}
