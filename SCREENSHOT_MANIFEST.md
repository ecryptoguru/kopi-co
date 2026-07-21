# Kopi & Co. screenshot manifest

Only the required, privacy-safe captures are retained in `outputs/`. Old duplicates, browser-chrome captures, stale database views, and blank loading states were removed.

## Retained captures

- `S0.1.png` — cropped Codex project/thread view.
- `S2.1c.png`, `S2.2.png`, `S2.3.png`, `S2.4.png` — home, menu, about, and contact validation.
- `S3.2c-live-supabase-menu.png` — current menu rendered from the Singapore Supabase project.
- `S3.3.png`, `S3.4.png`, `S3.5-form.png`, `S3.5-confirmed.png`, `S3.6.png` — member-flow UI captures.
- `S5.1-before.png`, `S5.1-after.png`, `S5.2.png`, `S5.3b-production.png` — cart refinement, GitHub repository, and real Vercel production evidence.
- `S6.1b.png`, `S6.2.png`, `S6.3.png` — Kopi Catch states.

## Not retained or not available

- Historical desktop-only frames `S0.2`, `S2.1a`, `S2.1b`, `S2.1d`, `S3.1`, `S3.2b`, `S5.3a`, and `S6.1a` cannot be truthfully recreated after the fact.
- No Vercel dashboard frame is retained: access was gated by 2FA and the captured page was not valid evidence.
- No old Supabase table-editor frame is retained: it showed RLS disabled and is now stale.

## Current release facts

- Vercel target region: Singapore (`sin1`).
- Supabase project: `kopi-co-singapore`, Singapore (`ap-southeast-1`).
- Vercel production: `https://kopi-co.vercel.app`, GitHub-triggered `main` deployment from commit `c7f2481`, `READY`.
- Security check after the RLS migration: no Supabase security-advisor findings.
