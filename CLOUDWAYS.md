# next-pnpm · Cloudways deploy (custom Node + Socket.IO)

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

## Critical: start via `server.js`

Cloudways must run the **custom entry file**, not stock `next start`:

- `package.json` → `"main": "server.js"`, `"start": "NODE_ENV=production node server.js"`
- `package.json` → `"cloudways.entryFile": "server.js"`
- `cloudways.json` → `"entryFile": "server.js"`

`server.js` attaches Socket.IO to the same HTTP server as Next and handles:

- `GET /healthz`
- `GET /api/live/poll` (HTTP fallback when `/socket.io` is blocked)
- `/socket.io/*` (polling + websocket upgrade)

## Proxy `/socket.io` to Node

Socket.IO XHR polling (`/socket.io/?EIO=4&transport=polling`) must reach the Node process.

On Cloudways:

1. **Application type / start**: persistent Node app with entry `server.js` (above).
2. **Varnish**: disable for this app (or purge + exclude `/socket.io` and `/api/live`). Cached polling responses cause `xhr poll error`.
3. **Nginx reverse proxy**: forward `/socket.io` (and WebSocket upgrade) to the app `PORT`. Do not rewrite the path away from `/socket.io`.
4. Verify after deploy:

```bash
curl -sS https://YOUR_APP/healthz
# → {"ok":true,"mode":"next-custom-ssr","entry":"server.js","socket":"socket.io",...}

curl -sS "https://YOUR_APP/socket.io/?EIO=4&transport=polling"
# → starts with `0{` (Engine.IO open packet), NOT HTML/404

curl -sS "https://YOUR_APP/api/live/poll"
# → {"ok":true,"mode":"http-poll","events":[...]}
```

If `/socket.io` returns HTML or 404, the Live Feed falls back to **HTTP poll** (`/api/live/poll`) automatically.

## Notes

- **Do not** set Output Directory to `.next` or `out` alone — `server.js` must be deployed.
- The app listens on `process.env.PORT` (Cloudways sets this).
- Env: `SUPABASE_URL` / `SUPABASE_ANON_KEY` (mapped to `NEXT_PUBLIC_*` in `next.config.js` at build time).
