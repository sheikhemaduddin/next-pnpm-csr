# Bug: Next.js CSR static export deploys `.next/` instead of `out/` → 403 Forbidden

## Summary

When deploying a Next.js app with `output: 'export'` (CSR / static export), Cloudways build succeeds but the post-build **Deploy CSR (rsync to public_html)** step copies **`.next/`** into `public_html`. The browsable static site lives in **`out/`**, not `.next/`. The result is **403 Forbidden** in the browser.

## Environment

| Field | Value |
|-------|-------|
| App | next-pnpm-csr |
| Repo | https://github.com/sheikhemaduddin/next-pnpm-csr |
| Framework | Next.js 14.2.5 |
| Package manager | pnpm 9.7.0 |
| Node | 24 (platform switched from 22) |
| Rendering mode | CSR (`cloudways.json` → `"renderingMode": "csr"`) |
| `next.config.js` | `output: 'export'` |
| Host | Cloudways staging (`*.cloudwaysstagingapps.com`) |

## Expected vs Actual Output

### 1. Build log

**Expected**
```
$ pnpm run build
> next build

  ▲ Next.js 14.2.5

   Creating an optimized production build ...
 ✓ Compiled successfully
   Generating static pages (4/4)
 ✓ Generating static pages (4/4)

Route (app)                              Size     First Load JS
┌ ○ /                                    6.67 kB        93.8 kB
└ ○ /_not-found                          874 B            88 kB

○  (Static)  prerendered as static content

[exit_code: 0]
```

**Actual**
```
$ pnpm run build
> next build

  ▲ Next.js 14.2.5

   Creating an optimized production build ...
 ✓ Compiled successfully
   Generating static pages (4/4)
 ✓ Generating static pages (4/4)

Route (app)                              Size     First Load JS
┌ ○ /                                    6.67 kB        93.8 kB
└ ○ /_not-found                          874 B            88 kB

○  (Static)  prerendered as static content

[exit_code: 0]
```

Build output matches expected — **build is not the problem**.

---

### 2. Deploy / rsync step

**Expected**
```
[Deploy CSR (rsync to public_html)]
$ rsync -a --delete --exclude=".git*" \
  ".../private_html/out/" \
  ".../public_html/"
[exit_code: 0]
```

**Actual**
```
[2026-07-09 20:59:42 UTC] Deploy CSR (rsync to public_html)
$ rsync -a --delete --exclude=".git*" \
  "/home/40939.cloudwaysstagingapps.com/uurjbresdq/private_html/.next/" \
  "/home/40939.cloudwaysstagingapps.com/uurjbresdq/public_html/"
[exit_code: 0]

Finished : 2026-07-09 20:59:42 UTC
Status   : SUCCESS
```

Wrong rsync source: **`.next/`** deployed instead of **`out/`**.

---

### 3. Output directory on disk (after build, before deploy)

**Expected** (`private_html/` after `pnpm build`)
```
private_html/
├── out/                    ← static site (should be deployed)
│   ├── index.html
│   ├── 404.html
│   └── _next/static/...
├── .next/                  ← build artifacts (should NOT be deployed for CSR)
├── server.js
├── package.json
└── ...
```

**Actual**
```
private_html/
├── out/                    ← exists after build, never rsync'd
│   ├── index.html
│   ├── 404.html
│   └── _next/static/...
├── .next/                  ← rsync'd to public_html (wrong)
├── server.js
├── package.json
└── ...
```

---

### 4. `public_html/` after deploy (what the web server serves)

**Expected**
```
public_html/
├── index.html              ← entry point for browser
├── 404.html
└── _next/
    └── static/
        ├── chunks/...
        └── css/...
```

**Actual**
```
public_html/
├── server/                 ← from .next/ (not browsable)
├── static/                 ← partial Next internals, not a full site root
├── BUILD_ID
├── cache/
└── ...                     ← no index.html at root
```

No root `index.html` → Apache/Nginx returns **403 Forbidden**.

---

### 5. Browser / HTTP response

**Expected**
```
GET https://your-app.cloudwaysstagingapps.com/
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html lang="en">
  ...PitchPulse app...
</html>
```

**Actual**
```
GET https://your-app.cloudwaysstagingapps.com/
HTTP/1.1 403 Forbidden

Forbidden
```

---

### 6. Health check (if using `server.js` + PM2)

**Expected** (Node entry running, proxied or direct)
```
GET /healthz
HTTP/1.1 200 OK
Content-Type: application/json

{"ok":true,"mode":"next-custom-csr","runtime":"node v24.x.x"}
```

**Actual** (CSR rsync path — Node not serving traffic; static web root broken)
```
GET /healthz
HTTP/1.1 403 Forbidden   (or 404 — depends on nginx/apache config)
```

---

### 7. Cloudways dashboard — Output Directory field

| | Expected | Actual |
|---|----------|--------|
| **Dashboard / `cloudways.json`** | `out` (CSR rsync) or `.` (custom server) | `"outputDirectory": "."` in repo, but platform rsync'd **`.next/`** anyway |
| **Effective rsync source** | `out/` | `.next/` |

## Expected behavior

After `pnpm run build` with `output: 'export'`, Cloudways should deploy the **static export directory**:

```
out/
├── index.html
├── 404.html
└── _next/static/...
```

Either:

1. **CSR static deploy:** rsync `out/` → `public_html/`, **or**
2. **Custom-server deploy:** keep output at project root (`.`), start `server.js` via PM2, proxy traffic to Node (which serves `out/` internally) — and **do not** rsync `.next/` to `public_html`.

## Actual behavior

Build succeeds. Deploy step rsyncs the wrong folder:

```
[2026-07-09 20:59:42 UTC] Deploy CSR (rsync to public_html)
$ rsync -a --delete --exclude=".git*" \
  ".../private_html/.next/" \
  ".../public_html/"
```

- Source: **`.next/`** (Next.js build cache / server artifacts)
- Expected source: **`out/`** (static export) for CSR rsync deploy
- `out/` is produced by the build but never copied to `public_html`
- Browser returns **403 Forbidden** (directory in `public_html` has no servable `index.html`)

## Relevant app config

**`next.config.js`**
```js
output: 'export',
```

**`cloudways.json`**
```json
{
  "renderingMode": "csr",
  "framework": "nextjs",
  "outputDirectory": ".",
  "entryFile": "server.js",
  "startCommand": "pnpm start"
}
```

Platform ignored `outputDirectory: "."` and still rsynced `.next/`.

## Root cause (suspected)

Cloudways CSR deploy path for Next.js hardcodes or defaults the rsync source to **`.next/`**, which is correct for **SSR** (`next start`) but wrong for **static export** (`output: 'export'`), where the public artifact is **`out/`**.

## Impact

- Build reports **SUCCESS** but site is unreachable (403)
- Misleading — no build error; failure is in deploy artifact selection
- Affects any Next.js app using `output: 'export'` on Cloudways CSR deploy

## Correct output directory (by deploy mode)

| Cloudways deploy mode | Output Directory | What gets served |
|----------------------|------------------|------------------|
| **CSR rsync → public_html** (observed in logs) | **`out`** | Static files (`index.html`, assets) |
| **Custom server (`server.js` + PM2)** | **`.`** (project root) | Node serves `out/`; do not rsync `.next/` to public_html |
| **Next.js SSR** (`next start`) | **`.next`** | Node SSR via `next start` — not applicable to static export |

## Steps to reproduce

1. Deploy next-pnpm-csr (or any Next.js app with `output: 'export'`) on Cloudways with CSR rendering mode.
2. Run build — succeeds, static pages generated.
3. Observe deploy log: rsync source is `private_html/.next/`.
4. Open app URL → **403 Forbidden**.

## Suggested fix (platform)

1. When `next.config.js` contains `output: 'export'` (or `cloudways.json` has `"renderingMode": "csr"`), rsync **`out/`** → `public_html/`, not `.next/`.
2. Respect `cloudways.json` / dashboard **Output Directory** field instead of overriding with `.next/`.
3. If using custom `server.js` entry, skip rsync-to-public_html entirely and proxy to the Node process serving `out/`.
4. Fail deploy with a clear error if `out/` is missing after a static-export build.

## Workaround (until fixed)

Set **Output Directory** to **`out`** in the Cloudways dashboard if the platform supports CSR static rsync deploy — **only if** the deploy path is static rsync (no `server.js` / PM2).

If custom server is required (`server.js`, `/healthz`), output should remain **`.`** and the platform must **not** rsync `.next/` to `public_html`; traffic should go to the Node entry on `PORT`.
