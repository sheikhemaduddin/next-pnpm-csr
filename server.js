// Custom Next.js server (entry file: server.js).
// Runs Next.js as a persistent Node process + Socket.IO (polling-first).
const { createServer } = require('http');
const next = require('next');
const { Server } = require('socket.io');
const liveBus = require('./lib/liveBus');
const { authenticate, verifyToken } = require('./lib/auth/appAuth');

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

function sendJson(res, statusCode, body) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch (err) {
        reject(err);
      }
    });
    req.on('error', reject);
  });
}

function getAccessToken(req) {
  const custom = req.headers['x-access-token'];
  if (custom) return String(Array.isArray(custom) ? custom[0] : custom).trim();
  const auth = req.headers.authorization || '';
  if (String(auth).toLowerCase().startsWith('bearer ')) {
    return String(auth).slice(7).trim();
  }
  return null;
}

async function handleAuthLogin(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }
  try {
    const body = await readJsonBody(req);
    const email = String(body?.email || '').trim();
    const password = String(body?.password || '');
    if (!email || !password) {
      sendJson(res, 400, { error: 'Email and password required' });
      return;
    }
    const result = authenticate(email, password);
    if (!result) {
      sendJson(res, 403, { error: 'Invalid credentials' });
      return;
    }
    sendJson(res, 200, result);
  } catch {
    sendJson(res, 400, { error: 'Invalid JSON' });
  }
}

function handleAuthMe(req, res) {
  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }
  const user = verifyToken(getAccessToken(req));
  if (!user) {
    sendJson(res, 403, { error: 'Not authenticated' });
    return;
  }
  sendJson(res, 200, { user });
}

function sendHealthz(res) {
  sendJson(res, 200, {
    ok: true,
    mode: 'next-custom-ssr',
    entry: 'server.js',
    socket: 'socket.io',
    httpPoll: '/api/live/poll',
    transports: ['polling', 'websocket'],
    runtime: `node ${process.version}`,
  });
}

/** Long-poll live events in server.js so Cloudways always hits the Node process. */
function handleLivePoll(req, res, parsedUrl) {
  const since = parsedUrl.query.since || '';
  liveBus.ensureTicker();
  const existing = liveBus.recent(since);
  if (existing.length > 0) {
    sendJson(res, 200, {
      ok: true,
      mode: 'http-poll',
      events: existing,
      serverTime: new Date().toISOString(),
    });
    return;
  }

  let settled = false;
  let off = () => {};

  const finish = (events) => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    off();
    if (!events.length && !since) {
      liveBus.pushRandom();
      events = liveBus.recent(since);
    }
    sendJson(res, 200, {
      ok: true,
      mode: 'http-poll',
      events,
      serverTime: new Date().toISOString(),
    });
  };

  const timer = setTimeout(() => finish(liveBus.recent(since)), 2500);
  off = liveBus.onEvent(() => finish(liveBus.recent(since)));

  req.on('close', () => {
    if (settled) return;
    settled = true;
    clearTimeout(timer);
    off();
  });
}

app.prepare().then(() => {
  // Socket.IO registers its own 'request'/'upgrade' listeners on this server.
  // Do NOT pass /socket.io through Next — that breaks the polling handshake.
  const httpServer = createServer((req, res) => {
    if (req.url?.startsWith('/socket.io')) {
      return;
    }

    const parsedUrl = parseRequestUrl(req.url);

    if (parsedUrl.pathname === '/healthz') {
      sendHealthz(res);
      return;
    }

    // Served here (not only via Next) so the same liveBus instance is used.
    if (parsedUrl.pathname === '/api/live/poll') {
      handleLivePoll(req, res, parsedUrl);
      return;
    }

    // App login (independent of Supabase / Next bundling).
    if (parsedUrl.pathname === '/api/auth/login') {
      handleAuthLogin(req, res);
      return;
    }
    if (parsedUrl.pathname === '/api/auth/me') {
      handleAuthMe(req, res);
      return;
    }

    handle(req, res, parsedUrl);
  });
  const io = new Server(httpServer, {
    path: '/socket.io',
    transports: ['polling', 'websocket'],
    allowUpgrades: true,
    // Credentials off — Cloudways proxies often fail CORS preflight with cookies.
    cors: { origin: true, credentials: false },
    pingInterval: 25000,
    pingTimeout: 20000,
  });

  // Fan bus events out to all Socket.IO clients.
  liveBus.onEvent((event) => {
    io.emit('live:event', event);
  });

  io.on('connection', (socket) => {
    const transport = socket.conn.transport.name;
    console.log(`[socket.io] client connected transport=${transport} id=${socket.id}`);

    socket.emit('live:hello', {
      message: 'Connected to PitchPulse live feed',
      transport,
      at: new Date().toISOString(),
    });

    socket.emit('live:event', {
      type: 'goal',
      text: 'Live feed online — waiting for match events…',
      id: `hello-${socket.id}`,
      at: new Date().toISOString(),
    });

    socket.conn.on('upgrade', () => {
      socket.emit('live:transport', {
        transport: socket.conn.transport.name,
        at: new Date().toISOString(),
      });
    });

    socket.on('live:ping', (payload, ack) => {
      const response = { pong: true, echo: payload || null, at: new Date().toISOString() };
      if (typeof ack === 'function') ack(response);
      else socket.emit('live:pong', response);
    });

    socket.on('disconnect', (reason) => {
      console.log(`[socket.io] client disconnected id=${socket.id} reason=${reason}`);
    });
  });

  // Seed + broadcast mock events through the shared bus (Socket.IO + HTTP poll).
  liveBus.ensureTicker();

  httpServer.listen(port, () => {
    console.log(`[next-custom-ssr] ready on ${port} (${dev ? 'dev' : 'production'})`);
    console.log(`[socket.io] path=/socket.io transports=polling,websocket`);
    console.log(`[live] http poll fallback GET /api/live/poll`);
  });
});
