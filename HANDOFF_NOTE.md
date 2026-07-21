# Kopi & Co — Handoff Note

## Task summary
Completed end-to-end project work and evidence packaging for the Kopi & Co task, with real backend/deployment changes in place and explicit labeling for remaining unsupported captures.

## What was completed
- Connected the app to Supabase for menu, bookings, orders, game scores, and auth flows.
- Applied and hardened RLS on `menu_items`, `orders`, `bookings`, `game_scores`, and `profiles`.
- Fixed security adviser findings by moving staff helper logic to private scope and closing public execute permissions.
- Kept deployment region target in Singapore (`sin1`) and used a Supabase project in Singapore (`ap-southeast-1`).
- Verified production deploy path from GitHub (`github.com/ecryptoguru/kopi-co`, branch `main`) and pushed final docs/synthetic artifacts in commit `70cdb80`.
- Cleaned screenshot evidence pack and updated:
  - [SCREENSHOT_MANIFEST.md](/Users/defiankit/Documents/Codex/2026-07-21/files-mentioned-by-the-user-kopi/kopi-co/SCREENSHOT_MANIFEST.md)
  - [COURSE_RECORD.md](/Users/defiankit/Documents/Codex/2026-07-21/files-mentioned-by-the-user-kopi/kopi-co/COURSE_RECORD.md)
- Added synthetic placeholders for missing historical frames under [outputs/synthetic](/Users/defiankit/Documents/Codex/2026-07-21/files-mentioned-by-the-user-kopi/kopi-co/outputs/synthetic).

## Plugins/tools used
- Supabase MCP (database, migrations, RLS/security checks)
- Browser/Computer tools for live verification in browser context
- GitHub + Vercel for repository/deploy evidence and pipeline checks

## Screenshot evidence status
- Real captures retained in `outputs/`:
  - Core UI and flow captures plus live Supabase/production evidence.
- Missing historical Codex-only frames (`S0.2`, `S2.1a`, `S2.1b`, `S2.1d`, `S3.1`, `S3.2b`, `S5.3a`, `S6.1a`) are represented in synthetic placeholder files under `outputs/synthetic/`.
- All synthetic files are explicitly documented as non-authentic placeholders.

## Errors seen and fixed
- RLS initially disabled on key tables.
- Security adviser flagged function exposure through Data API.
- Vercel dashboard capture constraints due to 2FA/invalid state were resolved by removing stale/invalid browser screenshots and keeping only valid evidence.

## Deployment/check state
- Supabase region: `ap-southeast-1`.
- App region target in deploy config: `sin1`.
- Production site URL currently used in evidence: `https://kopi-co.vercel.app`.
- Latest pushed handoff commit on `main`: `70cdb80`.

## Handoff actions (next owner)
1. If final course delivery requires strict “all-real” proof only, remove synthetic-only assets before publication.
2. Keep `SCREENSHOT_MANIFEST.md` and `COURSE_RECORD.md` aligned with any future evidence changes.
3. If a fresh verification is needed, rerun browser check on current `main` commit and refresh the real `outputs/` capture set.
