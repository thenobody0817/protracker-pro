# ProTracker Pro

A workout tracking app: session tabs, set-by-set logging, rest timers, themes and history — running in the browser.

## What it does

ProTracker Pro is a single-page tracker built with Next.js (App Router), React and
TypeScript. Five workout plans are built in:

| Tab | Session | Type |
|-----|---------|------|
| A | Push + Shoulders | strength |
| B | Pull + Arms | strength |
| C | Full Body | strength |
| X | Recovery / Mobility | mobility |
| Y | Warmup | warmup |

Every exercise carries its own reps, target sets, load, rest time, execution
instructions and "avoid" notes. Progress, history and settings are kept in the
browser's local storage — there is no account and no server-side state in the app
itself.

## Features

- Session tabs with a per-session progress ring.
- Exercise cards: tap a set to log it, tap it again to undo. Each card shows
  completed sets against the target and collapses when the exercise is done.
- Rest / work timer. It starts on its own when the last set of an exercise is
  completed, using that exercise's rest time, and can be extended or stopped.
- Timer end alert: a short beep (Web Audio) and a vibration pulse. Both can be
  switched off in the settings.
- Four themes: Glass, Midnight, Light, Cyber.
- Settings panel: theme, sound, vibration and the default rest time.
- History panel: history grouped by day, current streak, number of workouts,
  total volume (weight × sets), personal records and a last-7-days bar chart.
- Footer stats: session progress bar, exercises and sets completed, streak, and
  a button that resets the current workout.
- Backup: export a JSON file (`protracker-backup-<date>.json`) with sessions,
  history, personal records and settings, and import it back.
- Exercise detail dialog with the instructions, the "avoid" notes and fields for
  load and notes.

## Requirements

- [Bun](https://bun.sh) — the lockfile (`bun.lock`) and the scripts use Bun.
- Node.js 20 or newer works for `next dev` and `next build`, but `bun start`
  runs the built server with Bun.

No database or external service is needed for the app itself.

## Install

```bash
bun install
```

## Usage

```bash
# Development server on port 3000, output teed to dev.log
bun run dev

# Production build (static export into out/)
bun run build

# Lint
bun run lint
```

The app is served under the `basePath` set in `next.config.ts`
(`/protracker-pro`), so in development it is at
<http://localhost:3000/protracker-pro>.

`next.config.ts` uses `output: "export"`, so `bun run build` writes a static
export to `out/`. Any static server can host it; trailing slashes are enabled.
The `bun start` script expects `.next/standalone/server.js`, which the export
build does not produce.

## Configuration

- App state is persisted by Zustand under the local storage key
  `protracker-storage`: sessions, current session, settings, history, personal
  records and the exercises completed today.
- Settings live in the settings sheet (theme, sound, vibration, default rest
  time) and are stored with the rest of the state.
- `prisma/schema.prisma` defines a SQLite model (`WorkoutSession`, `Exercise`)
  and `db/custom.db` is the database file. The database scripts are
  `bun run db:generate`, `bun run db:push`, `bun run db:migrate` and
  `bun run db:reset`; they need `DATABASE_URL`. Environment files are
  git-ignored. The current UI does not use the database — it reads and writes
  browser storage only.
- Deployment helpers live in `.zscripts/`: `build.sh` installs dependencies,
  builds the app, pushes the database schema and packs the result, `start.sh`
  starts the server and Caddy. `build.sh` has the build path hard-coded to
  `/home/z/my-project`, so it only runs unchanged in the original sandbox.
  `Caddyfile` proxies port 81 to the app on port 3000.
- `examples/websocket/` contains a Socket.IO server and a small frontend
  example. It is not wired into the app.

## Limitations

- Data lives in one browser profile. Clearing site data loses it — use the JSON
  backup.
- No sync, no accounts, no server storage.
- History, streaks, personal records and the 7-day chart are only filled from
  an imported backup; the app does not write history entries during a workout
  yet.
- Editing load and notes in the exercise dialog is not stored: the save
  handler only shows a confirmation.
- Sound and vibration need a browser that allows them, and vibration is not
  available on every device.

## License

MIT — see [LICENSE](LICENSE).

Copyright (c) 2026 thenobody0817
