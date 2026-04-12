import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';
import { useToast, type ToastKind } from '@/store/toast';

const KIND_META: Record<ToastKind, { icon: React.ReactNode; label: string; color: string; border: string; glow: string }> = {
    info: {
        icon: <Info className="h-4 w-4" />,
        label: 'INFO',
        color: 'text-sky',
        border: 'border-sky/60',
        glow: 'shadow-[0_0_12px_rgba(137,220,235,0.35)]',
    },
    success: {
        icon: <CheckCircle2 className="h-4 w-4" />,
        label: 'OK',
        color: 'text-green',
        border: 'border-green/60',
        glow: 'shadow-[0_0_12px_rgba(166,227,161,0.35)]',
    },
    warn: {
        icon: <AlertTriangle className="h-4 w-4" />,
        label: 'WARN',
        color: 'text-peach',
        border: 'border-peach/60',
        glow: 'shadow-[0_0_12px_rgba(250,179,135,0.35)]',
    },
    error: {
        icon: <XCircle className="h-4 w-4" />,
        label: 'ERR',
        color: 'text-red',
        border: 'border-red/60',
        glow: 'shadow-[0_0_12px_rgba(243,139,168,0.4)]',
    },
};

export default function Toaster() {
    const toasts = useToast((s) => s.toasts);
    const dismiss = useToast((s) => s.dismiss);

    return (
        <div className="pointer-events-none fixed bottom-4 right-4 z-[9999] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2">
            <AnimatePresence initial={false}>
                {toasts.map((t) => {
                    const m = KIND_META[t.kind];
                    return (
                        <motion.div
                            key={t.id}
                            layout
                            initial={{ opacity: 0, x: 40, scale: 0.96 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 40, scale: 0.96 }}
                            transition={{ duration: 0.2, ease: [0.2, 0.8, 0.2, 1] as const }}
                            className={`pointer-events-auto overflow-hidden rounded-md border-2 bg-base/95 backdrop-blur-md ${m.border} ${m.glow}`}
                        >
                            <div className="flex items-start gap-2.5 px-3 py-2.5">
                                <span className={`mt-0.5 ${m.color}`}>{m.icon}</span>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-baseline gap-2">
                                        <span className={`font-mono text-[9px] uppercase tracking-[0.18em] ${m.color}`}>
                                            [{m.label}]
                                        </span>
                                        <span className="truncate font-mono text-[11px] uppercase tracking-wider text-text">
                                            {t.title}
                                        </span>
                                    </div>
                                    {t.message && (
                                        <p className="mt-1 break-words font-mono text-[10px] leading-relaxed text-subtext">
                                            {t.message}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => dismiss(t.id)}
                                    className="shrink-0 rounded p-0.5 text-overlay0 transition-colors hover:text-text"
                                    aria-label="Dismiss"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </div>
    );
}
