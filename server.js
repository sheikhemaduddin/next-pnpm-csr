// Custom Next.js server (entry file: server.js).
// This mode is chosen when you need custom routing, middleware, or to attach
// Next to your own HTTP server. Cloudways "Entry File" should be set to server.js.
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const port = process.env.PORT || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    // Example of what a custom server enables: a plain health endpoint
    // handled outside Next's router.
    if (parsedUrl.pathname === '/healthz') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, mode: 'next-custom', runtime: `node ${process.version}` }));
      return;
    }
    handle(req, res, parsedUrl);
  }).listen(port, () => {
    console.log(`[next-custom] ready on ${port} (dev=${dev})`);
  });
});
