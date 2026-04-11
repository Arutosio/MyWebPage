import { useEffect, useState } from 'react';
import { Copy, Check } from 'lucide-react';

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
    const [wallets, setWallets] = useState<Wallets | null>(null);
    const [error, setError] = useState(false);
    const [selected, setSelected] = useState<string>('');
    const [copied, setCopied] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetch('/Json/WalletDepositAddress.json')
            .then((r) => {
                if (!r.ok) throw new Error('not-found');
                return r.json();
            })
            .then((data: Wallets) => {
                if (cancelled) return;
                setWallets(data);
                const first = Object.keys(data)[0];
                if (first) setSelected(first);
            })
            .catch((err) => {
                if (!cancelled) {
                    console.warn('[Donate] wallet JSON fetch failed:', err);
                    setError(true);
                }
            });
        return () => {
            cancelled = true;
        };
    }, []);

    const copy = (text: string, id: string) => {
        navigator.clipboard.writeText(text).then(() => {
            setCopied(id);
            window.setTimeout(() => setCopied(null), 1400);
        });
    };

    const current = selected && wallets ? wallets[selected] : null;

    return (
        <div className="space-y-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-subtext">
                // crypto_wallet
            </div>
            <h1 className="font-display text-2xl font-bold uppercase tracking-wider text-mauve drop-shadow-[0_0_10px_rgba(var(--accent-rgb),0.35)]">
                [ RESOURCE TRANSFER ]
            </h1>
            <p className="text-[13px] leading-relaxed text-subtext">
                Enjoying the content? Power the reactor. Pick an asset below and copy the wallet address
                — peer-to-peer, non-refundable, handle with Accelerator-level care.
            </p>

            {error && (
                <div className="rounded border border-red/50 bg-red/10 p-3 font-mono text-[11px] text-red">
                    // wallet config missing. try again later.
                </div>
            )}

            {!wallets && !error && (
                <div className="flex items-center gap-2 font-mono text-xs text-subtext">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-mauve" />
                    loading wallets…
                </div>
            )}

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
                            value={selected}
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
