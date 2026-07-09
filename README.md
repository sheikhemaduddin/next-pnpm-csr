# next-pnpm-csr

Next.js client-side SPA with a custom `server.js` entry — no SSR, static export, Cloudways-ready.

## Stack

| | |
|---|---|
| Rendering | Client-only (`ssr: false`, `output: 'export'`) |
| Dev | `server.js` runs Next in development mode |
| Production | `server.js` serves the static `out/` bundle |
| Health check | `GET /healthz` (handled outside Next) |

## Local development

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm build        # exports static site to out/
pnpm start        # production — serves out/
```

## Cloudways

See [CLOUDWAYS.md](./CLOUDWAYS.md) for the full deploy configuration.

Before pushing, regenerate the lockfile if dependencies changed:

```bash
./generate-lockfile.sh
```
