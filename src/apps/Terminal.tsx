import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { CommandRegistry } from '@/lib/terminal/registry';
import { BUILTIN_COMMANDS } from '@/lib/terminal/builtin';
import type { Command, CommandContext, TerminalLine, TerminalLineKind } from '@/lib/terminal/types';
import { usePluginStore } from '@/store/plugins';

// Registry is module-level so all Terminal instances share built-ins + plugins.
const registry = new CommandRegistry();
registry.registerAll(BUILTIN_COMMANDS);

const WELCOME: TerminalLine[] = [
    { kind: 'system', text: 'arutOS.terminal 1.0.0', time: Date.now() },
    { kind: 'system', text: 'type `help` to see available commands · `plugin demo` for a sample extension', time: Date.now() },
    { kind: 'system', text: '', time: Date.now() },
];

export default function Terminal() {
    const [lines, setLines] = useState<TerminalLine[]>(() => [...WELCOME]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState<number>(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const outputRef = useRef<HTMLDivElement>(null);

    // Reactive slice of plugin manifests → convert into Command[] and sync
    const plugins = usePluginStore((s) => s.plugins);
    const pluginCommands = useMemo<Command[]>(() => {
        const out: Command[] = [];
        for (const p of plugins) {
            if (!p.commands) continue;
            for (const pc of p.commands) {
                out.push({
                    name: pc.name,
                    description: pc.description,
                    source: 'plugin',
                    run: (ctx) => {
                        ctx.print(pc.response ?? '(no response)');
                    },
                });
            }
        }
        return out;
    }, [plugins]);

    // Whenever plugin commands change, refresh the plugin slice of the registry
    useEffect(() => {
        registry.clearBySource('plugin');
        registry.registerAll(pluginCommands);
    }, [pluginCommands]);

    // Auto-scroll to bottom on new output
    useEffect(() => {
        const el = outputRef.current;
        if (el) el.scrollTop = el.scrollHeight;
    }, [lines]);

    // Focus input on mount
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const print = useCallback((text: string, kind: TerminalLineKind = 'output') => {
        setLines((prev) => [...prev, { kind, text, time: Date.now() }]);
    }, []);

    const clearOutput = useCallback(() => {
        setLines([]);
    }, []);

    const runCommand = useCallback(
        async (raw: string) => {
            const trimmed = raw.trim();
            setLines((prev) => [...prev, { kind: 'input', text: raw, time: Date.now() }]);
            if (!trimmed) return;

            setHistory((h) => (h[h.length - 1] === trimmed ? h : [...h, trimmed]));
            setHistoryIdx(-1);

            const parts = trimmed.split(/\s+/);
            const name = parts[0];
            const args = parts.slice(1);

            const cmd = registry.get(name);
            if (!cmd) {
                print(`command not found: ${name}`, 'error');
                print("  type 'help' to list commands", 'system');
                return;
            }

            const ctx: CommandContext = {
                args,
                raw: trimmed,
                print,
                clear: clearOutput,
                registry,
            };

            try {
                await cmd.run(ctx);
            } catch (err) {
                const msg = err instanceof Error ? err.message : String(err);
                print(`error: ${msg}`, 'error');
            }
        },
        [print, clearOutput],
    );

    const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const cmd = input;
            setInput('');
            runCommand(cmd);
            return;
        }
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (history.length === 0) return;
            const idx = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
            setHistoryIdx(idx);
            setInput(history[idx]);
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIdx === -1) return;
            const idx = historyIdx + 1;
            if (idx >= history.length) {
                setHistoryIdx(-1);
                setInput('');
            } else {
                setHistoryIdx(idx);
                setInput(history[idx]);
            }
            return;
        }
        if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            clearOutput();
            return;
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            const prefix = input.trim();
            if (!prefix || prefix.includes(' ')) return;
            const matches = registry.list().filter((c) => c.name.startsWith(prefix));
            if (matches.length === 1) {
                setInput(matches[0].name + ' ');
            } else if (matches.length > 1) {
                print(matches.map((m) => m.name).join('  '));
            }
            return;
        }
    };

    return (
        <div
            className="flex h-full flex-col font-mono text-[12px] leading-snug"
            onClick={() => inputRef.current?.focus()}
        >
            {/* Output */}
            <div ref={outputRef} className="min-h-0 flex-1 overflow-y-auto pr-1 text-text">
                {lines.map((line, i) => (
                    <Line key={i} line={line} />
                ))}
            </div>

            {/* Input prompt */}
            <div className="mt-2 flex items-center gap-2 border-t border-surface0/60 pt-2">
                <PromptLabel />
                <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKey}
                    className="flex-1 bg-transparent font-mono text-[12px] text-text outline-none placeholder:text-overlay0"
                    placeholder="type a command…"
                    spellCheck={false}
                    autoCapitalize="off"
                    autoCorrect="off"
                    aria-label="terminal input"
                />
            </div>
        </div>
    );
}

function PromptLabel() {
    return (
        <span className="shrink-0 whitespace-nowrap">
            <span className="text-mauve">arutosio</span>
            <span className="text-subtext">@</span>
            <span className="text-blue">arutOS</span>
            <span className="text-subtext">:</span>
            <span className="text-green">~</span>
            <span className="ml-1 text-pink">$</span>
        </span>
    );
}

function Line({ line }: { line: TerminalLine }) {
    if (line.kind === 'input') {
        return (
            <div className="flex items-baseline gap-2 whitespace-pre-wrap">
                <PromptLabel />
                <span className="text-text">{line.text}</span>
            </div>
        );
    }
    if (line.kind === 'error') {
        return <pre className="whitespace-pre-wrap text-red">{line.text || '\u00A0'}</pre>;
    }
    if (line.kind === 'system') {
        return <pre className="whitespace-pre-wrap italic text-subtext">{line.text || '\u00A0'}</pre>;
    }
    return <pre className="whitespace-pre-wrap text-text">{line.text || '\u00A0'}</pre>;
}
