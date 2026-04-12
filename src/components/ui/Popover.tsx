import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    open: boolean;
    onClose: () => void;
    /** CSS class for positioning (e.g. "left-3 top-[60px]" or use style for dynamic right). */
    className?: string;
    /** Inline style — mainly for dynamic `right` anchor. */
    style?: React.CSSProperties;
    /** z-index for the backdrop (content gets +1). Defaults to 89. */
    zBackdrop?: number;
    /** Header left label (e.g. "// phase.orbit"). */
    headerLeft?: React.ReactNode;
    /** Header right label (e.g. timestamp or subtitle). */
    headerRight?: React.ReactNode;
    /** Footer content (rendered in a bordered bar at the bottom). */
    footer?: React.ReactNode;
    /** Width class. Defaults to "w-[320px]". */
    width?: string;
    children: React.ReactNode;
}

const EASE = [0.2, 0.8, 0.2, 1] as const;

export default function Popover({
    open,
    onClose,
    className = '',
    style,
    zBackdrop = 89,
    headerLeft,
    headerRight,
    footer,
    width = 'w-[320px]',
    children,
}: Props) {
    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="fixed inset-0"
                        style={{ zIndex: zBackdrop }}
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -6, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: EASE }}
                        style={{ zIndex: zBackdrop + 1, ...style }}
                        className={`fixed top-[60px] ${width} overflow-hidden rounded-lg border-2 border-mauve/60 bg-base/95 shadow-[0_0_16px_rgba(var(--accent-rgb),0.3),0_6px_12px_rgba(0,0,0,0.5)] backdrop-blur-md ${className}`}
                    >
                        {(headerLeft || headerRight) && (
                            <div className="flex items-center justify-between border-b border-surface0/80 bg-mantle/90 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">
                                <span className="text-mauve">{headerLeft}</span>
                                <span className="text-overlay0">{headerRight}</span>
                            </div>
                        )}
                        {children}
                        {footer && (
                            <div className="border-t border-surface0/80 bg-mantle/90 px-4 py-2 font-mono text-[9px] text-overlay0">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
