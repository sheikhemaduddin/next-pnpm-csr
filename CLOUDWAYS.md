# next-custom · pnpm · CSR

| Field | Value |
|-------|-------|
| Framework Preset | Next.js |
| Package Manager | pnpm |
| Build Command | `pnpm install && pnpm build` |
| Output Directory | `.` *(project root — not `out` alone)* |
| Entry File | `server.js` |
| Start Command | `pnpm start` |
| Node | >=18.18.0 |

## How it works

1. `pnpm build` runs `next build` with `output: 'export'`, creating the static CSR bundle in `out/`.
2. `pnpm start` runs `server.js` in production mode, which serves files from `out/` with SPA fallback.
3. `GET /healthz` is handled directly by `server.js` for platform health checks.

## Notes

- **Do not** set Output Directory to `.next` or `out` alone — `server.js` lives at the project root and must be included in the deploy.
- The app listens on `process.env.PORT` (Cloudways sets this automatically).
- Generate the lockfile with `./generate-lockfile.sh` before pushing.

## Verify after deploy

```bash
curl https://your-app-url/healthz
# → {"ok":true,"mode":"next-custom-csr","runtime":"node v..."}
```
