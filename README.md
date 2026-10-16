# PitchPulse (next-pnpm)

Next.js SPA with a custom `server.js` entry — JWT login, Socket.IO / HTTP live poll, Cloudways-ready.

## Stack

| | |
|---|---|
| Entry | `server.js` (not `next start`) |
| Auth | App JWT via `X-Access-Token` (Cloudways Basic Auth safe) |
| Live feed | Socket.IO + HTTP poll fallback |
| Data | Local mock data (no Supabase) |

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build
pnpm start        # production — node server.js
```

Demo login: `demo@pitchpulse.app` / `pitchpulse`

## Cloudways

See [CLOUDWAYS.md](./CLOUDWAYS.md).
