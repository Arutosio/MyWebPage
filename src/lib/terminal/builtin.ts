import type { Command } from './types';
import { useWindowStore } from '@/store/windows';
import { useSettings, type AccentColor } from '@/store/settings';
import { usePluginStore } from '@/store/plugins';
import { APPS } from '@/lib/apps';
import { SLOTS, type PhaseName } from '@/lib/time-slots';
import type { AppId } from '@/types/window';

const NEOFETCH = `
        ▄▄▄▄▄▄▄         user      : arutosio
      ▄█████████▄       host      : arutOS 1.0
     ▐██ ▄   ▄ █▌      kernel    : react 19 · ts 5 · vite 6
     ▐██ ▀▀▀▀▀ █▌      shell     : arutOS.terminal 1.0
     ▐██  ▀▀▀  █▌      wm        : arutOS.wm (react-rnd)
      ▀█████████▀      theme     : arutOS dark neon
        ▀▀▀▀▀▀▀        palette   : neon dark
                       uptime    : since last reload
`;

const HELP_INTRO = [
    'arutOS.terminal — an extensible mini-shell.',
    'type a command and press enter. up/down for history. ctrl+l to clear.',
    '',
];

const ACCENT_VALUES: AccentColor[] = ['mauve', 'blue', 'pink', 'green', 'peach', 'sky'];

export const BUILTIN_COMMANDS: readonly Command[] = [
    {
        name: 'help',
        description: 'list commands or show help for one',
        usage: 'help [command]',
        source: 'builtin',
        run(ctx) {
            if (ctx.args[0]) {
                const cmd = ctx.registry.get(ctx.args[0]);
                if (!cmd) {
                    ctx.print(`no help: ${ctx.args[0]}`, 'error');
                    return;
                }
                ctx.print(`${cmd.name} — ${cmd.description}`);
                if (cmd.usage) ctx.print(`usage: ${cmd.usage}`);
                if (cmd.source) ctx.print(`source: ${cmd.source}`, 'system');
                return;
            }
            HELP_INTRO.forEach((l) => ctx.print(l));
            const cmds = ctx.registry.list().filter((c) => !c.hidden).sort((a, b) => a.name.localeCompare(b.name));
            const col = Math.max(...cmds.map((c) => c.name.length));
            ctx.print('commands:');
            for (const c of cmds) {
                const tag = c.source === 'plugin' ? ' *' : '  ';
                ctx.print(` ${tag} ${c.name.padEnd(col)}  ${c.description}`);
            }
            ctx.print('');
            ctx.print('  * = provided by a plugin', 'system');
        },
    },
    {
        name: 'clear',
        description: 'clear the screen',
        source: 'builtin',
        run(ctx) {
            ctx.clear();
        },
    },
    {
        name: 'echo',
        description: 'print text',
        usage: 'echo <text...>',
        source: 'builtin',
        run(ctx) {
            ctx.print(ctx.args.join(' '));
        },
    },
    {
        name: 'date',
        description: 'current date and time',
        source: 'builtin',
        run(ctx) {
            ctx.print(new Date().toString());
        },
    },
    {
        name: 'whoami',
        description: 'current user',
        source: 'builtin',
        run(ctx) {
            ctx.print('arutosio');
        },
    },
    {
        name: 'uname',
        description: 'os identification',
        usage: 'uname [-a]',
        source: 'builtin',
        run(ctx) {
            if (ctx.args.includes('-a')) {
                ctx.print('arutOS 1.0.0 arutOS-wm react-rnd x86_64');
                return;
            }
            ctx.print('arutOS');
        },
    },
    {
        name: 'neofetch',
        description: 'pretty system info banner',
        source: 'builtin',
        run(ctx) {
            ctx.print(NEOFETCH);
        },
    },
    {
        name: 'ls',
        description: 'list installed apps',
        source: 'builtin',
        run(ctx) {
            const apps = Object.values(APPS);
            ctx.print(`total ${apps.length}`, 'system');
            for (const a of apps) {
                ctx.print(`  ${a.id.padEnd(12)} ${a.title.padEnd(18)} ${a.subtitle}`);
            }
        },
    },
    {
        name: 'open',
        description: 'open an app window',
        usage: 'open <app-id>',
        source: 'builtin',
        run(ctx) {
            const id = ctx.args[0] as AppId | undefined;
            if (!id) {
                ctx.print('usage: open <app-id>', 'error');
                return;
            }
            if (!(id in APPS)) {
                ctx.print(`unknown app: ${id}`, 'error');
                ctx.print('run `ls` to see available apps', 'system');
                return;
            }
            useWindowStore.getState().open(id);
            ctx.print(`opened ${id}`, 'system');
        },
    },
    {
        name: 'close',
        description: 'close the focused window',
        source: 'builtin',
        run(ctx) {
            const store = useWindowStore.getState();
            const fid = store.focusedId;
            if (!fid) {
                ctx.print('no focused window', 'error');
                return;
            }
            store.close(fid);
            ctx.print(`closed window ${fid}`, 'system');
        },
    },
    {
        name: 'windows',
        description: 'list open windows',
        source: 'builtin',
        run(ctx) {
            const wins = useWindowStore.getState().windows;
            if (wins.length === 0) {
                ctx.print('no windows open', 'system');
                return;
            }
            for (const w of wins) {
                const state = w.minimized ? '[min]' : w.maximized ? '[max]' : '[     ]';
                ctx.print(`  ${w.id.padEnd(8)} ${w.appId.padEnd(12)} ${state}`);
            }
        },
    },
    {
        name: 'theme',
        description: 'get or set accent color',
        usage: 'theme [mauve|blue|pink|green|peach|sky]',
        source: 'builtin',
        run(ctx) {
            const color = ctx.args[0];
            const s = useSettings.getState();
            if (!color) {
                ctx.print(`current accent: ${s.accentColor}`);
                ctx.print(`available: ${ACCENT_VALUES.join(', ')}`, 'system');
                return;
            }
            if (!ACCENT_VALUES.includes(color as AccentColor)) {
                ctx.print(`unknown color: ${color}`, 'error');
                ctx.print(`available: ${ACCENT_VALUES.join(', ')}`, 'system');
                return;
            }
            s.setAccentColor(color as AccentColor);
            ctx.print(`accent → ${color}`, 'system');
        },
    },
    {
        name: 'wallpaper',
        description: 'set wallpaper phase or mode',
        usage: 'wallpaper [auto|dawn|noon|sunset|night]',
        source: 'builtin',
        run(ctx) {
            const arg = ctx.args[0];
            const s = useSettings.getState();
            if (!arg) {
                ctx.print(`mode: ${s.wallpaperMode}`);
                ctx.print(`phase: ${s.manualPhase}`);
                return;
            }
            if (arg === 'auto') {
                s.setWallpaperMode('auto');
                ctx.print('wallpaper → auto (by time of day)', 'system');
                return;
            }
            if (!SLOTS.find((x) => x.name === arg)) {
                ctx.print(`unknown phase: ${arg}`, 'error');
                return;
            }
            s.setManualPhase(arg as PhaseName);
            ctx.print(`wallpaper → manual · ${arg}`, 'system');
        },
    },
    {
        name: 'plugin',
        description: 'manage installed plugins',
        usage: 'plugin <list|demo|remove <id>|clear>',
        source: 'builtin',
        run(ctx) {
            const sub = ctx.args[0] ?? 'list';
            const store = usePluginStore.getState();

            if (sub === 'list') {
                if (store.plugins.length === 0) {
                    ctx.print('no plugins installed', 'system');
                    ctx.print('try `plugin demo` to install a sample', 'system');
                    return;
                }
                ctx.print(`${store.plugins.length} plugin(s) installed`, 'system');
                for (const p of store.plugins) {
                    ctx.print(`  ${p.id.padEnd(14)} ${p.name} v${p.version}`);
                    ctx.print(`                 ${p.description}`, 'system');
                    if (p.commands?.length) {
                        ctx.print(`                 commands: ${p.commands.map((c) => c.name).join(', ')}`, 'system');
                    }
                }
                return;
            }

            if (sub === 'demo') {
                store.install({
                    id: 'demo',
                    name: 'demo plugin',
                    version: '1.0.0',
                    description: 'sample plugin — adds a greet command',
                    author: 'arutOS',
                    commands: [
                        { name: 'greet', description: 'say hello', response: 'hello from the demo plugin ⚡' },
                    ],
                    installedAt: Date.now(),
                });
                ctx.print('installed `demo` plugin', 'system');
                ctx.print('try `greet` or `coin`', 'system');
                return;
            }

            if (sub === 'remove') {
                const id = ctx.args[1];
                if (!id) {
                    ctx.print('usage: plugin remove <id>', 'error');
                    return;
                }
                if (!store.has(id)) {
                    ctx.print(`not installed: ${id}`, 'error');
                    return;
                }
                store.remove(id);
                ctx.print(`removed plugin ${id}`, 'system');
                return;
            }

            if (sub === 'clear') {
                store.clear();
                ctx.print('all plugins removed', 'system');
                return;
            }

            ctx.print(`unknown subcommand: ${sub}`, 'error');
            ctx.print('usage: plugin <list|demo|remove <id>|clear>', 'system');
        },
    },
    {
        name: 'phase',
        description: 'inspect or lock the phase of open windows',
        usage: 'phase [lock|unlock|toggle <win-id>]',
        source: 'builtin',
        run(ctx) {
            const sub = ctx.args[0];
            const store = useWindowStore.getState();

            if (!sub || sub === 'list') {
                if (store.windows.length === 0) {
                    ctx.print('no windows open', 'system');
                    return;
                }
                ctx.print('  id       app          phase     mode');
                for (const w of store.windows) {
                    const mode = w.phaseMode === 'frozen' ? '[pinned]' : '[live]  ';
                    ctx.print(
                        `  ${w.id.padEnd(8)} ${w.appId.padEnd(12)} ${w.phase.padEnd(9)} ${mode}`,
                    );
                }
                return;
            }

            if (sub === 'lock' || sub === 'unlock' || sub === 'toggle') {
                const id = ctx.args[1];
                if (!id) {
                    ctx.print(`usage: phase ${sub} <win-id>`, 'error');
                    return;
                }
                const target = store.windows.find((w) => w.id === id);
                if (!target) {
                    ctx.print(`unknown window: ${id}`, 'error');
                    return;
                }
                const currentlyFrozen = target.phaseMode === 'frozen';
                const wantFrozen = sub === 'lock' ? true : sub === 'unlock' ? false : !currentlyFrozen;
                if (currentlyFrozen === wantFrozen) {
                    ctx.print(`${id} already ${wantFrozen ? 'pinned' : 'live'}`, 'system');
                    return;
                }
                store.togglePhaseLock(id);
                ctx.print(`${id} → ${wantFrozen ? 'pinned' : 'live'}`, 'system');
                return;
            }

            ctx.print(`unknown subcommand: ${sub}`, 'error');
            ctx.print('usage: phase [lock|unlock|toggle <win-id>]', 'system');
        },
    },
    {
        name: 'exit',
        description: 'close this terminal window',
        source: 'builtin',
        run() {
            const store = useWindowStore.getState();
            const term = store.windows.find((w) => w.appId === 'terminal');
            if (term) store.close(term.id);
        },
    },
];
