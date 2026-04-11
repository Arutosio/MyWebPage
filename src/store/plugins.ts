import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

/**
 * Plugin system — scalable architecture for user-loaded extensions.
 *
 * Current scope (MVP):
 *  - Plugins register ONE or MORE terminal commands with a static response.
 *  - Plugins are persisted in localStorage.
 *  - Users install demo plugins via the terminal (`plugin demo`) or paste
 *    a manifest JSON (future).
 *
 * Future scope (not implemented yet):
 *  - UI plugins: iframe or dynamic ES-module apps that register a Window app.
 *  - File converters, mini-games, image processors, etc.
 *  - Plugin API surface that exposes arutOS capabilities safely.
 *
 * The shape here is designed to grow: add `ui`, `permissions`, `hooks`, etc.
 * without breaking existing plugins.
 */

export interface PluginCommandDef {
    name: string;
    description: string;
    /** Static output string (MVP). Future versions will support handler modules. */
    response?: string;
}

export interface PluginManifest {
    id: string;
    name: string;
    version: string;
    description: string;
    author?: string;
    commands?: PluginCommandDef[];
    installedAt: number;
}

export interface PluginsState {
    plugins: PluginManifest[];
    install: (manifest: PluginManifest) => void;
    remove: (id: string) => void;
    has: (id: string) => boolean;
    clear: () => void;
}

export const usePluginStore = create<PluginsState>()(
    persist(
        (set, get) => ({
            plugins: [],
            install: (manifest) =>
                set((s) => ({
                    plugins: [
                        ...s.plugins.filter((p) => p.id !== manifest.id),
                        manifest,
                    ],
                })),
            remove: (id) =>
                set((s) => ({
                    plugins: s.plugins.filter((p) => p.id !== id),
                })),
            has: (id) => get().plugins.some((p) => p.id === id),
            clear: () => set({ plugins: [] }),
        }),
        {
            name: 'arutOS.plugins.v1',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
