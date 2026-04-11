import type { Command, CommandSource } from './types';

/**
 * In-memory command registry. Supports built-in + plugin commands, lets
 * plugin commands be wiped and re-registered in one call when the plugin
 * store changes.
 */
export class CommandRegistry {
    private commands = new Map<string, Command>();

    register(cmd: Command): void {
        this.commands.set(cmd.name, cmd);
    }

    registerAll(cmds: readonly Command[]): void {
        for (const c of cmds) this.register(c);
    }

    unregister(name: string): void {
        this.commands.delete(name);
    }

    /** Remove all commands whose `source` matches. */
    clearBySource(source: CommandSource): void {
        for (const [k, v] of this.commands) {
            if (v.source === source) this.commands.delete(k);
        }
    }

    get(name: string): Command | undefined {
        return this.commands.get(name);
    }

    has(name: string): boolean {
        return this.commands.has(name);
    }

    list(): Command[] {
        return [...this.commands.values()];
    }

    size(): number {
        return this.commands.size;
    }
}
