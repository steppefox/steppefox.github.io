# steppefox.github.io

Static site served by GitHub Pages from `master`. Pomodoro timer lives at https://steppefox.github.io/pomodoro.

## Branches

- `source` — project source (`pomodoro/`: Vite 3 + React + TypeScript).
- `master` — compiled output only. **Do not edit by hand**; it is overwritten on each deploy.

## Develop

```sh
cd pomodoro
npm ci
npm run dev       # http://localhost:5173/pomodoro/
```

## Build

```sh
npm run build     # type-check + output to pomodoro/dist
npm run preview   # serve the build at http://localhost:4173/pomodoro/
```

`vite.config.ts` sets `base: '/pomodoro/'`. Static files (sound, icon, manifest) live in `pomodoro/public/`.
`public/service-worker.js` replaces the legacy Workbox worker (same URL/scope): it clears old caches and unregisters itself.

## Deploy

Pushing to `source` (changes under `pomodoro/`) runs `.github/workflows/deploy-pomodoro.yml`, which builds the app and
commits `pomodoro/dist` to `master:pomodoro/` as `github-actions[bot]`. It can also be run manually (workflow_dispatch).
Requirements: Settings → Pages set to "Deploy from branch: master, / (root)", and no branch protection on `master`
that blocks the bot. The workflow only triggers on `source`, so pushes to `master` don't re-trigger it.
