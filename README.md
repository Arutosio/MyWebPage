# arutOS

Personal site for [Arutosio](https://github.com/Arutosio) built as a browser-based desktop environment.
Draggable, resizable, stackable windows on top of a time-of-day animated wallpaper, with a built-in
terminal and a scalable plugin system.

> ⚠️ **This is proprietary personal work, not an open-source template.**
> See [Copyright & Rights](#copyright--rights) below before touching anything.

## Stack

- **React 19** + **TypeScript 5** — strongly-typed window state
- **Vite 6** — dev server + build
- **Tailwind CSS 4** — design tokens in CSS
- **react-rnd** — battle-tested drag + resize for windows
- **Zustand** — tiny store for window manager + settings + plugins
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
  components/       # reusable UI: Wallpaper, Window, TopBar, StartMenu, ClockPopover, SysInfoPopover, …
  apps/             # window content per "app" (Home, Bio, Projects, Donate, Settings, Terminal)
  store/            # Zustand stores (windows, settings, plugins)
  lib/              # pure helpers (time slots, phase theme, browser info, apps registry, terminal command registry)
  types/            # shared TypeScript types
index.html          # Vite entry point
vite.config.ts
tsconfig*.json
```

## Wallpaper

Four `.webm` clips rotate by hour of day (dawn / noon / sunset / night).
Files live in `Files/Videos_webm/` and are resolved via Vite `publicDir`.

## Copyright & Rights

**© 2020–2026 Arutosio. All rights reserved.**

This repository contains the source code, design, copy, configuration and
assets that make up the personal portfolio site of **Arutosio**. It is
published publicly on GitHub for transparency and as a showcase — **not**
as an open-source template, starter, or reusable boilerplate.

### What is NOT allowed (without prior written permission)

- Cloning, forking, copying or mirroring this repository to publish or
  host a site that reproduces the whole or any substantial part of it
- Copying the design, layout, window manager mechanic, phase-bound window
  system, copy, or brand identity into another project (commercial or
  personal) in a recognisable way
- Reusing the source code — in whole or in part — in any public or
  private project
- Training machine-learning models on the content of this repository
- Deploying this site (or a derivative) to any domain other than the ones
  owned by the copyright holder
- Removing or altering these copyright and license notices

### What IS allowed

- Reading the code privately for personal study / curiosity
- Referencing the repository in articles, tutorials, or reviews with an
  appropriate credit and link
- Reporting bugs, opening issues, and sending pull requests **to this
  repository** (contributions become subject to the same terms)

### Third-party assets

Some media shown inside the site (notably the background video clips
under `Files/Videos_webm/`) are short excerpts from animated works whose
copyright belongs to their respective owners. They are included for a
personal, non-commercial homage use. If you represent a rights holder
and want these removed, please open an issue.

Bundled third-party libraries (React, Vite, Tailwind CSS, react-rnd,
Zustand, Framer Motion, lucide-react, …) remain covered by their
respective upstream licenses.

### Contact

For licensing inquiries, permission requests, or takedown notices,
reach out via [GitHub issues](https://github.com/Arutosio) or the
channels linked inside the site.

See the full license text in [`LICENSE`](./LICENSE).
