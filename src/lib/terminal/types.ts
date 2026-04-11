/**
 * Terminal command architecture — designed for extensibility.
 * Built-in commands live alongside plugin-provided commands in a single
 * `CommandRegistry`, distinguished by a `source` tag so plugins can be
 * hot-swapped without touching built-ins.
 */

import type { CommandRegistry } from './registry';

export type CommandSource = 'builtin' | 'plugin';

export type TerminalLineKind = 'input' | 'output' | 'error' | 'system';

export interface TerminalLine {
    kind: TerminalLineKind;
    text: string;
    time: number;
}

export interface CommandContext {
    /** Positional arguments (after the command name). */
    args: string[];
    /** Raw input line including the command name. */
    raw: string;
    /** Append a line to the terminal output. */
    print: (text: string, kind?: TerminalLineKind) => void;
    /** Wipe all previous output. */
    clear: () => void;
    /** Access to the command registry (used by `help`). */
    registry: CommandRegistry;
}

export type CommandHandler = (ctx: CommandContext) => Promise<void> | void;

export interface Command {
    name: string;
    description: string;
    usage?: string;
    hidden?: boolean;
    source?: CommandSource;
    run: CommandHandler;
}
