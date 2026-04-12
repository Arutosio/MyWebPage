import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { useFetch } from '@/hooks/useFetch';
import AppHeader from '@/components/ui/AppHeader';
import LoadingDots from '@/components/ui/LoadingDots';
import ErrorBanner from '@/components/ui/ErrorBanner';
import { toast } from '@/store/toast';

interface ChainInfo {
    nameSymbolChain: string;
    nameChain: string;
    addressDepositText: string;
    qrcDepositImgQRC: string;
}

interface CryptoInfo {
    logoCryptoIMG: string;
    nameCrypto: string;
    nameSymbol: string;
    addressWallet: Record<string, ChainInfo>;
}

type Wallets = Record<string, CryptoInfo>;

export default function Donate() {
    const { data: wallets, error, loading } = useFetch<Wallets>('/Json/WalletDepositAddress.json');
    const [selected, setSelected] = useState<string>('');
    const [copied, setCopied] = useState<string | null>(null);

    // Auto-select first wallet when data arrives
    const effectiveSelected = selected || (wallets ? Object.keys(wallets)[0] ?? '' : '');

    const copy = (text: string, id: string) => {
        if (!navigator.clipboard?.writeText) {
            toast.error('Copy failed', 'Clipboard API not available in this context.');
            return;
        }
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setCopied(id);
                window.setTimeout(() => setCopied(null), 1400);
            })
            .catch((err) => {
                console.warn('[Donate] clipboard write failed', err);
                toast.error('Copy failed', 'Could not write to clipboard.');
            });
    };

    const current = effectiveSelected && wallets ? wallets[effectiveSelected] : null;

    return (
        <div className="space-y-4">
            <AppHeader label="// crypto_wallet" title="[ RESOURCE TRANSFER ]" />
            <p className="text-[13px] leading-relaxed text-subtext">
                Enjoying the content? Power the reactor. Pick an asset below and copy the wallet address
                — peer-to-peer, non-refundable, handle with Accelerator-level care.
            </p>

            {error && <ErrorBanner>// wallet config missing. try again later.</ErrorBanner>}

            {loading && <LoadingDots text="loading wallets…" />}

            {wallets && (
                <>
                    <div>
                        <label
                            htmlFor="donate-asset"
                            className="mb-1 block font-mono text-[10px] uppercase tracking-[0.14em] text-subtext"
                        >
                            // select asset
                        </label>
                        <select
                            id="donate-asset"
                            value={effectiveSelected}
                            onChange={(e) => setSelected(e.target.value)}
                            className="w-full rounded border border-mauve/50 bg-mantle/60 px-3 py-2 font-mono text-[12px] uppercase tracking-wider text-mauve outline-none transition-all focus:border-pink focus:shadow-[0_0_10px_rgba(255, 58, 168,0.35)]"
                        >
                            {Object.entries(wallets).map(([k, info]) => (
                                <option key={k} value={k}>
                                    {info.nameCrypto} ({info.nameSymbol})
                                </option>
                            ))}
                        </select>
                    </div>

                    {current && (
                        <div className="space-y-3 rounded-lg border border-surface0/80 bg-mantle/50 p-4">
                            <div className="flex items-center gap-3 border-b border-surface0/60 pb-3">
                                {current.logoCryptoIMG && (
                                    <img
                                        src={current.logoCryptoIMG}
                                        alt={current.nameCrypto}
                                        className="h-9 w-9 object-contain"
                                    />
                                )}
                                <div>
                                    <div className="font-display text-[14px] font-bold uppercase tracking-wide text-mauve">
                                        {current.nameCrypto}
                                    </div>
                                    <div className="font-mono text-[10px] text-subtext">
                                        {current.nameSymbol}
                                    </div>
                                </div>
                            </div>

                            {Object.entries(current.addressWallet).map(([k, chain]) => {
                                const id = `${current.nameSymbol}-${k}`;
                                const isCopied = copied === id;
                                return (
                                    <div key={k} className="space-y-1">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="font-mono text-[10px] uppercase tracking-wide text-subtext">
                                                {chain.nameChain} · {chain.nameSymbolChain}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => copy(chain.addressDepositText, id)}
                                                className="flex items-center gap-1 rounded border border-mauve/40 bg-mauve/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wide text-mauve transition-all hover:border-pink hover:bg-pink/10 hover:text-pink"
                                            >
                                                {isCopied ? (
                                                    <Check className="h-3 w-3" strokeWidth={3} />
                                                ) : (
                                                    <Copy className="h-3 w-3" strokeWidth={2} />
                                                )}
                                                {isCopied ? 'copied' : 'copy'}
                                            </button>
                                        </div>
                                        <div className="break-all rounded bg-crust/70 px-2 py-1.5 font-mono text-[10px] text-pink">
                                            {chain.addressDepositText}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
