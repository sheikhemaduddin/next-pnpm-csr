# next-pnpm-csr · Cloudways deploy

| Field | Value |
|-------|-------|
| Framework Preset | Next.js |
| Package Manager | pnpm |
| Build Command | `pnpm install && pnpm build` |
| Output Directory | `.` *(project root — not `out` or `.next` alone)* |
| Entry File | `server.js` |
| Start Command | `pnpm start` |
| Rendering Mode | **CSR** *(see `cloudways.json`)* |
| Node | >=18.18.0 |

## How it works

1. `pnpm build` runs `next build` with `output: 'export'`, creating the static CSR bundle in `out/`.
2. `app/page.js` loads the SPA with `dynamic(..., { ssr: false })` — no server-side rendering.
3. `pnpm start` runs `server.js` in production mode, which serves files from `out/` with SPA fallback.
4. `GET /healthz` is handled directly by `server.js` for platform health checks.

## Detection signals

Cloudways should read CSR mode from:

- `cloudways.json` → `"renderingMode": "csr"`
- `package.json` → `"cloudways": { "renderingMode": "csr" }`
- `next.config.js` → `output: 'export'`
- `app/page.js` → `dynamic(..., { ssr: false })`

## Notes

- **Do not** set Output Directory to `.next` or `out` alone — `server.js` lives at the project root and must be included in the deploy.
- The app listens on `process.env.PORT` (Cloudways sets this automatically).
- Generate the lockfile with `./generate-lockfile.sh` before pushing.

## Verify after deploy

```bash
curl https://your-app-url/healthz
# → {"ok":true,"mode":"next-custom-csr","runtime":"node v..."}
```
