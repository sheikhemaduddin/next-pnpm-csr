// Custom Next.js server (entry file: server.js).
// Runs Next.js as a persistent Node process (SSR) in both dev and production —
// required so Server Components, Route Handlers, and middleware run per-request.
const { createServer } = require('http');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;

const app = next({ dev });
const handle = app.getRequestHandler();

function parseRequestUrl(reqUrl) {
  const url = new URL(reqUrl, 'http://localhost');
  return {
    pathname: url.pathname,
    query: Object.fromEntries(url.searchParams),
    search: url.search,
    href: url.href,
    path: `${url.pathname}${url.search}`,
  };
}

function sendHealthz(res) {
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: true, mode: 'next-custom-ssr', runtime: `node ${process.version}` }));
}

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parseRequestUrl(req.url);

    if (parsedUrl.pathname === '/healthz') {
      sendHealthz(res);
      return;
    }

    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`[next-custom-ssr] ready on ${port} (${dev ? 'dev' : 'production'})`);
  });
});
