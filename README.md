# arutOS

Personal site for [Arutosio](https://github.com/Arutosio) built as a browser-based desktop environment
inspired by Hyprland ricing. Windows you can drag, resize, minimize and stack.

## Stack

- **React 19** + **TypeScript 5** — strongly-typed window state
- **Vite 6** — dev server + build
- **Tailwind CSS 4** — design tokens in CSS, Catppuccin Mocha palette
- **react-rnd** — battle-tested drag + resize for windows
- **Zustand** — tiny store for window manager state
- **Framer Motion** — window open/close animations
- **lucide-react** — icon set

## Scripts

```bash
npm install      # one-time setup (or after pulling new deps)
npm run dev      # Vite dev server — hot reload at http://localhost:5173
npm run build    # Type-check + production build → dist/
npm run preview  # Serve the built dist/ locally
npm run typecheck
```

## Project layout

```
Files/              # static assets (videos, images, fonts, icons) — served at site root via Vite publicDir
src/
  App.tsx           # root shell
  main.tsx          # React entry
  index.css         # Tailwind 4 @theme tokens + base reset
  components/       # reusable UI: Wallpaper, Window, Taskbar, StartMenu, …
  apps/             # window content per "app" (Home, Bio, Projects, Donate)
  store/            # Zustand stores (window manager, settings, …)
  lib/              # pure helpers (time slots, github fetchers, …)
  types/            # shared TypeScript types
index.html          # Vite entry point
vite.config.ts
tsconfig*.json
```

## Wallpaper

Four `.webm` clips rotate by hour of day (dawn / noon / sunset / night).
Files live in `Files/Videos_webm/` and are resolved via Vite `publicDir`.
