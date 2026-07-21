# Kopi & Co. course record

## Codex plugins and tools actually used

| Plugin/tool | Course purpose |
| --- | --- |
| Supabase MCP | Created and checked the Singapore database, live menu data, migrations, RLS policies, and security advisor. |
| Computer Use | Captured and reviewed browser-based release evidence in Brave. |
| Browser control | Verified the local app's rendered Supabase-backed menu and saved the clean live-data capture. |
| GitHub and Vercel | Repository and public-release evidence; these were services used, not Codex plugins. |

Chrome was requested but was not used for a verified capture, so it is intentionally not recorded as used.

## Error and resolution check

| Check | Result |
| --- | --- |
| Initial app data flow | Replaced `localStorage` menu/order/booking/game-score flows with Supabase reads and writes. |
| Supabase RLS | Was disabled on `menu_items`, `orders`, `bookings`, and `game_scores`; enabled with customer-owned and staff-only policies. |
| Security-definer helpers | Security advisor warned they were callable through the Data API; moved the staff helper to a private schema and revoked public execution. Recheck: no findings. |
| Build | `npm run build` passed. |
| Browser console | Local live-menu verification reported no warnings or errors. |
| Vercel dashboard evidence | 2FA blocked the dashboard; stale/blank capture was removed rather than presented as proof. |
| Historical Codex-only frames | The desktop bridge could not access Codex, so missing historical states are documented instead of fabricated. |
