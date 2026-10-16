# next-pnpm · Cloudways deploy (custom Node + JWT + Socket.IO)

| Field | Value |
|-------|-------|
| Framework Preset | Next.js |
| Package Manager | pnpm |
| Build Command | `pnpm install && pnpm build` |
| Output Directory | `.` *(project root — not `out` or `.next` alone)* |
| Entry File | **`server.js`** *(not `next start`)* |
| Start Command | `pnpm start` → `NODE_ENV=production node server.js` |
| Rendering Mode | **SSR** *(custom Node server)* |
| Node | >=18.18.0 |

## App login (JWT — no Supabase)

PitchPulse uses **app JWT auth only**. The home SPA (and `/login`) show a login gate until signed in; **Log out** returns to that gate.

| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/login` | `{ email, password }` → `{ token, user }` |
| `GET /api/auth/me` | Current user via `X-Access-Token` |

Demo user: `demo@pitchpulse.app` / `pitchpulse`

Optional env: `JWT_SECRET` (or `APP_JWT_SECRET`) — defaults to a dev secret if unset.

## HTTP Basic Auth + app JWT

Cloudways Application Password Protection uses `Authorization` for Basic Auth.
The app JWT is sent only as **`X-Access-Token`** on same-origin calls — never as `Authorization: Bearer`.

Unauthenticated APIs return **403** (not 401) so the browser does not re-challenge Basic Auth.

## Critical: start via `server.js`

- `package.json` → `"main": "server.js"`, `"start": "NODE_ENV=production node server.js"`
- `cloudways.json` → `"entryFile": "server.js"`

`server.js` handles `/healthz`, `/api/auth/*`, `/api/live/poll`, and `/socket.io/*`.

## Proxy `/socket.io` to Node

1. Persistent Node app with entry `server.js`
2. Disable Varnish for this app (or exclude `/socket.io` and `/api/*`)
3. Forward `/socket.io` (and WebSocket upgrade) to the app `PORT`

```bash
curl -sS https://YOUR_APP/healthz
# → {"ok":true,"login":"app-jwt","entry":"server.js",...}
```

## Notes

- **Do not** set Output Directory to `.next` or `out` alone — `server.js` must be deployed.
- The app listens on `process.env.PORT` (Cloudways sets this).
- No Supabase (or other) database credentials are required.
